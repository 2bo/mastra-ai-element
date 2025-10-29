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
  const [draft, setDraft] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [selectedAgent, setSelectedAgent] = useState('financialAnalystAgent');

  const { messages, sendMessage, status, setMessages, stop, regenerate } =
    useChat();

  const handleSubmit = (message: PromptInputMessage) => {
    const messageText = message.text?.trim();
    if (!messageText) {
      return;
    }

    const files = message.files ?? [];
    void sendMessage(
      {
        text: messageText,
        files: files.map((f) => ({
          type: 'file' as const,
          url: f.url,
          mediaType: f.mediaType,
          filename: f.filename,
        })),
      },
      {
        body: {
          model: selectedModel,
          agent: selectedAgent,
        },
      }
    );
    setDraft('');
  };

  const handleClearMessages = () => {
    setMessages([]);
  };

  // Get agent description for header
  const agentDescriptions = {
    financialAnalystAgent:
      'Financial expert - Analyze earnings reports, balance sheets, and financial data',
    codeReviewAgent:
      'Code quality specialist - Review code for security, performance, and best practices',
    travelPlanningAgent:
      'Travel expert - Plan itineraries, suggest destinations, and provide travel tips',
  };

  const agentDescription =
    agentDescriptions[selectedAgent as keyof typeof agentDescriptions] ||
    'Ask me anything!';

  return (
    <PromptInputProvider initialInput={draft}>
      <ChatContainer>
        <ChatHeader description={agentDescription} title="AI Chat Assistant" />
        <ChatConversation
          messages={messages}
          onRegenerate={regenerate}
          onStop={stop}
          status={status}
        />
        <ChatInput
          onChange={setDraft}
          onAgentChange={setSelectedAgent}
          onClearMessages={handleClearMessages}
          onModelChange={setSelectedModel}
          onSubmit={handleSubmit}
          selectedAgent={selectedAgent}
          selectedModel={selectedModel}
          status={status}
          value={draft}
        />
      </ChatContainer>
    </PromptInputProvider>
  );
}
