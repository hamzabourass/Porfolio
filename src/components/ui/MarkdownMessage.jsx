import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownMessage = ({ content, isUser }) => {
  // Custom components for styling
  const components = {
    // Headers
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold mb-3 mt-4" style={{ color: isUser ? 'inherit' : 'var(--secondary-color)' }}>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-bold mb-2 mt-4" style={{ color: isUser ? 'inherit' : 'var(--secondary-color)' }}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-bold mb-2 mt-3" style={{ color: isUser ? 'inherit' : 'var(--secondary-color)' }}>
        {children}
      </h3>
    ),
    
    // Paragraphs
    p: ({ children }) => (
      <p className="mb-2 leading-relaxed">{children}</p>
    ),
    
    // Lists
    ul: ({ children }) => (
      <ul className="mb-3 ml-4 list-disc space-y-1">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-3 ml-4 list-decimal space-y-1">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="mb-1">{children}</li>
    ),
    
    // Code
    code: ({ inline, children }) => {
      if (inline) {
        return (
          <code 
            className="px-2 py-1 rounded text-sm font-mono"
            style={{ 
              backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : 'var(--lightGray-color)',
              color: isUser ? 'inherit' : 'var(--secondary-color)'
            }}
          >
            {children}
          </code>
        );
      }
      return (
        <div className="bg-gray-100 rounded-lg p-3 my-3 font-mono text-sm border overflow-x-auto">
          <code>{children}</code>
        </div>
      );
    },
    
    // Code blocks
    pre: ({ children }) => (
      <div className="bg-gray-100 rounded-lg p-3 my-3 font-mono text-sm border overflow-x-auto">
        {children}
      </div>
    ),
    
    // Strong/Bold
    strong: ({ children }) => (
      <strong 
        className="font-bold"
        style={{ color: isUser ? 'inherit' : 'var(--secondary-color)' }}
      >
        {children}
      </strong>
    ),
    
    // Emphasis/Italic
    em: ({ children }) => (
      <em className="italic">{children}</em>
    ),
    
    // Links
    a: ({ href, children }) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="underline hover:no-underline transition-all duration-200"
        style={{ color: isUser ? '#93c5fd' : 'var(--secondary-color)' }}
      >
        {children}
      </a>
    ),
    
    // Blockquotes
    blockquote: ({ children }) => (
      <blockquote 
        className="border-l-4 pl-4 py-2 my-3 italic"
        style={{ 
          borderColor: isUser ? 'rgba(255,255,255,0.3)' : 'var(--secondary-color)',
          backgroundColor: isUser ? 'rgba(255,255,255,0.1)' : 'var(--primary-color)'
        }}
      >
        {children}
      </blockquote>
    ),
  };

  return (
    <div className="markdown-content">
      <ReactMarkdown 
        components={components}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownMessage;