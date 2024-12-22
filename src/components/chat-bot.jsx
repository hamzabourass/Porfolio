// DialogflowMessenger.jsx
import React, { useEffect, useState } from 'react';
import './dialogflow.scss';

const DialogflowMessenger = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Dialogflow Messenger script
    const script = document.createElement('script');
    script.src = "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const openChat = () => {
    // Get the messenger element
    const dfMessenger = document.querySelector('df-messenger');
    if (dfMessenger) {
      // Toggle chat window
      dfMessenger.setAttribute('expand', true);
    }
  };

  return (
    <div className="dialogflow-container">
 
      {/* Dialogflow messenger */}
      <df-messenger
        intent="WELCOME"
        chat-title="Sankaro"
        agent-id="5041f418-fad1-45c4-8214-e40b645b54fc"
        language-code="en"
      />
    </div>
  );
};

export default DialogflowMessenger;