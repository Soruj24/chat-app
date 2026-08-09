"use client";

import { cn } from "@/lib/utils";
import { type CSSProperties, type ReactNode } from "react";

interface SkeletonProps {
  className?: string;
  variant?: "shimmer" | "pulse" | "wave";
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full" | "none";
  style?: CSSProperties;
  children?: ReactNode;
}

const roundedMap = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
  none: "",
};

const variantMap = {
  shimmer: "animate-shimmer",
  pulse: "animate-pulse",
  wave: "skeleton-wave",
};

export function Skeleton({
  className = "",
  variant = "shimmer",
  rounded = "lg",
  style,
  children,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-gray-200 dark:bg-gray-700/60",
        roundedMap[rounded],
        variantMap[variant],
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export function SkeletonCircle({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Skeleton
      variant="shimmer"
      rounded="full"
      className={cn("shrink-0", className)}
      style={{ width: size, height: size }}
    />
  );
}

export function SkeletonText({
  lines = 1,
  className,
  width,
}: {
  lines?: number;
  className?: string;
  width?: string | number;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="shimmer"
          rounded="full"
          className="h-3"
          style={{
            width: i === lines - 1 ? "60%" : width || "100%",
          }}
        />
      ))}
    </div>
  );
}
