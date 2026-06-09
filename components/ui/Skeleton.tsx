import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
  style?: React.CSSProperties;
}

export function Skeleton({ className, rounded = "md", style }: SkeletonProps) {
  const roundMap = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };
  return (
    <div
      className={cn("animate-pulse bg-hairline", roundMap[rounded], className)}
      style={style}
      aria-hidden="true"
    />
  );
}
