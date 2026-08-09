"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { spring, fadeUp } from "@/lib/animations";

interface TypingIndicatorProps {
  userName?: string;
  themeColor?: string;
}

export function TypingIndicator({ userName, themeColor }: TypingIndicatorProps) {
  if (!userName) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={fadeUp}
      transition={spring.gentle}
      className="flex items-end gap-3 px-4 py-2"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-2xl)] rounded-bl-[var(--radius-sm)] bg-[var(--bg-elevated)] border border-[var(--border-light)] shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-[3px]">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-[6px] h-[6px] rounded-[var(--radius-full)]"
              style={{ backgroundColor: themeColor || "var(--fg-tertiary)" }}
              animate={{ 
                y: [0, -5, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.7,
                repeat: Infinity,
                delay: i * 0.12,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <span className="text-xs text-[var(--fg-tertiary)] ml-1">
          {userName}
        </span>
      </div>
    </motion.div>
  );
}
