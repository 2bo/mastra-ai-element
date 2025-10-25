import { memo } from 'react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput = memo(function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Type a message...',
}: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-3 p-5 border-t border-gray-200"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-lg outline-none transition-colors focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        aria-label="Chat message input"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="px-6 py-3 text-base font-semibold text-white rounded-lg transition-opacity bg-gradient-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Send message"
      >
        Send
      </button>
    </form>
  );
});
