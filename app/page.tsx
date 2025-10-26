'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import {
  ChatContainer,
  ChatConversation,
  ChatHeader,
  ChatInput,
} from '@/components/chat';
import {
  PromptInputProvider,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input';

export default function ChatPage() {
  const { messages, sendMessage, status, setMessages, stop, regenerate } =
    useChat();
  const [draft, setDraft] = useState('');

  const handleSubmit = (message: PromptInputMessage) => {
    const messageText = message.text?.trim();
    if (!messageText) {
      return;
    }

    const files = message.files ?? [];
    void sendMessage({
      text: messageText,
      files: files.map((f) => ({
        type: 'file' as const,
        url: f.url,
        mediaType: f.mediaType,
        filename: f.filename,
      })),
    });
    setDraft('');
  };

  const handleClearMessages = () => {
    setMessages([]);
  };

  return (
    <PromptInputProvider initialInput={draft}>
      <ChatContainer>
        <ChatHeader
          description="Ask me about the weather, attach images, or use advanced features"
          title="AI Chat Assistant (Enhanced)"
        />
        <ChatConversation
          messages={messages}
          onRegenerate={regenerate}
          onStop={stop}
          status={status}
        />
        <ChatInput
          onChange={setDraft}
          onClearMessages={handleClearMessages}
          onSubmit={handleSubmit}
          status={status}
          value={draft}
        />
      </ChatContainer>
    </PromptInputProvider>
  );
}
