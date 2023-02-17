const { Configuration, OpenAIApi } = require('openai');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export default async function handler(req, res) {
  const { ingredients, cuisineType } = req.body;

  const basePrompt = `Generate a recipe containing the following ingredients: ${ingredients.join(
    ', ',
  )}

Feel free to include other common ingredients in the recipe. Format the recipe in HTML, aligned to the left.

Include the following sections in the recipe:
- Title
- Prep time
- Cook time
- Total time
- Servings
- Brief description, perhaps including the origin of the dish
- Ingredients
- Method`;
  const prompt = cuisineType
    ? `${basePrompt}

The type of cuisine should be: ${cuisineType}

The recipe is as follows:`
    : `${basePrompt}

The recipe is as follows:`;

  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt,
    max_tokens: 1000,
    temperature: 0,
  });
  const recipe = response.data.choices[0].text;
  res.send({ recipe });
}
