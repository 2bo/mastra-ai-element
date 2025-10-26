import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { UIMessage } from 'ai';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, HTMLAttributes, ReactNode } from 'react';

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage['role'];
};

export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      'group flex w-full items-end justify-end gap-2 py-4',
      from === 'user' ? 'is-user' : 'is-assistant flex-row-reverse justify-end',
      className
    )}
    {...props}
  />
);

const messageContentVariants = cva(
  'is-user:dark flex flex-col gap-2 overflow-hidden rounded-lg text-sm',
  {
    variants: {
      variant: {
        contained: [
          'max-w-[80%] px-4 py-3',
          'group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground',
          'group-[.is-assistant]:bg-secondary group-[.is-assistant]:text-foreground',
        ],
        flat: [
          'group-[.is-user]:max-w-[80%] group-[.is-user]:bg-secondary group-[.is-user]:px-4 group-[.is-user]:py-3 group-[.is-user]:text-foreground',
          'group-[.is-assistant]:text-foreground',
        ],
      },
    },
    defaultVariants: {
      variant: 'contained',
    },
  }
);

export type MessageContentProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof messageContentVariants>;

export const MessageContent = ({
  children,
  className,
  variant,
  ...props
}: MessageContentProps) => (
  <div
    className={cn(messageContentVariants({ variant, className }))}
    {...props}
  >
    {children}
  </div>
);

export type MessageAvatarProps = Omit<
  ComponentProps<typeof Avatar>,
  'children'
> & {
  src?: string;
  name?: string;
  icon?: ReactNode;
};

export const MessageAvatar = ({
  src,
  name,
  icon,
  className,
  ...props
}: MessageAvatarProps) => {
  const initials = name?.slice(0, 2);
  const trimmedInitials =
    typeof initials === 'string' ? initials.trim() : undefined;
  const safeInitials = trimmedInitials === '' ? undefined : trimmedInitials;

  // アイコンがある場合は、Avatarコンポーネントを使わずに直接レンダリング
  if (icon) {
    return (
      <div
        className={cn(
          'flex size-8 items-center justify-center rounded-full bg-muted ring-1 ring-border',
          className
        )}
      >
        {icon}
      </div>
    );
  }

  return (
    <Avatar className={cn('size-8 ring-1 ring-border', className)} {...props}>
      {src && <AvatarImage alt="" className="mt-0 mb-0" src={src} />}
      <AvatarFallback>{safeInitials ?? 'ME'}</AvatarFallback>
    </Avatar>
  );
};
