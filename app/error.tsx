'use client';

import { useEffect } from 'react';
import { AlertCircleIcon, RefreshCwIcon } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary component for handling runtime errors
 * Provides user-friendly error messages and recovery options
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-4 flex items-center gap-3">
          <AlertCircleIcon className="size-8 text-red-500" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-gray-900">
            Something went wrong
          </h1>
        </div>

        <p className="mb-6 text-gray-600">
          We encountered an unexpected error. Please try refreshing the page or
          contact support if the problem persists.
        </p>

        {error.message && (
          <div className="mb-6 rounded-md bg-gray-100 p-4">
            <p className="font-mono text-xs text-gray-700">{error.message}</p>
          </div>
        )}

        <button
          onClick={reset}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          type="button"
        >
          <RefreshCwIcon className="size-4" aria-hidden="true" />
          Try again
        </button>
      </div>
    </div>
  );
}
