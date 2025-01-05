// DialogflowMessenger.jsx
import React, { useEffect, useState } from 'react';

import './dialogflow.scss';

const DialogflowMessenger = () => {
    const [showButton, setShowButton] = useState(true);
  
    useEffect(() => {
      const script = document.createElement('script');
      script.src = "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
      script.async = true;
      document.body.appendChild(script);
  
      return () => {
        document.body.removeChild(script);
      };
    }, []);
  
    const openChat = () => {
      const dfMessenger = document.querySelector('df-messenger');
      if (dfMessenger) {
        dfMessenger.setAttribute('expand', true);
        setShowButton(false); // Hide the button after clicking
      }
    };
  
    return (
      <div className="dialogflow-container">
        {showButton && (
          <button onClick={openChat} className="chat-trigger">
            Need help? Chat with us!
          </button>
        )}
  
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