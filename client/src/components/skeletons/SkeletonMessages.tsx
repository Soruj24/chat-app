"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton, SkeletonCircle } from "@/components/ui/Skeleton";

interface SkeletonMessagesProps {
  count?: number;
  className?: string;
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.15 },
  },
};

const bubbleUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
};

export function SkeletonMessages({
  count = 6,
  className,
}: SkeletonMessagesProps) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className={cn("flex flex-col space-y-3 px-4 py-6", className)}
    >
      {/* Date separator */}
      <motion.div variants={bubbleUp} className="flex items-center justify-center my-2">
        <Skeleton variant="shimmer" rounded="full" className="h-6 w-24" />
      </motion.div>

      {Array.from({ length: count }).map((_, i) => {
        const isMe = i % 3 === 0;
        const widths = [180, 240, 160, 200, 280, 140];
        const width = widths[i % widths.length];

        return (
          <motion.div
            key={i}
            variants={bubbleUp}
            className={cn(
              "flex items-end gap-2.5",
              isMe ? "flex-row-reverse" : "flex-row"
            )}
          >
            {/* Avatar (only for received messages) */}
            {!isMe && (
              <SkeletonCircle size={32} className="shrink-0 mb-1" />
            )}

            {/* Bubble */}
            <div className={cn("flex flex-col", isMe ? "items-end" : "items-start", "max-w-[70%]")}>
              {/* Sender name (for group) */}
              {i % 4 === 0 && !isMe && (
                <Skeleton variant="shimmer" rounded="full" className="h-2.5 w-16 mb-1.5" />
              )}

              {/* Bubble body */}
              <div
                className={cn(
                  "relative overflow-hidden",
                  isMe ? "rounded-2xl rounded-br-md" : "rounded-2xl rounded-bl-md"
                )}
              >
                {/* Image message */}
                {i % 5 === 1 ? (
                  <Skeleton
                    variant="shimmer"
                    rounded="xl"
                    className="h-40 w-52"
                  />
                ) : (
                  /* Text message */
                  <Skeleton
                    variant="shimmer"
                    rounded="xl"
                    className={cn(
                      "px-4 py-3",
                      isMe ? "bg-[var(--color-primary)]/10" : ""
                    )}
                    style={{ width }}
                  >
                    <div className="space-y-1.5">
                      <Skeleton variant="shimmer" rounded="full" className="h-3" style={{ width: `${70 + Math.random() * 25}%` }} />
                      <Skeleton variant="shimmer" rounded="full" className="h-3" style={{ width: `${50 + Math.random() * 40}%` }} />
                    </div>
                  </Skeleton>
                )}

                {/* Timestamp */}
                <div className={cn("flex items-center gap-1 mt-1 px-1", isMe ? "justify-end" : "justify-start")}>
                  <Skeleton variant="shimmer" rounded="full" className="h-2 w-8" />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
