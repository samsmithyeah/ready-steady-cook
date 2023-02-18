const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const config = {
  runtime: 'edge', // this is a pre-requisite
  regions: ['iad1'], // only execute this function on iad1
};

export default async function handler(req, res) {
  const reqJson = await req.json();
  console.log(reqJson);
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
    model: 'text-davinci-003',
    prompt,
    temperature: 0.5,
    max_tokens: 1000,
  };

  const response = await fetch('https://api.openai.com/v1/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const resJson = await response.json();
  const recipe = resJson.choices[0].text;
  const responseBody = { recipe };
  const responseHeaders = { 'Content-Type': 'application/json' };
  const responseObj = new Response(JSON.stringify(responseBody), {
    headers: responseHeaders,
  });

  return responseObj;
}
