import React, { useEffect } from 'react';

const DialogflowMessenger = () => {
  useEffect(() => {
    // Load Dialogflow stylesheet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css';
    document.head.appendChild(link);

    // Load Dialogflow script
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js';
    script.async = true;
    document.body.appendChild(script);

    // Create custom styles
    const style = document.createElement('style');
    style.textContent = `
      df-messenger {
        z-index: 999;
        position: fixed;
        --df-messenger-font-color: #000;
        --df-messenger-font-family: Google Sans;
        --df-messenger-chat-background: #f3f6fc;
        --df-messenger-message-user-background: #d3e3fd;
        --df-messenger-message-bot-background: #fff;
        bottom: 16px;
        right: 16px;
      }
    `;
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <df-messenger
      location="us-central1"
      project-id="porfolio-agent"
      agent-id="d57a17a7-8a2c-4405-a9b9-cd7a1bc0d0af"
      language-code="en"
      max-query-length="-1"
    >
      <df-messenger-chat-bubble chat-title="Portfolio Agent">
      </df-messenger-chat-bubble>
    </df-messenger>
  );
};

export default DialogflowMessenger;