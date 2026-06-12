import { cn } from "@/lib/utils";
import { EmptyStateArt, type EmptyStateArtVariant } from "@/components/illustrations";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  /** Picks the illustrated scene drawn above the message. */
  variant?: EmptyStateArtVariant;
}

export function EmptyState({ icon, title, description, action, className, variant = "generic" }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6 gap-3",
        className
      )}
    >
      <EmptyStateArt variant={variant} className="w-40 h-32" />
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
