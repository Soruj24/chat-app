"use client";

import { cn } from "@/lib/utils";

interface OnlineIndicatorProps {
  isOnline: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  themeColor?: string;
}

export function OnlineIndicator({ isOnline, size = "md", className, themeColor }: OnlineIndicatorProps) {
  if (!isOnline) return null;

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
  };

  return (
    <span className={cn("relative flex items-center justify-center", className)}>
      <span
        className={cn(
          "absolute rounded-full animate-ping opacity-40",
          sizeClasses[size]
        )}
        style={{ backgroundColor: themeColor || "#22c55e" }}
      />
      <span
        className={cn("relative rounded-full border-2 border-white dark:border-gray-900", sizeClasses[size])}
        style={{ backgroundColor: themeColor || "#22c55e" }}
      />
    </span>
  );
}
