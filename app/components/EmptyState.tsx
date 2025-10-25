import { memo } from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
}

export const EmptyState = memo(function EmptyState({
  icon = '👋',
  title,
  subtitle,
}: EmptyStateProps) {
  return (
    <div className="text-center text-gray-600 mt-10">
      <p className="text-4xl mb-2">{icon}</p>
      <p className="text-lg font-medium mb-1">{title}</p>
      {subtitle && <p className="text-sm">{subtitle}</p>}
    </div>
  );
});
