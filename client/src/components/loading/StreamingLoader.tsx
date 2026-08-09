"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StreamingLoaderProps {
  text?: string;
  variant?: "dots" | "wave" | "pulse" | "message";
  className?: string;
}

export function StreamingLoader({
  text = "Thinking",
  variant = "dots",
  className,
}: StreamingLoaderProps) {
  if (variant === "message") {
    return (
      <div className={cn("flex items-start gap-3 px-4 py-2", className)}>
        <div className="w-8 h-8 rounded-full bg-[var(--surface-tertiary)] shrink-0" />
        <div className="bg-white dark:bg-[#1e2c33] rounded-2xl rounded-bl-md px-4 py-3 border border-[var(--border-light)] dark:border-[var(--border-default)]">
          <StreamingDots />
        </div>
      </div>
    );
  }

  if (variant === "wave") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex items-center gap-[3px]">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full bg-[var(--color-primary)]"
              animate={{
                height: [6, 16, 6],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.08,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <span className="text-xs font-medium text-[var(--text-secondary)]">
          {text}
        </span>
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <motion.div
          className="w-2 h-2 rounded-full bg-[var(--color-primary)]"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="text-xs font-medium text-[var(--text-secondary)]">
          {text}
        </span>
      </div>
    );
  }

  // Default: dots
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <StreamingDots />
      <span className="text-xs font-medium text-[var(--text-secondary)]">
        {text}
      </span>
    </div>
  );
}

function StreamingDots() {
  return (
    <div className="flex items-center gap-[3px]">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-[5px] h-[5px] rounded-full bg-[var(--text-tertiary)]"
          animate={{
            y: [0, -4, 0],
            opacity: [0.4, 1, 0.4],
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
  );
}

export function StreamingText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("text-sm text-[var(--text-primary)]", className)}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.01 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}
