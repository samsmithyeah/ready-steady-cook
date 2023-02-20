export const config = {
  runtime: 'edge', // this is a pre-requisite
  regions: ['iad1'], // only execute this function on iad1
};

export default async function image(req) {
  const reqJson = await req.json();
  const { recipeTitle } = reqJson;
  const prompt = `Photo of ${recipeTitle}. Award winning food photography.`;

  const payload = {
    prompt,
    n: 1,
    size: '256x256',
  };

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const resJson = await response.json();
  const imageURL = resJson.data[0].url;
  const responseBody = { imageURL };
  const responseHeaders = { 'Content-Type': 'application/json' };
  const responseObj = new Response(JSON.stringify(responseBody), {
    headers: responseHeaders,
  });

  return responseObj;
}
