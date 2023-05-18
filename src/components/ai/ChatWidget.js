import { Widget, addResponseMessage, toggleMsgLoader } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import { useSelector } from 'react-redux';

export default function ChatWidget(props) {
  const {
    recipeLatestVersion,
    classes,
    history,
    setRecipeLatestVersion,
    conversation,
    setConversation,
    setIsUpdatedRecipe,
    setIngredientsLatestVersion,
    handleGenerateImage,
  } = props;

  const { ingredients, cuisineType } = useSelector((state) => state.input);

  async function handleNewUserMessage(message) {
    // Add the user message to the conversation
    toggleMsgLoader();
    let newConversation = [...conversation, { role: 'user', content: message }];
    setConversation(newConversation);

    let responseJson;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeData: recipeLatestVersion,
          inputIngredients: ingredients,
          cuisineType,
          conversation: newConversation,
        }),
      });

      responseJson = await response.json();
    } catch (error) {
      console.error(error);
    }

    if ('updatedRecipeJson' in responseJson) {
      const { updatedRecipeJson, chatMessage, uuid } = responseJson;
      setIsUpdatedRecipe(true);
      setRecipeLatestVersion(updatedRecipeJson);
      setIngredientsLatestVersion(updatedRecipeJson.inputIngredients);
      const newRecipePrompt = `The updated recipe (which you generated) is as follows:

Title: ${updatedRecipeJson.title}
Prep time: ${updatedRecipeJson.prepTime}
Cook time: ${updatedRecipeJson.cookTime}
Total time: ${updatedRecipeJson.totalTime}
Servings: ${updatedRecipeJson.servings}
Description: ${updatedRecipeJson.description}
Ingredients: ${updatedRecipeJson.ingredients.join(', ')}
Method: ${updatedRecipeJson.method.join('\n')}

Remember, you are a world-renowned chef, and you have the ability to:
- Modify the recipe
- Generate a new recipe

Which ONLY WHEN ASKED TO DO BY THE USER you must output in json format (as described in your initial prompt).`;
      newConversation = [
        ...conversation,
        { role: 'assistant', content: chatMessage },
        { role: 'system', content: newRecipePrompt },
      ];
      setConversation(newConversation);
      addResponseMessage(chatMessage);
      toggleMsgLoader();
      history.push(`/recipe/${uuid}`);
      handleGenerateImage(updatedRecipeJson.title, uuid);
    } else {
      const aiResponse = responseJson.aiResponse;

      // Add the AI response to the conversation
      setConversation([
        ...newConversation,
        { role: 'assistant', content: aiResponse },
      ]);
      addResponseMessage(aiResponse);
      toggleMsgLoader();
    }
  }

  return (
    <div className={classes.widgetContainer}>
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        emojis={true}
        title="🤖 AI Chef Chat 🤖"
        subtitle="Ask the AI anything about your recipe! You can even ask it to regenerate the recipe for you if there are any specific changes you'd like to see."
        showTimeStamp={false}
      />
    </div>
  );
}
