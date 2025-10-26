interface ChatHeaderProps {
  title: string;
  description: string;
}

export function ChatHeader({ title, description }: ChatHeaderProps) {
  return (
    <header className="border-b border-gray-200 p-5">
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      <p className="text-sm text-gray-600">{description}</p>
    </header>
  );
}
