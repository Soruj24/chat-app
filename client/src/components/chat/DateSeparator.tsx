"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DateSeparatorProps {
  date: string;
}

export function DateSeparator({ date }: DateSeparatorProps) {
  return (
    <div className="flex items-center justify-center my-5 px-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border-default)] to-transparent" />
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "mx-3 px-3 py-1 text-[11px] font-semibold tracking-wide",
          "bg-[var(--glass-bg-heavy)] backdrop-blur-[var(--glass-blur)]",
          "text-[var(--fg-tertiary)]",
          "rounded-[var(--radius-full)] border border-[var(--border-light)]",
          "shadow-[var(--shadow-xs)]"
        )}
      >
        {date}
      </motion.span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border-default)] to-transparent" />
    </div>
  );
}
