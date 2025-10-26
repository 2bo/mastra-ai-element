import type { UseChatHelpers } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import { AlertCircleIcon, MessageSquareIcon } from 'lucide-react';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Loader } from '@/components/ai-elements/loader';
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

  return (
    <Conversation
      className="flex-1"
      role="log"
      aria-live="polite"
      aria-atomic="false"
    >
      <ConversationContent>
        {hasMessages ? (
          messages.map((message) => (
            <ChatMessageItem key={message.id} message={message} />
          ))
        ) : (
          <ConversationEmptyState
            description="Ask me about the weather anywhere in the world"
            icon={<MessageSquareIcon className="size-12" aria-hidden="true" />}
            title="Welcome!"
          />
        )}

        {isLoading && (
          <div
            className="flex items-center justify-center py-4"
            role="status"
            aria-label="Loading"
          >
            <Loader />
            <span className="sr-only">Processing your message...</span>
            {onStop && (
              <Button
                className="ml-4"
                onClick={() => {
                  void onStop?.();
                }}
                size="sm"
                type="button"
                variant="outline"
              >
                Stop
              </Button>
            )}
          </div>
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
                void onRegenerate?.();
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
