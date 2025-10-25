'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState, useCallback } from 'react';
import {
  ChatMessage,
  ChatInput,
  ChatHeader,
  LoadingIndicator,
  EmptyState,
} from './components';

export default function Chat() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = useCallback(() => {
    if (input.trim()) {
      void sendMessage({ text: input });
      setInput('');
    }
  }, [input, sendMessage]);

  const isLoading = status !== 'ready';

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-5">
      <div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden">
        <ChatHeader
          title="Weather Chat Assistant"
          subtitle="Ask me about the weather in any location"
        />

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {messages.length === 0 && (
            <EmptyState
              icon="👋"
              title="Welcome!"
              subtitle="Ask me about the weather anywhere in the world"
            />
          )}

          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              parts={message.parts}
            />
          ))}

          {isLoading && <LoadingIndicator />}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          disabled={isLoading}
          placeholder="Ask about the weather..."
        />
      </div>
    </div>
  );
}
