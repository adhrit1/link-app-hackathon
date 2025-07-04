'use client';

import { useEffect } from 'react';

export default function ModelError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to the server
    console.error('Model page error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-red-600">Something went wrong!</h2>
        <div className="mb-4 rounded bg-red-50 p-4">
          <p className="text-red-800">{error.message}</p>
          {error.digest && (
            <p className="mt-2 text-sm text-red-600">Error ID: {error.digest}</p>
          )}
        </div>
        <div className="space-x-4">
          <button
            onClick={() => reset()}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Try again
          </button>
          <a
            href="/all-models"
            className="inline-block rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            Back to Models
          </a>
        </div>
      </div>
    </div>
  );
} 