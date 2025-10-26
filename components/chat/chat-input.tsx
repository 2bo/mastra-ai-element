import type { UseChatHelpers } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (message: PromptInputMessage) => void;
  status: UseChatHelpers<UIMessage>['status'];
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  status,
}: ChatInputProps) {
  const isDisabled = status === 'submitted' || status === 'streaming';

  return (
    <div className="border-t border-gray-200 p-4">
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea
            onChange={(event) => onChange(event.target.value)}
            placeholder="Ask about the weather..."
            value={value}
            disabled={isDisabled}
            aria-label="Message input"
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools />
          <PromptInputSubmit
            disabled={isDisabled || !value.trim()}
            status={status}
            aria-label="Send message"
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
