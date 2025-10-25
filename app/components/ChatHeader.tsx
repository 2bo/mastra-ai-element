import { memo } from 'react';

interface ChatHeaderProps {
  title: string;
  subtitle?: string;
}

export const ChatHeader = memo(function ChatHeader({
  title,
  subtitle,
}: ChatHeaderProps) {
  return (
    <header className="px-5 py-5 border-b border-gray-200 bg-gradient-primary text-white">
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && <p className="text-sm mt-1 opacity-90">{subtitle}</p>}
    </header>
  );
});
