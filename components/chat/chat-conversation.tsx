import type { UseChatHelpers } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import { AlertCircleIcon, Bot, MessageSquareIcon } from 'lucide-react';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Loader } from '@/components/ai-elements/loader';
import {
  Message,
  MessageAvatar,
  MessageContent,
} from '@/components/ai-elements/message';
import { ChatMessageItem } from './chat-message-item';
import { Button } from '@/components/ui/button';

type ChatMessage = UseChatHelpers<UIMessage>['messages'][number];

interface ChatConversationProps {
  messages: ChatMessage[];
  status: UseChatHelpers<UIMessage>['status'];
  onRegenerate?: UseChatHelpers<UIMessage>['regenerate'];
  onStop?: UseChatHelpers<UIMessage>['stop'];
}

export function ChatConversation({
  messages,
  status,
  onRegenerate,
  onStop,
}: ChatConversationProps) {
  const hasMessages = messages.length > 0;
  const isLoading = status === 'submitted' || status === 'streaming';
  const isError = status === 'error';
  const canRegenerate = typeof onRegenerate === 'function' && hasMessages;

  // Filter out empty assistant messages during loading
  const displayMessages = isLoading
    ? messages.filter((msg) => {
        if (msg.role === 'assistant') {
          // Keep only messages with actual content
          return msg.parts.some((part) => {
            if ('text' in part) return part.text.trim().length > 0;
            return true;
          });
        }
        return true;
      })
    : messages;

  // Check if there's a streaming assistant message with content
  const hasStreamingContent =
    isLoading &&
    messages.some(
      (msg) =>
        msg.role === 'assistant' &&
        msg.parts.some((part) => 'text' in part && part.text.trim().length > 0)
    );

  return (
    <Conversation
      className="flex-1"
      role="log"
      aria-live="polite"
      aria-atomic="false"
    >
      <ConversationContent>
        {hasMessages ? (
          displayMessages.map((message) => (
            <ChatMessageItem key={message.id} message={message} />
          ))
        ) : (
          <ConversationEmptyState
            description="Ask me about the weather anywhere in the world"
            icon={<MessageSquareIcon className="size-12" aria-hidden="true" />}
            title="Welcome!"
          />
        )}

        {isLoading && !hasStreamingContent && (
          <Message from="assistant">
            <MessageAvatar icon={<Bot className="size-6" />} name="Assistant" />
            <MessageContent variant="flat">
              <div
                className="flex items-center gap-2"
                role="status"
                aria-label="Loading"
              >
                <Loader />
                <span className="text-sm text-muted-foreground">
                  Thinking...
                </span>
                <span className="sr-only">Processing your message...</span>
              </div>
              {onStop && (
                <Button
                  className="mt-2"
                  onClick={() => {
                    void onStop();
                  }}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  Stop
                </Button>
              )}
            </MessageContent>
          </Message>
        )}

        {isError && (
          <div
            className="flex items-center justify-center gap-2 rounded-md bg-red-50 p-4 text-red-800"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircleIcon className="size-5" aria-hidden="true" />
            <p className="text-sm">
              An error occurred while processing your message. Please try again.
            </p>
          </div>
        )}

        {canRegenerate && !isLoading && (
          <div className="flex justify-center py-4">
            <Button
              onClick={() => {
                void onRegenerate();
              }}
              size="sm"
              type="button"
              variant="ghost"
            >
              Regenerate response
            </Button>
          </div>
        )}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
