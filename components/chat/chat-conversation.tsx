import type { UseChatHelpers } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import {
  AlertCircleIcon,
  MessageSquareIcon,
  RefreshCwIcon,
  StopCircleIcon,
} from 'lucide-react';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Loader } from '@/components/ai-elements/loader';
import { Button } from '@/components/ui/button';
import { ChatMessageItem } from './chat-message-item';

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
  const lastMessage = messages[messages.length - 1];
  const canRegenerate =
    lastMessage?.role === 'assistant' &&
    status !== 'submitted' &&
    status !== 'streaming' &&
    onRegenerate;
  const canStop = (isLoading && onStop) ?? false;

  return (
    <Conversation
      className="flex-1"
      role="log"
      aria-live="polite"
      aria-atomic="false"
    >
      <ConversationContent>
        {hasMessages ? (
          <>
            {messages.map((message) => (
              <ChatMessageItem key={message.id} message={message} />
            ))}

            {Boolean(canRegenerate ?? canStop) && (
              <div className="flex items-center justify-center gap-2 py-4">
                {canRegenerate && (
                  <Button
                    onClick={() => void onRegenerate()}
                    size="sm"
                    variant="outline"
                  >
                    <RefreshCwIcon className="mr-2 size-4" />
                    Regenerate
                  </Button>
                )}
                {canStop && onStop && (
                  <Button
                    onClick={() => void onStop()}
                    size="sm"
                    variant="destructive"
                  >
                    <StopCircleIcon className="mr-2 size-4" />
                    Stop
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <ConversationEmptyState
            description="Ask me about the weather anywhere in the world, attach images, or use advanced features"
            icon={<MessageSquareIcon className="size-12" aria-hidden="true" />}
            title="Welcome to AI Chat!"
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
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
