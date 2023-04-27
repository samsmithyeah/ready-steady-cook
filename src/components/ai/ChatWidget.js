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
    setIsError,
    setIngredientsLatestVersion,
  } = props;

  const { ingredients, cuisineType } = useSelector((state) => state.input);

  async function handleNewUserMessage(message) {
    // Add the user message to the conversation
    toggleMsgLoader();
    const newConversation = [
      ...conversation,
      { role: 'user', content: message },
    ];
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
      setIsError(true);
      console.error(error);
    }

    if ('updatedRecipeJson' in responseJson) {
      const { updatedRecipeJson, chatMessage, uuid } = responseJson;
      setIsUpdatedRecipe(true);
      setRecipeLatestVersion(updatedRecipeJson);
      setIngredientsLatestVersion(updatedRecipeJson.inputIngredients);
      setConversation([
        ...newConversation,
        { role: 'assistant', content: chatMessage },
      ]);
      addResponseMessage(chatMessage);
      toggleMsgLoader();
      history.push(`/recipe/${uuid}`);
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
