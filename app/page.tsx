'use client';

import { useChat } from '@ai-sdk/react';
import { useState, type ChangeEvent } from 'react';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageAvatar,
  MessageContent,
} from '@/components/ai-elements/message';
import { Response } from '@/components/ai-elements/response';
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input';
import { Loader } from '@/components/ai-elements/loader';
import { MessageSquareIcon } from 'lucide-react';

export default function Chat() {
  const { messages, sendMessage, status } = useChat();
  const [text, setText] = useState('');

  const handleSubmit = (message: PromptInputMessage) => {
    const messageText = message.text;
    if (messageText) {
      void sendMessage({ text: messageText });
      setText('');
    }
  };

  const isLoading = status !== 'ready';

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-5">
      <div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">
            Weather Chat Assistant
          </h1>
          <p className="text-sm text-gray-600">
            Ask me about the weather in any location
          </p>
        </div>

        <Conversation className="flex-1">
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquareIcon className="size-12" />}
                title="Welcome!"
                description="Ask me about the weather anywhere in the world"
              />
            ) : (
              messages.map((message) => (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    <Response>
                      {message.parts
                        .map((part) => {
                          if (part.type === 'text') {
                            return part.text;
                          }
                          if (part.type.startsWith('tool-')) {
                            return `🔧 Using tool: ${part.type.replace('tool-', '')}...`;
                          }
                          return '';
                        })
                        .join('\n')}
                    </Response>
                  </MessageContent>
                  <MessageAvatar
                    src={
                      message.role === 'user'
                        ? 'https://github.com/ghost.png'
                        : 'https://github.com/openai.png'
                    }
                    name={message.role === 'user' ? 'You' : 'Assistant'}
                  />
                </Message>
              ))
            )}
            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <Loader />
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="p-4 border-t border-gray-200">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea
                value={text}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  setText(event.target.value)
                }
                placeholder="Ask about the weather..."
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools />
              <PromptInputSubmit disabled={isLoading} status={status} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
