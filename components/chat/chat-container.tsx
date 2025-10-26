import type { PropsWithChildren } from 'react';

export function ChatContainer({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen flex-col p-5">
      <main
        className="mx-auto flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-lg"
        role="main"
        aria-label="Chat interface"
      >
        {children}
      </main>
    </div>
  );
}
