"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value?: number;
  variant?: "determinate" | "indeterminate" | "buffer";
  size?: "sm" | "md" | "lg";
  color?: "primary" | "success" | "warning" | "danger";
  showLabel?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "h-1",
  md: "h-1.5",
  lg: "h-2.5",
};

const colorMap = {
  primary: "bg-[var(--color-primary)]",
  success: "bg-[var(--color-success)]",
  warning: "bg-[var(--color-warning)]",
  danger: "bg-[var(--color-danger)]",
};

export function ProgressBar({
  value = 0,
  variant = "determinate",
  size = "md",
  color = "primary",
  showLabel = false,
  className,
}: ProgressBarProps) {
  const trackClass = cn(
    "w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700/60",
    sizeMap[size],
    className
  );

  if (variant === "indeterminate") {
    return (
      <div className={trackClass}>
        <motion.div
          className={cn("h-full rounded-full", colorMap[color])}
          initial={{ x: "-100%", width: "40%" }}
          animate={{ x: "250%" }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    );
  }

  if (variant === "buffer") {
    return (
      <div className={cn("relative", trackClass)}>
        {/* Buffer bar (lighter) */}
        <div
          className={cn("absolute inset-y-0 left-0 rounded-full opacity-30", colorMap[color])}
          style={{ width: `${Math.min(value + 15, 100)}%` }}
        />
        {/* Progress bar */}
        <motion.div
          className={cn("absolute inset-y-0 left-0 rounded-full", colorMap[color])}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>
    );
  }

  // Determinate
  return (
    <div>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-[var(--text-secondary)]">
            Progress
          </span>
          <span className="text-xs font-bold tabular-nums text-[var(--text-primary)]">
            {Math.round(value)}%
          </span>
        </div>
      )}
      <div className={trackClass}>
        <motion.div
          className={cn("h-full rounded-full", colorMap[color])}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  );
}

export function CircularProgress({
  value = 0,
  size = 40,
  strokeWidth = 3,
  variant = "determinate",
  color = "primary",
  className,
}: {
  value?: number;
  size?: number;
  strokeWidth?: number;
  variant?: "determinate" | "indeterminate";
  color?: "primary" | "success" | "warning" | "danger";
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const strokeColor = {
    primary: "stroke-[var(--color-primary)]",
    success: "stroke-[var(--color-success)]",
    warning: "stroke-[var(--color-warning)]",
    danger: "stroke-[var(--color-danger)]",
  }[color];

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        variant === "indeterminate" && "animate-spin",
        className
      )}
      style={{
        width: size,
        height: size,
        animationDuration: variant === "indeterminate" ? "1.2s" : undefined,
      }}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700/60"
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={strokeColor}
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      {value > 0 && variant === "determinate" && (
        <span className="absolute text-[10px] font-bold tabular-nums text-[var(--text-primary)]">
          {Math.round(value)}
        </span>
      )}
    </div>
  );
}
