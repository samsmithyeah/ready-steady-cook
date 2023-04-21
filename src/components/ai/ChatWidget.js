import { useState } from 'react';
import { Widget, addResponseMessage, toggleMsgLoader } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

export default function ChatWidget(props) {
  const { recipeLatestVersion, classes } = props;

  const [conversation, setConversation] = useState([]);

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
        conversation: newConversation,
      }),
    });

    const responseJson = await response.json();
    const aiResponse = responseJson.aiResponse;

    // Add the AI response to the conversation
    setConversation([
      ...newConversation,
      { role: 'assistant', content: aiResponse },
    ]);
    addResponseMessage(aiResponse);
    toggleMsgLoader();
  }

  return (
    <div className={classes.widgetContainer}>
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title="Live Chat"
        subtitle="Ask us anything!"
      />
    </div>
  );
}
