import { v4 as uuidv4 } from 'uuid';
import supabase from '../src/supabaseClient';

export const config = {
  runtime: 'edge',
  regions: ['iad1'],
};

export default async function chat(req) {
  const reqJson = await req.json();
  //console.log(reqJson);
  const { recipeData, inputIngredients, cuisineType, conversation } = reqJson;

  const initialPrompt = `You are a world renowned chef, and you invented this recipe based on some ingredients the user has given you. The user may have also told you a cuisine type to follow. You give accurate answers to anything the user wants to know about the recipe. You are also happy to give your opinion and/or recommendations if required. The user is chatting with you about the following recipe:

Recipe: ${recipeData.title}
Prep time: ${recipeData.prep_time || recipeData.prepTime}
Cook time: ${recipeData.cook_time || recipeData.cookTime}
Total time: ${recipeData.total_time || recipeData.totalTime}
Servings: ${recipeData.servings}
Description: ${recipeData.description}
Ingredients: ${recipeData.ingredients.join(', ')}
Method: ${recipeData.method.join('\n')}
User input ingredients: ${
    recipeData.input_ingredients
      ? recipeData.input_ingredients.join(', ')
      : inputIngredients.join(', ')
  }

User input cuisine type: ${
    recipeData.input_cuisine_type ? recipeData.input_cuisine_type : cuisineType
  }

You also have the ability to:
- Modify the recipe
- Generate a new recipe

You should offer to do this if the user's requests are not possible with the current recipe. In this scenario, ask the user to confirm that they are happy for you to modify or regenerate the recipe. Unless the user has told you otherwise, stick to the input ingredients and cuisine type they originally specified. If they confirm, then you should reply in json format:

Include the following sections in the recipe:
- Title
- Prep time
- Cook time
- Total time
- Servings
- Brief description, perhaps including the origin of the dish
- Ingredients
- Method
- User input ingredients
- User input cuisine type

Output the recipe in JSON format, with a key for each section:

title (string)
prepTime (string)
cookTime (string)
totalTime (string)
servings (string)
description (string)
ingredients (array of strings)
method (array of strings)
inputIngredients (array of strings)
inputCuisineType (string)

Don't include numbers in the list steps.

Before you output the recipe, you should check that the recipe is in json format. It must always be in json format.
`;

  const messages = [
    { role: 'system', content: initialPrompt },
    ...conversation,
  ];

  const payload = {
    messages: messages,
    temperature: 0.5,
    max_tokens: 4096,
  };

  const response = await fetch(
    'https://sam-openai-instance.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-06-01-preview',
    {
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.AZURE_OPENAI_API_KEY,
      },
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );

  const responseJson = await response.json();
  const aiResponse = responseJson.choices[0].message.content;
  let responseBody;
  if (aiResponse.includes('title' && 'prepTime' && 'cookTime' && 'totalTime')) {
    const startIndex = aiResponse.indexOf('{');
    const endIndex = aiResponse.lastIndexOf('}');
    const updatedRecipe =
      startIndex !== -1 && endIndex !== -1
        ? aiResponse.slice(startIndex, endIndex + 1)
        : '';
    const updatedRecipeJson = JSON.parse(updatedRecipe);
    const uuid = uuidv4();
    const chatMessage =
      'I have generated a new recipe for you. What do you think?';
    const { data, error } = await supabase.from('recipes').insert([
      {
        id: uuid,
        title: updatedRecipeJson.title,
        prep_time: updatedRecipeJson.prepTime,
        cook_time: updatedRecipeJson.cookTime,
        total_time: updatedRecipeJson.totalTime,
        servings: updatedRecipeJson.servings,
        description: updatedRecipeJson.description,
        ingredients: updatedRecipeJson.ingredients,
        method: updatedRecipeJson.method,
        input_ingredients: updatedRecipeJson.inputIngredients,
        input_cuisine_type: updatedRecipeJson.inputCuisineType,
        is_regenerated: true,
      },
    ]);

    if (error) {
      console.error('Error storing recipe in Supabase:', error);
    }
    responseBody = { uuid, chatMessage, updatedRecipeJson };
  } else {
    responseBody = { aiResponse };
  }

  const responseHeaders = { 'Content-Type': 'application/json' };
  const responseObj = new Response(JSON.stringify(responseBody), {
    headers: responseHeaders,
  });

  return responseObj;
}
