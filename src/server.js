const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const REACT_APP_OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

app.post('/generate-recipe', async (req, res) => {
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
    apiKey: REACT_APP_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt,
    max_tokens: 1000,
    temperature: 0,
  });
  const recipe = response.data.choices[0].text;
  res.send({ recipe });
});

app.listen(3001, () => {
  console.log('Server is listening on port 3001');
});
