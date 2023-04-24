import { v4 as uuidv4 } from 'uuid';

export const config = {
  runtime: 'edge',
  regions: ['iad1'],
};

export default async function chat(req) {
  const reqJson = await req.json();
  console.log(reqJson);
  const { recipeData, conversation } = reqJson;

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
    recipeData.input_ingredients.join(', ') ||
    recipeData.inputIngredients.join(', ')
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

Output the recipe in JSON format, with a key for each section:

title (string)
prepTime (string)
cookTime (string)
totalTime (string)
servings (string)
description (string)
ingredients (array of strings)
method (array of strings)

Don't include numbers in the list steps.
`;

  const messages = [
    { role: 'system', content: initialPrompt },
    ...conversation,
  ];

  console.log(messages);

  const payload = {
    model: 'gpt-3.5-turbo-0301',
    messages: messages,
    temperature: 0.5,
    max_tokens: 1000,
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const responseJson = await response.json();
  const aiResponse = responseJson.choices[0].message.content;
  let responseBody;
  if (aiResponse.includes('title')) {
    const startIndex = aiResponse.indexOf('{');
    const endIndex = aiResponse.lastIndexOf('}');
    const updatedRecipe =
      startIndex !== -1 && endIndex !== -1
        ? aiResponse.slice(startIndex, endIndex + 1)
        : '';
    const updatedRecipeJson = JSON.parse(updatedRecipe);
    const uuid = uuidv4();
    const chatMessage =
      'I have generated a new recipe for you. You should be redirected to the new recipe shortly.';
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
