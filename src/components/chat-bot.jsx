import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, X, MessageSquare, Sparkles, Zap, Code, Briefcase, Mail, Phone } from 'lucide-react';
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

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'technical': return <Code className="h-4 w-4" />;
      case 'projects': return <Briefcase className="h-4 w-4" />;
      case 'contact': return <Mail className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
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
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fc 100%)',
            borderColor: 'rgba(0, 0, 0, 0.05)',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8)',
            animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div 
            className="p-5 relative overflow-hidden border-b"
            style={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              borderColor: 'rgba(0, 0, 0, 0.06)',
              backdropFilter: 'blur(20px)'
            }}
          >
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="p-2.5 rounded-2xl relative overflow-hidden"
                  style={{ 
                    background: `linear-gradient(135deg, var(--secondary-color) 0%, #4c63d2 100%)`,
                    boxShadow: '0 8px 16px rgba(49, 59, 172, 0.2)'
                  }}
                >
                  <Bot className="h-6 w-6 text-white relative z-10" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg tracking-tight" style={{ color: 'var(--black-color)' }}>
                    Hamza's Assistant
                  </h3>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <div className={`w-2 h-2 rounded-full ${status.isInitialized ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-xs" style={{ color: 'var(--gray-color)' }}>
                      {status.isInitialized ? 'Active' : 'Connecting...'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
                style={{ color: 'var(--gray-color)' }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex flex-col h-[calc(650px-120px)]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 enhanced-scrollbar" style={{ background: '#f8f9fc' }}>
              {messages.length === 0 && (
                <div className="text-center space-y-6 py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 mb-4">
                    <Bot className="h-10 w-10" style={{ color: 'var(--secondary-color)' }} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-xl" style={{ color: 'var(--black-color)' }}>
                      Hi! I'm here to help 👋
                    </h4>
                    <p className="text-sm mb-6" style={{ color: 'var(--gray-color)' }}>
                      Ask me anything about Hamza's experience, projects, or skills.
                    </p>
                    
                    {/* Quick Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
                      {quickPrompts.map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickPrompt(prompt)}
                          className="p-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] border bg-white hover:shadow-md"
                          style={{
                            borderColor: 'rgba(0, 0, 0, 0.08)',
                            color: 'var(--black-color)'
                          }}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  style={{ animation: `fadeIn 0.3s ease-out` }}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-end mr-2">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ 
                          background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                        }}
                      >
                        <Bot className="h-4 w-4" style={{ color: 'var(--secondary-color)' }} />
                      </div>
                    </div>
                  )}
                  
                  <div className={`group relative max-w-[320px]`}>
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.role === 'user' 
                          ? 'rounded-br-sm' 
                          : 'rounded-bl-sm'
                      }`}
                      style={{
                        background: message.role === 'user' 
                          ? 'linear-gradient(135deg, var(--secondary-color) 0%, #4c63d2 100%)'
                          : 'white',
                        color: message.role === 'user' 
                          ? 'white'
                          : 'var(--black-color)',
                        boxShadow: message.role === 'user'
                          ? '0 4px 12px rgba(49, 59, 172, 0.15)'
                          : '0 2px 8px rgba(0, 0, 0, 0.06)',
                        border: message.role === 'assistant' ? '1px solid rgba(0, 0, 0, 0.06)' : 'none'
                      }}
                    >
                      {/* Category indicator for assistant messages */}
                      {message.role === 'assistant' && message.category && (
                        <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-100">
                          <div className="p-1 rounded bg-gray-50">
                            {getCategoryIcon(message.category)}
                          </div>
                          <span className="text-xs font-medium text-gray-500 capitalize">
                            {message.category}
                          </span>
                        </div>
                      )}
                      
                      <div className="text-sm leading-relaxed">
                        {message.role === 'user' ? (
                          <span className="whitespace-pre-wrap">{message.content}</span>
                        ) : (
                          <div className="prose prose-sm max-w-none">
                            <MarkdownMessage 
                              content={message.content} 
                              isUser={message.role === 'user'} 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Timestamp on hover */}
                    <div className={`absolute -bottom-5 ${message.role === 'user' ? 'right-0' : 'left-0'} 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                      <span className="text-xs text-gray-400">
                        {message.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="flex items-end ml-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Typing Indicator */}
              {(isLoading || isTyping) && (
                <div className="flex justify-start" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                  <div className="flex items-end mr-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)' }}
                    >
                      <Bot className="h-4 w-4" style={{ color: 'var(--secondary-color)' }} />
                    </div>
                  </div>
                  <div 
                    className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white shadow-sm border"
                    style={{ borderColor: 'rgba(0, 0, 0, 0.06)' }}
                  >
                    <div className="flex space-x-1.5">
                      {[0, 1, 2].map((i) => (
                        <div 
                          key={i}
                          className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-white" style={{ borderColor: 'rgba(0, 0, 0, 0.06)' }}>
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={status.isInitialized ? "Type your message..." : "API key required..."}
                    className="w-full px-4 py-3 pr-12 rounded-2xl outline-none transition-all duration-200 text-sm border-2 bg-gray-50 focus:bg-white"
                    style={{ 
                      borderColor: 'transparent',
                      color: 'var(--black-color)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--secondary-color)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'transparent';
                    }}
                    disabled={isLoading || !status.isInitialized}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !input.trim() || !status.isInitialized}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all duration-200 disabled:opacity-30"
                    style={{ 
                      background: input.trim() && !isLoading ? 'var(--secondary-color)' : 'transparent',
                      color: input.trim() && !isLoading ? 'white' : 'var(--gray-color)'
                    }}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .enhanced-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .enhanced-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .enhanced-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 6px;
        }
        .enhanced-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }

        .prose h1, .prose h2, .prose h3 {
          font-size: 1.1em;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }
        
        .prose p {
          margin-bottom: 0.75em;
        }
        
        .prose ul, .prose ol {
          margin-left: 1.5em;
          margin-bottom: 0.75em;
        }
        
        .prose code {
          background: rgba(0, 0, 0, 0.05);
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          font-size: 0.9em;
        }
        
        .prose pre {
          background: rgba(0, 0, 0, 0.05);
          padding: 0.75em;
          border-radius: 0.5em;
          overflow-x: auto;
          margin-bottom: 0.75em;
        }
      `}</style>
    </div>
  );
};

export default ChatComponent;