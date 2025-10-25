import type { UIMessagePart, UIDataTypes, UITools } from 'ai';

export type MessagePart = UIMessagePart<UIDataTypes, UITools>;

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  parts: MessagePart[];
}

export type ChatStatus = 'ready' | 'loading' | 'error';

export interface ChatState {
  messages: Message[];
  input: string;
  status: ChatStatus;
}
