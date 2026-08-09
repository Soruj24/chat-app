"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

interface EmptyStateProps {
  illustration: ReactNode;
  title: string;
  description: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
  compact?: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

const illustrationVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20, delay: 0.1 },
  },
};

export function EmptyState({
  illustration,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "p-6" : "p-8 md:p-12",
        className
      )}
    >
      {/* Illustration */}
      <motion.div
        variants={illustrationVariants}
        className={cn(
          "relative mb-6",
          compact ? "mb-4" : "mb-6 md:mb-8"
        )}
      >
        <div
          className={cn(
            "relative flex items-center justify-center rounded-[var(--radius-3xl)]",
            "bg-gradient-to-br from-[var(--accent-light)] to-[var(--surface-tertiary)]",
            "border border-[var(--border-light)]",
            "shadow-[var(--shadow-sm)]",
            compact
              ? "w-20 h-20"
              : "w-28 h-28 md:w-32 md:h-32"
          )}
        >
          <div className="absolute inset-0 rounded-[var(--radius-3xl)] bg-[var(--accent)]/5" />
          <div className="relative z-10 text-[var(--accent)]">
            {illustration}
          </div>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h3
        variants={itemVariants}
        className={cn(
          "font-bold tracking-tight",
          "text-[var(--text-primary)]",
          compact ? "text-base mb-1" : "text-lg md:text-xl mb-2"
        )}
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        variants={itemVariants}
        className={cn(
          "leading-relaxed max-w-sm",
          "text-[var(--text-secondary)]",
          compact ? "text-xs" : "text-sm"
        )}
      >
        {description}
      </motion.p>

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <motion.div
          variants={itemVariants}
          className={cn(
            "flex items-center gap-3",
            compact ? "mt-4" : "mt-6 md:mt-8"
          )}
        >
          {primaryAction && (
            <ActionButton
              {...primaryAction}
              variant="primary"
              compact={compact}
            />
          )}
          {secondaryAction && (
            <ActionButton
              {...secondaryAction}
              variant={secondaryAction.variant ?? "secondary"}
              compact={compact}
            />
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

function ActionButton({
  label,
  onClick,
  href,
  icon,
  variant = "primary",
  compact = false,
}: EmptyStateAction & { compact: boolean }) {
  const base = cn(
    "inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-200",
    compact ? "px-3.5 py-2 text-xs" : "px-5 py-2.5 text-sm",
    "active:scale-[0.97]"
  );

  const variants = {
    primary: cn(
      base,
      "bg-[var(--color-primary)] text-white",
      "hover:bg-[var(--color-primary-hover)]",
      "shadow-lg shadow-[var(--color-primary)]/20",
      "hover:shadow-xl hover:shadow-[var(--color-primary)]/25"
    ),
    secondary: cn(
      base,
      "bg-[var(--surface-tertiary)] text-[var(--text-primary)]",
      "hover:bg-[var(--border-default)]",
      "border border-[var(--border-default)]",
      "dark:border-[var(--border-light)]"
    ),
    ghost: cn(
      base,
      "text-[var(--text-secondary)]",
      "hover:text-[var(--text-primary)]",
      "hover:bg-[var(--surface-tertiary)]"
    ),
  };

  const className = variants[variant];

  if (href) {
    return (
      <a href={href} className={className}>
        {icon && <span className="w-4 h-4">{icon}</span>}
        {label}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {icon && <span className="w-4 h-4">{icon}</span>}
      {label}
    </button>
  );
}
