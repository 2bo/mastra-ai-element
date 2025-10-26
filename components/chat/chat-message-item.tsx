import type { UseChatHelpers } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import {
  getToolOrDynamicToolName,
  isReasoningUIPart,
  isTextUIPart,
  isToolOrDynamicToolUIPart,
} from 'ai';
import { Bot, User } from 'lucide-react';
import {
  Message,
  MessageAvatar,
  MessageContent,
} from '@/components/ai-elements/message';
import { Response } from '@/components/ai-elements/response';

type ChatMessage = UseChatHelpers<UIMessage>['messages'][number];

interface ChatMessageItemProps {
  message: ChatMessage;
}

const AVATARS = {
  assistant: {
    name: 'Assistant',
    icon: <Bot className="size-5" />,
  },
  user: {
    name: 'You',
    icon: <User className="size-5" />,
  },
} as const;

function formatMessageParts(parts: ChatMessage['parts']): string {
  return parts
    .map((part) => {
      if (isTextUIPart(part) || isReasoningUIPart(part)) {
        return part.text;
      }

      if (isToolOrDynamicToolUIPart(part)) {
        const toolName = getToolOrDynamicToolName(part);
        return `🔧 Using tool: ${toolName}...`;
      }

      return '';
    })
    .filter(Boolean)
    .join('\n\n');
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  const role = message.role === 'user' ? 'user' : 'assistant';
  const avatar = AVATARS[role];

  return (
    <Message from={role}>
      <MessageContent>
        <Response>{formatMessageParts(message.parts)}</Response>
      </MessageContent>
      <MessageAvatar name={avatar.name} icon={avatar.icon} />
    </Message>
  );
}
