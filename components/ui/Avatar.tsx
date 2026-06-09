import { cn, initials, avatarColor } from "@/lib/utils";

interface AvatarProps {
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm:  "w-7 h-7 text-[10px]",
  md:  "w-9 h-9 text-xs",
  lg:  "w-11 h-11 text-sm",
  xl:  "w-14 h-14 text-base",
};

export function Avatar({ firstName, lastName, size = "md", className }: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-display font-600 select-none shrink-0",
        sizeMap[size],
        avatarColor(`${firstName}${lastName}`),
        className
      )}
      aria-label={`${firstName} ${lastName}`}
    >
      {initials(firstName, lastName)}
    </span>
  );
}
