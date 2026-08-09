"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface SmoothTransitionProps {
  isLoading: boolean;
  loadingContent: ReactNode;
  children: ReactNode;
  variant?: "fade" | "slide" | "scale" | "crossfade";
  className?: string;
  minLoadingTime?: number;
}

const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
  },
  crossfade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
};

export function SmoothTransition({
  isLoading,
  loadingContent,
  children,
  variant = "fade",
  className,
}: SmoothTransitionProps) {
  const v = variants[variant];

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={v.initial}
            animate={v.animate}
            exit={v.exit}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            {loadingContent}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={v.initial}
            animate={v.animate}
            exit={v.exit}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1], delay: 0.05 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LoadingOverlay({
  isLoading,
  children,
  className,
  blur = false,
}: {
  isLoading: boolean;
  children: ReactNode;
  className?: string;
  blur?: boolean;
}) {
  return (
    <div className={cn("relative", className)}>
      {children}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute inset-0 flex items-center justify-center z-10",
              "bg-white/80 dark:bg-[var(--background)]/80",
              blur && "backdrop-blur-sm"
            )}
          >
            <LoadingPulse />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LoadingPulse() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-[3px]">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-[5px] h-[5px] rounded-full bg-[var(--color-primary)]"
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
    </div>
  );
}

export function SkeletonTransition({
  isLoading,
  skeleton,
  children,
  className,
}: {
  isLoading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative min-h-[100px]", className)}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
          >
            {skeleton}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
