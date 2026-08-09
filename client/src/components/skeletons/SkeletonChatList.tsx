"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton, SkeletonCircle, SkeletonText } from "@/components/ui/Skeleton";

interface SkeletonChatListProps {
  count?: number;
  showHeader?: boolean;
  className?: string;
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
};

export function SkeletonChatList({
  count = 8,
  showHeader = true,
  className,
}: SkeletonChatListProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {/* Search bar skeleton */}
      {showHeader && (
        <div className="px-3 py-3">
          <Skeleton variant="shimmer" rounded="xl" className="h-10 w-full" />
        </div>
      )}

      {/* Filter pills */}
      <div className="px-3 pb-2 flex gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="shimmer" rounded="full" className="h-7 w-16" />
        ))}
      </div>

      {/* Chat list items */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex-1 px-1"
      >
        {/* Pinned section label */}
        <div className="px-3 py-2 flex items-center gap-2">
          <Skeleton variant="shimmer" rounded="full" className="h-2.5 w-10" />
        </div>

        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            variants={item}
            className="flex items-center gap-3 px-3 py-2.5"
          >
            {/* Avatar */}
            <SkeletonCircle size={48} className="shrink-0" />

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton variant="shimmer" rounded="full" className="h-3.5" style={{ width: `${40 + Math.random() * 30}%` }} />
                <Skeleton variant="shimmer" rounded="full" className="h-2.5 w-8" />
              </div>
              <Skeleton variant="shimmer" rounded="full" className="h-3" style={{ width: `${50 + Math.random() * 40}%` }} />
            </div>

            {/* Unread badge (random) */}
            {i % 3 === 0 && (
              <Skeleton variant="shimmer" rounded="full" className="h-5 w-5 shrink-0" />
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
