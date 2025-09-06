import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, X, MessageSquare, Sparkles, Code, Briefcase, Mail, GraduationCap, Globe, ArrowRight } from 'lucide-react';
import { GroqService } from '../services/groqService';
import { ContextService } from '../services/contextService';
import MarkdownMessage from './ui/MarkdownMessage';

const ChatComponent = ({ onNavigate }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const groqService = useRef(new GroqService());
  const contextService = useRef(null);

  // ADD MOBILE DETECTION
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const getNavigationSuggestion = (categories) => {
    const suggestions = [];
    
    if (categories.includes('projects')) {
      suggestions.push({ section: 'work', label: 'View My Projects', icon: <Briefcase className="h-4 w-4" /> });
    }
    if (categories.includes('skills')) {
      suggestions.push({ section: 'skills', label: 'See All Skills', icon: <Code className="h-4 w-4" /> });
    }
    if (categories.includes('experience')) {
      suggestions.push({ section: 'skills', label: 'View Experience', icon: <Briefcase className="h-4 w-4" /> });
    }
    if (categories.includes('contact')) {
      suggestions.push({ section: 'contact', label: 'Contact Me', icon: <Mail className="h-4 w-4" /> });
    }
    if (categories.includes('personal') || categories.includes('general')) {
      suggestions.push({ section: 'about', label: 'Learn More About Me', icon: <User className="h-4 w-4" /> });
    }
    
    return suggestions.slice(0, 2);
  };

  const handleNavigation = (section) => {
    if (onNavigate) {
      onNavigate(section);
      setIsOpen(false);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || isLoading || !groqService.current.isInitialized) return;

    const userMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const { context, categories } = await contextService.current.classifyAndSelectContext(input);
      const conversationHistory = [...messages, userMessage];
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const response = await groqService.current.generateResponse(conversationHistory, context, categories);
      
      setIsTyping(false);
      const botMessage = { 
        role: 'assistant', 
        content: response, 
        timestamp: new Date(),
        categories
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error in chat:', error);
      setIsTyping(false);
      
      let userFriendlyMessage;
      
      switch (error.message) {
        case 'RATE_LIMIT_EXCEEDED':
          userFriendlyMessage = "I'm experiencing high usage right now. Please try again in about 30 minutes, or feel free to explore my portfolio sections directly for detailed information about my work!";
          break;
        case 'NETWORK_ERROR':
          userFriendlyMessage = "I'm having trouble connecting right now. Please check your internet connection and try again.";
          break;
        case 'AUTH_ERROR':
          userFriendlyMessage = "I'm currently unavailable due to authentication issues. Please try again later or contact me directly through the portfolio.";
          break;
        case 'API_ERROR':
          userFriendlyMessage = "I'm having a small technical hiccup. Please try asking your question again, or explore the relevant sections of my portfolio!";
          break;
        default:
          if (error.message.includes('API key')) {
            userFriendlyMessage = "I'm currently unavailable. Please try again later or contact me directly through the portfolio.";
          } else {
            userFriendlyMessage = "I'm temporarily unavailable. Please try again in a moment, or explore my portfolio sections for detailed information about my work!";
          }
          break;
      }
      
      const errorMessage = { 
        role: 'assistant', 
        content: userFriendlyMessage,
        timestamp: new Date(),
        isError: true,
        isRateLimit: error.message === 'RATE_LIMIT_EXCEEDED' 
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
      case 'skills': return <Code className="h-4 w-4" />;
      case 'projects': return <Briefcase className="h-4 w-4" />;
      case 'contact': return <Mail className="h-4 w-4" />;
      case 'experience': return <Briefcase className="h-4 w-4" />;
      case 'education': return <GraduationCap className="h-4 w-4" />;
      case 'languages': return <Globe className="h-4 w-4" />;
      case 'personal': return <User className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const renderCategoryBadges = (categories) => {
    if (!categories || categories.length === 0) return null;
    
    return (
      <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-100">
        {categories.slice(0, 3).map((category, index) => (
          <div key={index} className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50">
            <div className="p-0.5">
              {getCategoryIcon(category)}
            </div>
            <span className="text-xs font-medium text-gray-600 capitalize">
              {category}
            </span>
          </div>
        ))}
        {categories.length > 3 && (
          <span className="text-xs text-gray-400">
            +{categories.length - 3} more
          </span>
        )}
      </div>
    );
  };

  const status = groqService.current.getStatus();
  const quickPrompts = contextService.current?.getQuickPrompts() || [
    "Tell me about yourself and your background",
    "What's your experience and key projects?", 
    "What are your technical skills and expertise?",
    "How can I contact you?"
  ];

  return (
    <>
      {/* Chat Toggle Button - Always Visible */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {!isOpen && (
            <div className="absolute inset-0 animate-ping rounded-full opacity-20" style={{ backgroundColor: 'var(--secondary-color)' }}></div>
          )}
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative ${isMobile ? 'w-14 h-14' : 'w-16 h-16'} rounded-full shadow-2xl transition-all duration-500 hover:scale-110 flex items-center justify-center group overflow-hidden`}
            style={{ 
              background: `linear-gradient(135deg, var(--secondary-color) 0%, #4c63d2 100%)`,
              boxShadow: '0 20px 40px rgba(49, 59, 172, 0.3)',
              fontFamily: 'var(--font-base)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {!isOpen && (
              <Sparkles className={`absolute ${isMobile ? 'top-1.5 right-1.5 h-2.5 w-2.5' : 'top-2 right-2 h-3 w-3'} text-white/60 animate-pulse`} />
            )}
            {isOpen ? (
              <X className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'} text-white relative z-10 group-hover:scale-110 transition-transform duration-200`} />
            ) : (
              <MessageSquare className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'} text-white relative z-10 group-hover:scale-110 transition-transform duration-200`} />
            )}
          </button>
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`fixed z-40 ${
            isMobile 
              ? 'inset-0' 
              : 'bottom-24 right-6'
          }`}
          style={{ fontFamily: 'var(--font-base)' }}
        >
          <div 
            className={`${
              isMobile 
                ? 'w-full h-full' 
                : 'w-[420px] h-[650px]'
            } ${
              isMobile ? '' : 'rounded-3xl'
            } shadow-2xl border overflow-hidden backdrop-blur-xl`}
            style={{ 
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fc 100%)',
              borderColor: 'rgba(0, 0, 0, 0.05)',
              boxShadow: '0 32px 64px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8)',
              animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Header */}
            <div 
              className={`${isMobile ? 'px-4 py-4' : 'p-5'} relative overflow-hidden border-b`}
              style={{ 
                background: 'rgba(255, 255, 255, 0.95)',
                borderColor: 'rgba(0, 0, 0, 0.06)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className={`${isMobile ? 'p-2' : 'p-2.5'} rounded-2xl relative overflow-hidden`}
                    style={{ 
                      background: `linear-gradient(135deg, var(--secondary-color) 0%, #4c63d2 100%)`,
                      boxShadow: '0 8px 16px rgba(49, 59, 172, 0.2)'
                    }}
                  >
                    <Bot className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-white relative z-10`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'} tracking-tight`} style={{ color: 'var(--black-color)' }}>
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
                {/* Only show close button in header on desktop */}
                {!isMobile && (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
                    style={{ color: 'var(--gray-color)' }}
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Messages Container */}
            <div className={`flex flex-col ${isMobile ? 'h-[calc(100vh-140px)]' : 'h-[calc(650px-120px)]'}`}>
              {/* Messages */}
              <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-3' : 'p-4'} space-y-4 enhanced-scrollbar`} style={{ background: '#f8f9fc' }}>
                {messages.length === 0 && (
                  <div className={`text-center space-y-6 ${isMobile ? 'py-6' : 'py-8'}`}>
                    <div className={`inline-flex items-center justify-center ${isMobile ? 'w-16 h-16' : 'w-20 h-20'} rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 mb-4`}>
                      <Bot className={`${isMobile ? 'h-8 w-8' : 'h-10 w-10'}`} style={{ color: 'var(--secondary-color)' }} />
                    </div>
                    <div>
                      <h4 className={`font-semibold mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`} style={{ color: 'var(--black-color)' }}>
                        Hi! I'm here to help 👋
                      </h4>
                      <p className={`${isMobile ? 'text-xs px-2' : 'text-sm'} mb-6`} style={{ color: 'var(--gray-color)' }}>
                        Ask me anything about Hamza's experience, projects, or skills.
                      </p>
                      
                      {/* Quick Action Buttons */}
                      <div className={`grid ${isMobile ? 'grid-cols-1 gap-2 max-w-full px-4' : 'grid-cols-2 gap-2 max-w-sm'} mx-auto`}>
                        {quickPrompts.map((prompt, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickPrompt(prompt)}
                            className={`${isMobile ? 'p-2.5 text-xs' : 'p-3 text-sm'} rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] border bg-white hover:shadow-md text-left`}
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
                          className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} rounded-full flex items-center justify-center flex-shrink-0`}
                          style={{ 
                            background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                          }}
                        >
                          <Bot className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} style={{ color: 'var(--secondary-color)' }} />
                        </div>
                      </div>
                    )}
                    
                    <div className={`group relative ${isMobile ? 'max-w-[280px]' : 'max-w-[320px]'}`}>
                      <div
                        className={`${isMobile ? 'px-3 py-2.5' : 'px-4 py-3'} rounded-2xl ${
                          message.role === 'user' 
                            ? 'rounded-br-sm' 
                            : 'rounded-bl-sm'
                        } ${message.isError ? 'border-yellow-200' : ''}`}
                        style={{
                          background: message.role === 'user' 
                            ? 'linear-gradient(135deg, var(--secondary-color) 0%, #4c63d2 100%)'
                            : message.isError 
                              ? '#fefce8'
                              : 'white',
                          color: message.role === 'user' 
                            ? 'white'
                            : message.isError
                              ? '#92400e'
                              : 'var(--black-color)',
                          boxShadow: message.role === 'user'
                            ? '0 4px 12px rgba(49, 59, 172, 0.15)'
                            : '0 2px 8px rgba(0, 0, 0, 0.06)',
                          border: message.role === 'assistant' ? '1px solid rgba(0, 0, 0, 0.06)' : 'none'
                        }}
                      >
                        {/* Category badges */}
                        {message.role === 'assistant' && message.categories && !message.isError && (
                          renderCategoryBadges(message.categories)
                        )}
                        
                        <div className={`${isMobile ? 'text-xs' : 'text-sm'} leading-relaxed`}>
                          {message.role === 'user' ? (
                            <span className="whitespace-pre-wrap">{message.content}</span>
                          ) : (
                            <div className="prose prose-sm max-w-none">
                              <MarkdownMessage 
                                content={message.content} 
                                isUser={message.role === 'user'} 
                              />
                              
                              {/* Navigation suggestions */}
                              {message.categories && !message.isError && getNavigationSuggestion(message.categories).length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <div className="text-xs text-gray-500 mb-2 font-medium">Explore More:</div>
                                  <div className={`flex ${isMobile ? 'flex-col gap-1.5' : 'flex-wrap gap-2'}`}>
                                    {getNavigationSuggestion(message.categories).map((suggestion, idx) => (
                                      <button
                                        key={idx}
                                        onClick={() => handleNavigation(suggestion.section)}
                                        className={`flex items-center gap-1.5 ${isMobile ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-1.5 text-xs'} font-medium rounded-lg border transition-all duration-200 hover:shadow-sm hover:scale-[1.02]`}
                                        style={{
                                          borderColor: 'var(--secondary-color)',
                                          color: 'var(--secondary-color)',
                                          background: 'rgba(49, 59, 172, 0.05)'
                                        }}
                                        onMouseEnter={(e) => {
                                          e.target.style.background = 'var(--secondary-color)';
                                          e.target.style.color = 'white';
                                        }}
                                        onMouseLeave={(e) => {
                                          e.target.style.background = 'rgba(49, 59, 172, 0.05)';
                                          e.target.style.color = 'var(--secondary-color)';
                                        }}
                                      >
                                        {suggestion.icon}
                                        {suggestion.label}
                                        <ArrowRight className="h-3 w-3" />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
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
                        <div className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0`}>
                          <User className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} text-gray-600`} />
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
                        className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} rounded-full flex items-center justify-center`}
                        style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)' }}
                      >
                        <Bot className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} style={{ color: 'var(--secondary-color)' }} />
                      </div>
                    </div>
                    <div 
                      className={`${isMobile ? 'px-3 py-2.5' : 'px-4 py-3'} rounded-2xl rounded-bl-sm bg-white shadow-sm border`}
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
              <div className={`${isMobile ? 'p-3' : 'p-4'} border-t bg-white`} style={{ borderColor: 'rgba(0, 0, 0, 0.06)' }}>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={status.isInitialized ? "Type your message..." : "API key required..."}
                      className={`w-full ${isMobile ? 'px-3 py-2.5 pr-10 text-xs' : 'px-4 py-3 pr-12 text-sm'} rounded-2xl outline-none transition-all duration-200 border-2 bg-gray-50 focus:bg-white`}
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
                      className={`absolute ${isMobile ? 'right-1.5 top-1/2' : 'right-2 top-1/2'} -translate-y-1/2 ${isMobile ? 'p-1.5' : 'p-2'} rounded-xl transition-all duration-200 disabled:opacity-30`}
                      style={{ 
                        background: input.trim() && !isLoading ? 'var(--secondary-color)' : 'transparent',
                        color: input.trim() && !isLoading ? 'white' : 'var(--gray-color)'
                      }}
                    >
                      {isLoading ? (
                        <div className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} border-2 border-gray-400 border-t-transparent rounded-full animate-spin`} />
                      ) : (
                        <Send className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                      )}
                    </button>
                  </div>
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

        /* Mobile-specific prose adjustments */
        @media (max-width: 768px) {
          .prose h1, .prose h2, .prose h3 {
            font-size: 1em;
          }
          
          .prose code {
            font-size: 0.8em;
          }
        }
      `}</style>
    </>
  );
};

export default ChatComponent;