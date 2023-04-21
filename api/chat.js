export const config = {
  runtime: 'edge',
  regions: ['iad1'],
};

export default async function chat(req) {
  const reqJson = await req.json();
  const { recipeData, conversation } = reqJson;
  console.log(recipeData);

  const initialPrompt = `You are a world renowned chef, and you invented this recipe. You give accurate answers to anything the user wants to know about the recipe. You are also happy to give your opinion and/or recommendations if required. The user is chatting with you about the following recipe:

Recipe: ${recipeData.title}
Prep time: ${recipeData.prep_time}
Cook time: ${recipeData.cook_time}
Total time: ${recipeData.total_time}
Servings: ${recipeData.servings}
Description: ${recipeData.description}
Ingredients: ${recipeData.ingredients.join(', ')}
Method: ${recipeData.method.join('\n')}

`;

  const messages = [
    { role: 'system', content: initialPrompt },
    ...conversation,
  ];

  const payload = {
    model: 'gpt-3.5-turbo-0301',
    messages: messages,
    temperature: 0.5,
    max_tokens: 250,
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

  const responseBody = { aiResponse };
  const responseHeaders = { 'Content-Type': 'application/json' };
  const responseObj = new Response(JSON.stringify(responseBody), {
    headers: responseHeaders,
  });

  return responseObj;
}
