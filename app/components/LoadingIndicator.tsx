import { memo } from 'react';

export const LoadingIndicator = memo(function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="px-4 py-3 rounded-xl bg-gray-100 text-gray-600">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
          </div>
          <span>Thinking...</span>
        </div>
      </div>
    </div>
  );
});
