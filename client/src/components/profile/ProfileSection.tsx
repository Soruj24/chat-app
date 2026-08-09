"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

const card: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

interface ProfileSectionProps {
  children: ReactNode;
  title?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  delay?: number;
  noPadding?: boolean;
  noDivider?: boolean;
}

export function ProfileSection({
  children,
  title,
  icon,
  action,
  className,
  delay = 0,
  noPadding = false,
  noDivider = false,
}: ProfileSectionProps) {
  return (
    <motion.div
      variants={card}
      initial="hidden"
      animate="visible"
      transition={{ delay, type: "spring" as const, stiffness: 300, damping: 30 }}
      className={cn(
        "bg-white dark:bg-gray-900/80",
        "rounded-2xl",
        "border border-gray-100 dark:border-gray-800",
        "shadow-sm dark:shadow-gray-900/20",
        "backdrop-blur-sm",
        "overflow-hidden",
        className
      )}
    >
      {title && (
        <div className={cn(
          "flex items-center justify-between",
          noPadding ? "px-5 pt-4" : "px-5 pt-5",
          !noDivider && "border-b border-gray-50 dark:border-gray-800/50"
        )}>
          <div className="flex items-center gap-2.5">
            {icon && (
              <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800">
                {icon}
              </div>
            )}
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          </div>
          {action}
        </div>
      )}
      <div className={noPadding ? "" : "p-5"}>
        {children}
      </div>
    </motion.div>
  );
}
