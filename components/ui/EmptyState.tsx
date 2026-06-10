import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

function WaveIllustration() {
  return (
    <svg viewBox="0 0 120 36" className="w-24 h-7 mb-1 opacity-20" fill="none" aria-hidden="true">
      <path
        d="M0 18 Q15 4 30 18 Q45 32 60 18 Q75 4 90 18 Q105 32 120 18"
        stroke="#19C7C2" strokeWidth="2.5" strokeLinecap="round"
      />
      <path
        d="M0 26 Q15 12 30 26 Q45 40 60 26 Q75 12 90 26 Q105 40 120 26"
        stroke="#1390AE" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"
      />
      <circle cx="60" cy="14" r="3" fill="#19C7C2" opacity="0.4" />
      <path d="M60 14 L60 22" stroke="#19C7C2" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M56 20 L60 22 L64 20" stroke="#19C7C2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
    </svg>
  );
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6 gap-3",
        className
      )}
    >
      <WaveIllustration />
      {icon && (
        <div className="w-14 h-14 rounded-full bg-aqua-100 flex items-center justify-center text-aqua-500">
          {icon}
        </div>
      )}
      <div className="space-y-1 max-w-xs">
        <p className="font-display font-600 text-ink-900 text-base">{title}</p>
        {description && (
          <p className="text-sm text-ink-600">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
