import type { UseChatHelpers } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import {
  getToolOrDynamicToolName,
  isFileUIPart,
  isReasoningUIPart,
  isTextUIPart,
  isToolOrDynamicToolUIPart,
} from 'ai';
import { Bot, CheckIcon, CopyIcon, FileIcon, User } from 'lucide-react';
import {
  Message,
  MessageAvatar,
  MessageContent,
} from '@/components/ai-elements/message';
import { Response } from '@/components/ai-elements/response';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type ChatMessage = UseChatHelpers<UIMessage>['messages'][number];

interface ChatMessageItemProps {
  message: ChatMessage;
}

const AVATARS = {
  assistant: {
    name: 'Assistant',
    icon: <Bot className="size-6" />,
  },
  user: {
    name: 'You',
    icon: <User className="size-6" />,
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

function MessageActions({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
      <Button
        aria-label="Copy message"
        onClick={handleCopy}
        size="icon"
        type="button"
        variant="ghost"
        className="size-7"
      >
        {copied ? (
          <CheckIcon className="size-3" />
        ) : (
          <CopyIcon className="size-3" />
        )}
      </Button>
    </div>
  );
}

function AttachmentPreview({ part }: { part: ChatMessage['parts'][number] }) {
  if (!isFileUIPart(part)) {
    return null;
  }

  const isImage = part.mediaType.startsWith('image/');

  return (
    <div className="mb-2">
      {isImage && part.url ? (
        <img
          alt={part.filename ?? 'attachment'}
          className="max-h-64 rounded-md border"
          src={part.url}
        />
      ) : (
        <div className="flex items-center gap-2 rounded-md border p-2">
          <FileIcon className="size-4" />
          <span className="text-sm">{part.filename ?? 'File'}</span>
        </div>
      )}
    </div>
  );
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  const role = message.role === 'user' ? 'user' : 'assistant';
  const avatar = AVATARS[role];
  const textContent = formatMessageParts(message.parts);
  const fileParts = message.parts.filter(isFileUIPart);

  return (
    <Message from={role}>
      <MessageAvatar icon={avatar.icon} name={avatar.name} />
      <MessageContent variant="flat">
        {fileParts.map((part, index) => (
          <AttachmentPreview key={`${message.id}-file-${index}`} part={part} />
        ))}
        <Response>{textContent}</Response>
        {role === 'assistant' && <MessageActions text={textContent} />}
      </MessageContent>
    </Message>
  );
}
