import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, X, MessageSquare, Sparkles, Zap } from 'lucide-react';
import { GroqService } from '../services/groqService';
import { ContextService } from '../services/contextService';
import MarkdownMessage from './ui/MarkdownMessage';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const groqService = useRef(new GroqService());
  const contextService = useRef(null);

  // Initialize services
  useEffect(() => {
    const success = groqService.current.initialize();
    if (success) {
      contextService.current = new ContextService(groqService.current.groq);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading || !groqService.current.isInitialized) return;

    const userMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Step 1: Classify the query and select relevant context
      const { context, category } = await contextService.current.classifyAndSelectContext(input);
      
      // Step 2: Generate response with selected context
      const conversationHistory = [...messages, userMessage];
      
      // Simulate typing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const response = await groqService.current.generateResponse(conversationHistory, context, category);
      
      setIsTyping(false);
      const botMessage = { 
        role: 'assistant', 
        content: response, 
        timestamp: new Date(),
        category
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      setIsTyping(false);
      const errorMessage = { 
        role: 'assistant', 
        content: `I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
    setTimeout(() => handleSubmit(), 100);
  };

  const status = groqService.current.getStatus();
  const quickPrompts = contextService.current?.getQuickPrompts() || [
    "Tell me about your experience",
    "What projects have you worked on?",
    "What are your technical skills?",
    "How can I contact you?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50" style={{ fontFamily: 'var(--font-base)' }}>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full opacity-20" style={{ backgroundColor: 'var(--secondary-color)' }}></div>
          
          <button
            onClick={() => setIsOpen(true)}
            className="relative w-16 h-16 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 flex items-center justify-center group overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, var(--secondary-color) 0%, #4c63d2 100%)`,
              boxShadow: '0 20px 40px rgba(49, 59, 172, 0.3)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Sparkles className="absolute top-2 right-2 h-3 w-3 text-white/60 animate-pulse" />
            <MessageSquare className="h-7 w-7 text-white relative z-10 group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="w-[420px] h-[650px] rounded-3xl shadow-2xl border overflow-hidden backdrop-blur-xl"
          style={{ 
            background: 'linear-gradient(145deg, var(--white-color) 0%, #fafbff 100%)',
            borderColor: 'var(--lightGray-color)',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.8)',
            animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div 
            className="text-white p-6 relative overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, var(--secondary-color) 0%, #4c63d2 50%, #5b6fd8 100%)`,
            }}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
            </div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div 
                  className="p-3 rounded-2xl backdrop-blur-sm border border-white/30 relative overflow-hidden"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                >
                  <Bot className="h-7 w-7 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                </div>
                <div>
                  <h3 className="font-bold text-2xl tracking-tight flex items-center gap-2">
                    Hamza's AI Assistant
                    <Zap className="h-5 w-5 text-yellow-300" />
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className={`w-2.5 h-2.5 rounded-full ${status.isInitialized ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
                    <span className="text-sm opacity-90 font-medium">
                      {status.isInitialized ? 'Ready to assist you' : 'Connecting...'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2.5 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-110"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex flex-col h-[calc(650px-140px)]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 enhanced-scrollbar">
              {messages.length === 0 && (
                <div className="text-center space-y-6 py-8">
                  <div 
                    className="mx-auto w-24 h-24 rounded-3xl flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: 'var(--primary-color)' }}
                  >
                    <Bot className="h-12 w-12 relative z-10" style={{ color: 'var(--secondary-color)' }} />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
                  </div>
                  <div>
                    <h4 
                      className="font-bold mb-3 text-2xl tracking-tight"
                      style={{ color: 'var(--black-color)' }}
                    >
                      Hello! 👋
                    </h4>
                    <p 
                      className="leading-relaxed text-lg mb-6"
                      style={{ color: 'var(--gray-color)' }}
                    >
                      I'm here to tell you about Hamza Bouras, a passionate Software Engineer. What would you like to know?
                    </p>
                    
                    {/* Quick Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      {quickPrompts.map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickPrompt(prompt)}
                          className="p-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 border-2"
                          style={{
                            backgroundColor: 'var(--primary-color)',
                            borderColor: 'var(--lightGray-color)',
                            color: 'var(--secondary-color)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.borderColor = 'var(--secondary-color)';
                            e.target.style.backgroundColor = 'var(--secondary-color)';
                            e.target.style.color = 'var(--white-color)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.borderColor = 'var(--lightGray-color)';
                            e.target.style.backgroundColor = 'var(--primary-color)';
                            e.target.style.color = 'var(--secondary-color)';
                          }}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {!status.isInitialized && (
                    <div 
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: '#fee2e2',
                        color: '#dc2626'
                      }}
                    >
                      {!status.hasApiKey ? 'API key not configured' : 'Failed to initialize'}
                    </div>
                  )}
                </div>
              )}
              
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  style={{ 
                    animation: `slideInMessage 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s both`
                  }}
                >
                  <div
                    className={`max-w-[320px] p-5 rounded-3xl shadow-sm border-2 relative overflow-hidden ${
                      message.role === 'user' ? 'text-white' : ''
                    }`}
                    style={{
                      background: message.role === 'user' 
                        ? `linear-gradient(135deg, var(--secondary-color) 0%, #4c63d2 100%)`
                        : 'var(--primary-color)',
                      borderColor: message.role === 'user' 
                        ? 'transparent'
                        : 'var(--lightGray-color)',
                      color: message.role === 'user' 
                        ? 'var(--white-color)'
                        : 'var(--black-color)'
                    }}
                  >
                    {message.role === 'user' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    )}
                    
                    <div className="flex items-start space-x-4 relative z-10">
                      {message.role === 'assistant' && (
                        <div 
                          className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: 'var(--secondary-color)' }}
                        >
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                      )}
                      {message.role === 'user' && (
                        <div className="w-9 h-9 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      )}
                      <div className="text-base leading-relaxed font-medium">
                        {message.role === 'user' ? (
                          <span className="whitespace-pre-wrap">{message.content}</span>
                        ) : (
                          <MarkdownMessage 
                            content={message.content} 
                            isUser={message.role === 'user'} 
                          />
                        )}
                      </div>
                    </div>
                    
                    {/* Timestamp */}
                    <div className={`text-xs mt-3 opacity-60 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {message.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {(isLoading || isTyping) && (
                <div className="flex justify-start" style={{ animation: 'slideInMessage 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                  <div 
                    className="max-w-[320px] p-5 rounded-3xl shadow-sm border-2"
                    style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--lightGray-color)' }}
                  >
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-9 h-9 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: 'var(--secondary-color)' }}
                      >
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex space-x-2">
                        {[0, 1, 2].map((i) => (
                          <div 
                            key={i}
                            className="w-3 h-3 rounded-full animate-bounce"
                            style={{ 
                              backgroundColor: 'var(--secondary-color)',
                              animationDelay: `${i * 0.1}s`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div 
              className="p-4 border-t-2"
              style={{ 
                borderColor: 'var(--lightGray-color)',
                background: 'linear-gradient(to top, var(--primary-color), transparent)'
              }}
            >
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={status.isInitialized ? "Ask me anything..." : "API key required..."}
                  className="flex-1 px-5 py-3 rounded-2xl outline-none transition-all duration-200 font-medium border-2 text-base"
                  style={{ 
                    backgroundColor: 'var(--white-color)',
                    borderColor: 'var(--lightGray-color)',
                    color: 'var(--black-color)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--secondary-color)';
                    e.target.style.boxShadow = `0 0 0 4px rgba(49, 59, 172, 0.1)`;
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--lightGray-color)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'translateY(0)';
                  }}
                  disabled={isLoading || !status.isInitialized}
                />
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !input.trim() || !status.isInitialized}
                  className="px-5 py-3 rounded-2xl transition-all duration-200 flex items-center justify-center min-w-[52px] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  style={{ 
                    background: `linear-gradient(135deg, var(--secondary-color) 0%, #4c63d2 100%)`,
                    color: 'var(--white-color)'
                  }}
                  onMouseEnter={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.transform = 'translateY(-2px) scale(1.05)';
                      e.target.style.boxShadow = '0 20px 40px rgba(49, 59, 172, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 10px 25px rgba(49, 59, 172, 0.2)';
                  }}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideInMessage {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .enhanced-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .enhanced-scrollbar::-webkit-scrollbar-track {
          background: var(--lightGray-color);
          border-radius: 8px;
        }
        .enhanced-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, var(--secondary-color), #4c63d2);
          border-radius: 8px;
          border: 2px solid var(--lightGray-color);
        }
        .enhanced-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4c63d2, var(--brown-color));
        }
      `}</style>
    </div>
  );
};

export default ChatComponent;