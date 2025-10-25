'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';

export default function Chat() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      void sendMessage({ text: input });
      setInput('');
    }
  };

  const isLoading = status !== 'ready';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #e5e7eb',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            Weather Chat Assistant
          </h1>
          <p style={{ fontSize: '14px', marginTop: '4px', opacity: 0.9 }}>
            Ask me about the weather in any location
          </p>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {messages.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                color: '#6b7280',
                marginTop: '40px',
              }}
            >
              <p style={{ fontSize: '18px', marginBottom: '8px' }}>
                👋 Welcome!
              </p>
              <p>Ask me about the weather anywhere in the world</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent:
                  message.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background:
                    message.role === 'user'
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : '#f3f4f6',
                  color: message.role === 'user' ? 'white' : '#1f2937',
                  wordWrap: 'break-word',
                }}
              >
                {message.parts.map((part, i) => {
                  if (part.type === 'text') {
                    return (
                      <div key={i} style={{ whiteSpace: 'pre-wrap' }}>
                        {part.text}
                      </div>
                    );
                  }
                  if (part.type === 'tool-call') {
                    return (
                      <div
                        key={i}
                        style={{
                          fontSize: '12px',
                          opacity: 0.7,
                          marginBottom: '4px',
                        }}
                      >
                        🔧 Fetching weather data...
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))}

          {isLoading && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: '#f3f4f6',
                  color: '#6b7280',
                }}
              >
                Thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: '20px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '12px',
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the weather..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background:
                isLoading || !input.trim()
                  ? '#d1d5db'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isLoading && input.trim()) {
                e.currentTarget.style.opacity = '0.9';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
