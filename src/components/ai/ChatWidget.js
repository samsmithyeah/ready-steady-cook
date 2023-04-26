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

    const responseJson = await response.json();

    if ('updatedRecipeJson' in responseJson) {
      const { updatedRecipeJson, chatMessage, uuid } = responseJson;
      setIsUpdatedRecipe(true);
      setRecipeLatestVersion(updatedRecipeJson);
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
        title="🤖 Recipe Chat 🤖"
        subtitle="Ask the AI anything about your recipe!"
        showTimeStamp={false}
      />
    </div>
  );
}
