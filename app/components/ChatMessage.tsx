import type { MessagePart } from '@ai-sdk/react';
import { memo } from 'react';

interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system';
  parts: MessagePart[];
}

export const ChatMessage = memo(function ChatMessage({
  role,
  parts,
}: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-xl px-4 py-3 break-words ${
          isUser
            ? 'bg-gradient-primary text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        {parts.map((part, i) => {
          if (part.type === 'text') {
            return (
              <div key={i} className="whitespace-pre-wrap">
                {part.text}
              </div>
            );
          }
          if (part.type === 'tool-call') {
            return (
              <div key={i} className="text-xs opacity-70 mb-1">
                🔧 Fetching weather data...
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
});
