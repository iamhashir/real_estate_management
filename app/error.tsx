"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-surface-base px-6 text-center">
      <div className="mb-5 w-14 h-14 rounded-full bg-coral-100 flex items-center justify-center">
        <AlertCircle size={26} className="text-coral-500" />
      </div>
      <h1 className="text-h2 text-ink-900">Something went wrong</h1>
      <p className="text-sm text-ink-600 mt-2 max-w-xs">
        An unexpected error occurred. You can try refreshing the page or return to the dashboard.
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-ink-500 font-mono">Error ID: {error.digest}</p>
      )}
      <div className="flex gap-3 mt-6">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-gradient-tide text-white text-sm font-medium shadow-card hover:opacity-90 transition-opacity"
        >
          <RefreshCw size={14} />
          Try again
        </button>
        <Link
          href="/dashboard"
          className="px-4 py-2.5 rounded-md border border-hairline text-ink-700 text-sm font-medium hover:bg-aqua-100 transition-colors"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
