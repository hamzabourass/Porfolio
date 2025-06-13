import React from 'react';
import { About, Footer, Header, Skills, Work, Testimonial } from './container';
import { Navbar } from './components';
import ChatComponent from './components/chat-bot';
import './App.scss';

const App = () => {
  // Simple navigation handler using section IDs
  const handleChatNavigation = (section) => {
    console.log(`Navigating to: ${section}`);
    
    // Find element by ID and scroll to it
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      console.warn(`Section with ID "${section}" not found`);
    }
    
    // Update URL hash
    window.history.pushState({}, '', `#${section}`);
  };

  return (
    <div className="app">
      <Navbar />
      
      {/* Add IDs to each section */}
      <section id="home">
        <Header />
      </section>
      
      <section id="about">
        <About />
      </section>
      
      <section id="work">
        <Work />
      </section>
      
      <section id="skills">
        <Skills />
      </section>
      
      <section id="testimonials">
        <Testimonial />
      </section>
      
      <section id="contact">
        <Footer />
      </section>
      
      <ChatComponent onNavigate={handleChatNavigation} />
    </div>
  );
};

export default App;