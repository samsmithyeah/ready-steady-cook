import supabase from '../src/supabaseClient';

export const config = {
  runtime: 'edge',
  regions: ['iad1'],
};

export default async function generateRecipe(req) {
  const reqJson = await req.json();
  const { ingredients, cuisineType, uuid } = reqJson;

  const basePrompt = `Generate a recipe containing the following ingredients: ${ingredients.join(
    ', ',
  )}

Feel free to include other common ingredients in the recipe.

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

Don't include numbers in the list steps.`;
  const prompt = cuisineType
    ? `${basePrompt}

The type of cuisine should be: ${cuisineType}

The recipe is as follows:`
    : `${basePrompt}

The recipe is as follows:`;

  const payload = {
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    max_tokens: 1000,
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
  const recipe = responseJson.choices[0].message.content;
  const recipeJson = JSON.parse(recipe);

  const { data, error } = await supabase.from('recipes').insert([
    {
      id: uuid,
      input_ingredients: ingredients,
      input_cuisine_type: cuisineType,
      title: recipeJson.title,
      prep_time: recipeJson.prepTime,
      cook_time: recipeJson.cookTime,
      total_time: recipeJson.totalTime,
      servings: recipeJson.servings,
      description: recipeJson.description,
      ingredients: recipeJson.ingredients,
      method: recipeJson.method,
    },
  ]);

  if (error) {
    console.error('Error storing recipe in Supabase:', error);
  }

  const responseBody = { recipe, uuid };
  const responseHeaders = { 'Content-Type': 'application/json' };
  const responseObj = new Response(JSON.stringify(responseBody), {
    headers: responseHeaders,
  });

  return responseObj;
}
