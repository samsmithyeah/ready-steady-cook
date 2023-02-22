# Ready, Steady, Cook!

### Find recipes based on ingredients in your fridge

This is a project to help me learn React and coding in general. It uses the OpenAI GPT-3 completion API to generate recipes based on the user's ingredients. It's currently deployed to https://ready-steady-cook.vercel.app/.

## Prerequisites

- Install Vercel CLI (instructions here: https://vercel.com/docs/cli or just run `yarn global add vercel`
- To use the 'ai' part of the app, you'll need an OpenAI API key. You can get this by signing up here: https://beta.openai.com/signup
- To use the 'legacy' part of the app, you'll need an Edamam recipe API app ID and key. You can get these by signing up here: https://developer.edamam.com/edamam-recipe-api

## Get started

1. Clone this repo
2. Create a `.env` file in the project root containing the following:

```
REACT_APP_APP_ID=<your Edamam app ID here>
REACT_APP_APP_KEY=<your Edamam key here>
OPENAI_API_KEY=<your OpenAI key here>
REACT_APP_RECIPE_URL='http://localhost:3000/api/recipe'
REACT_APP_IMAGE_URL='http://localhost:3000/api/image'
```

3. Run the app with `vercel dev`

The app should then be running at http://localhost:3000
