"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton, SkeletonCircle } from "@/components/ui/Skeleton";

interface SkeletonSidebarProps {
  className?: string;
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
};

export function SkeletonSidebar({ className }: SkeletonSidebarProps) {
  return (
    <div className={cn("w-16 h-full flex flex-col items-center py-4 gap-3", className)}>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center gap-3 flex-1"
      >
        {/* Workspace icons */}
        {[1, 2, 3, 4].map((i) => (
          <motion.div key={`ws-${i}`} variants={item}>
            <Skeleton variant="shimmer" rounded="xl" className="h-10 w-10" />
          </motion.div>
        ))}

        {/* Divider */}
        <Skeleton variant="shimmer" rounded="full" className="h-px w-6 my-1" />

        {/* Quick actions */}
        {[1, 2].map((i) => (
          <motion.div key={`action-${i}`} variants={item}>
            <Skeleton variant="shimmer" rounded="xl" className="h-10 w-10" />
          </motion.div>
        ))}
      </motion.div>

      {/* User avatar at bottom */}
      <motion.div variants={item} initial="hidden" animate="visible">
        <SkeletonCircle size={36} className="shrink-0" />
      </motion.div>
    </div>
  );
}
