import { cn } from "@/lib/utils";

interface PageShellProps {
  children: React.ReactNode;
  /** Remove default padding — used by full-bleed pages like the clients split view. */
  bleed?: boolean;
  className?: string;
}

/**
 * Inner content wrapper for a page. The sidebar offset and bottom-bar spacing
 * are owned by <ShellChrome>; this just applies the standard page padding so
 * pages never repeat it (or hardcode the sidebar width).
 */
export function PageShell({ children, bleed = false, className }: PageShellProps) {
  return (
    <div className={cn(bleed ? "" : "p-4 md:p-6", className)}>
      {children}
    </div>
  );
}
