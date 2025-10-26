'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import {
  ChatContainer,
  ChatConversation,
  ChatHeader,
  ChatInput,
} from '@/components/chat';
import type { PromptInputMessage } from '@/components/ai-elements/prompt-input';

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat();
  const [draft, setDraft] = useState('');

  const handleSubmit = (message: PromptInputMessage) => {
    const messageText = message.text?.trim();
    if (!messageText) {
      return;
    }

    void sendMessage({ text: messageText });
    setDraft('');
  };

  return (
    <ChatContainer>
      <ChatHeader
        description="Ask me about the weather in any location"
        title="Weather Chat Assistant"
      />
      <ChatConversation messages={messages} status={status} />
      <ChatInput
        onChange={setDraft}
        onSubmit={handleSubmit}
        status={status}
        value={draft}
      />
    </ChatContainer>
  );
}
