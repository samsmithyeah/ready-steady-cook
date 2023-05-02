import supabase from '../src/supabaseClient';

export const config = {
  runtime: 'edge',
  regions: ['iad1'],
};

export default async function image(req) {
  const reqJson = await req.json();
  const { recipeTitle, uuid } = reqJson;
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

  // Download the image as a Blob
  const imageResponse = await fetch(imageURL);
  const imageBlob = await imageResponse.blob();

  // Convert the Blob to a File
  const imageFile = new File([imageBlob], `${uuid}.jpg`, {
    type: 'image/jpeg',
  });

  // Upload the File to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('recipe-images')
    .upload(imageFile.name, imageFile, {
      cacheControl: 'public, max-age=31536000',
    });

  if (uploadError) {
    console.error('Error uploading image to Supabase Storage:', uploadError);
  }

  // Get the public URL of the uploaded image
  const imagePath = supabase.storage
    .from('recipe-images')
    .getPublicUrl(imageFile.name);

  // Update the `recipes` table with the image URL
  const { error: updateError } = await supabase
    .from('recipes')
    .update({ image_url: imagePath.data.publicUrl })
    .eq('id', uuid);

  if (updateError) {
    console.error('Error updating recipe with image URL:', updateError);
  }

  async function deleteOldestImages(limit) {
    try {
      // Fetch the list of images from Supabase Storage
      const { data: fileList, error: listError } = await supabase.storage
        .from('recipe-images')
        .list('', { limit: 0 });

      if (listError) {
        console.error(
          'Error fetching image list from Supabase Storage:',
          listError,
        );
        return;
      }

      // Sort the images by their creation date (ascending)
      const sortedImages = fileList.sort((a, b) =>
        a.last_modified.localeCompare(b.last_modified),
      );

      // If the number of images exceeds the limit, delete the oldest images
      if (sortedImages.length > limit) {
        const imagesToDelete = sortedImages.slice(
          0,
          sortedImages.length - limit,
        );

        for (const image of imagesToDelete) {
          const { error: deleteError } = await supabase.storage
            .from('recipe-images')
            .remove([image.name]);

          if (deleteError) {
            console.error(
              'Error deleting image from Supabase Storage:',
              deleteError,
            );
          } else {
            console.log(`Deleted image: ${image.name}`);

            // Set the image_url field in the DB to NULL for the deleted image
            const imageNameWithoutExtension = image.name.replace(
              /\.[^/.]+$/,
              '',
            );
            const { error: updateError } = await supabase
              .from('recipes')
              .update({ image_url: null })
              .eq('id', imageNameWithoutExtension);

            if (updateError) {
              console.error(
                'Error setting image_url to NULL in the database:',
                updateError,
              );
            } else {
              console.log(
                `Set image_url to NULL for recipe with id: ${imageNameWithoutExtension}`,
              );
            }
          }
        }
      }
    } catch (error) {
      console.error('Error while deleting oldest images:', error);
    }
  }
  // Delete the oldest images if the total number of images exceeds 5000
  deleteOldestImages(5000);

  const responseBody = { imageURL: imagePath.data.publicUrl };
  const responseHeaders = { 'Content-Type': 'application/json' };
  const responseObj = new Response(JSON.stringify(responseBody), {
    headers: responseHeaders,
  });

  return responseObj;
}
