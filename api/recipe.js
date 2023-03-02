export const config = {
  runtime: 'edge',
  regions: ['iad1'],
};

export default async function recipe(req) {
  const reqJson = await req.json();
  const { ingredients, cuisineType } = reqJson;

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

Output the recipe in JSON format, with a key for each section (title, prepTime, cookTime, totalTime, servings, description, ingredients, method). Don't include numbers in the list steps.`;
  const prompt = cuisineType
    ? `${basePrompt}

The type of cuisine should be: ${cuisineType}

The recipe is as follows:`
    : `${basePrompt}

The recipe is as follows:`;

  const payload = {
    model: 'gpt-3.5-turbo-0301',
    messages: [{ role: 'user', content: prompt }],
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

  const resJson = await response.json();
  const recipe = resJson.choices[0].message.content;
  const responseBody = { recipe };
  const responseHeaders = { 'Content-Type': 'application/json' };
  const responseObj = new Response(JSON.stringify(responseBody), {
    headers: responseHeaders,
  });

  return responseObj;
}
