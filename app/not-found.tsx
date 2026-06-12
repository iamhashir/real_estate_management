import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-surface-base px-6 text-center">
      <svg viewBox="0 0 200 60" className="w-48 h-12 mb-6 opacity-20" fill="none" aria-hidden="true">
        <path
          d="M0 30 Q25 8 50 30 Q75 52 100 30 Q125 8 150 30 Q175 52 200 30"
          stroke="#17BFBA" strokeWidth="3" strokeLinecap="round"
        />
        <path
          d="M0 42 Q25 20 50 42 Q75 64 100 42 Q125 20 150 42 Q175 64 200 42"
          stroke="#1C97B5" strokeWidth="2" strokeLinecap="round" opacity="0.6"
        />
      </svg>

      <p className="font-display font-bold text-aqua-300 select-none"
        style={{ fontSize: "6rem", lineHeight: 1 }}>
        404
      </p>
      <h1 className="text-h2 text-ink-900 mt-3">Page not found</h1>
      <p className="text-sm text-ink-600 mt-2 max-w-xs">
        This page has sailed out of reach. Let&apos;s get you back to shore.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-gradient-tide text-white text-sm font-medium shadow-card hover:opacity-90 transition-opacity"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
