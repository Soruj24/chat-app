"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  glow?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  danger: "btn-danger",
  outline: "bg-transparent text-[var(--fg-secondary)] border border-[var(--border-default)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-strong)] hover:text-[var(--fg)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "btn-xs",
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
  xl: "btn-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon,
      iconRight,
      loading,
      glow,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "btn",
          variantClasses[variant],
          sizeClasses[size],
          glow && "hover-glow",
          loading && "pointer-events-none",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center justify-center">
            <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          </span>
        ) : icon ? (
          <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
        ) : null}
        {children && <span>{children}</span>}
        {iconRight && <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4">{iconRight}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
