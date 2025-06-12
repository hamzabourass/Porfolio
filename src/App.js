import React from 'react';
import { About, Footer, Header, Skills, Work, Testimonial } from './container';
import { Navbar } from './components';
import ChatComponent from './components/chat-bot'; // Import the Chatbot component
import './App.scss';

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <Header />
      <About />
      <Work />
      <Skills />
      <Testimonial />
      <Footer />
      <ChatComponent />
    </div>
  );
};

export default App;
