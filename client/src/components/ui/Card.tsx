"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type CardVariant = "default" | "glass" | "elevated" | "interactive";
type CardPadding = "none" | "sm" | "md" | "lg" | "xl";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  hover?: boolean;
  noBorder?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  default: "card",
  glass: "card-glass",
  elevated: "bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)]",
  interactive: "card card-interactive card-interactive",
};

const paddingClasses: Record<CardPadding, string> = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      hover = false,
      noBorder = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          variantClasses[variant],
          paddingClasses[padding],
          hover && "card-hover",
          noBorder && "border-0",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  noBorder?: boolean;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ noBorder = false, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-6 py-4",
        !noBorder && "border-b border-[var(--border-light)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = "CardHeader";

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("p-6", className)} {...props}>
      {children}
    </div>
  )
);

CardBody.displayName = "CardBody";

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-6 py-4 border-t border-[var(--border-light)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = "CardFooter";
