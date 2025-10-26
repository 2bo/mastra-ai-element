import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Weather Chat - Mastra AI',
  description: 'Chat with an AI weather assistant powered by Mastra',
  keywords: ['AI', 'weather', 'chat', 'assistant', 'Mastra'],
  authors: [{ name: 'Mastra AI' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

interface RootLayoutProps {
  children: ReactNode;
}

/**
 * Root layout component for the application
 * Provides HTML structure and global styles
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
