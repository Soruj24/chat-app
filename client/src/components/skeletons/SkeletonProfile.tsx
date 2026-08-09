"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton, SkeletonCircle } from "@/components/ui/Skeleton";

interface SkeletonProfileProps {
  className?: string;
  variant?: "full" | "compact" | "header";
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
};

export function SkeletonProfile({
  className,
  variant = "full",
}: SkeletonProfileProps) {
  if (variant === "header") {
    return (
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className={cn("flex items-center gap-3 p-4", className)}
      >
        <SkeletonCircle size={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="shimmer" rounded="full" className="h-4 w-32" />
          <Skeleton variant="shimmer" rounded="full" className="h-3 w-20" />
        </div>
      </motion.div>
    );
  }

  if (variant === "compact") {
    return (
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className={cn("flex flex-col items-center p-4", className)}
      >
        <motion.div variants={item}>
          <SkeletonCircle size={64} className="mb-3" />
        </motion.div>
        <Skeleton variant="shimmer" rounded="full" className="h-4 w-28 mb-2" />
        <Skeleton variant="shimmer" rounded="full" className="h-3 w-20" />
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className={cn("space-y-6", className)}
    >
      {/* Avatar section */}
      <motion.div variants={item} className="flex flex-col items-center">
        <SkeletonCircle size={80} className="mb-4" />
        <Skeleton variant="shimmer" rounded="full" className="h-5 w-36 mb-2" />
        <Skeleton variant="shimmer" rounded="full" className="h-3 w-24" />
      </motion.div>

      {/* Stats row */}
      <motion.div variants={item} className="flex justify-center gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center space-y-1">
            <Skeleton variant="shimmer" rounded="full" className="h-6 w-10 mx-auto" />
            <Skeleton variant="shimmer" rounded="full" className="h-2.5 w-12 mx-auto" />
          </div>
        ))}
      </motion.div>

      {/* Info fields */}
      <motion.div variants={item} className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton variant="shimmer" rounded="full" className="h-2.5 w-16" />
            <Skeleton variant="shimmer" rounded="xl" className="h-10 w-full" />
          </div>
        ))}
      </motion.div>

      {/* Action buttons */}
      <motion.div variants={item} className="flex gap-3">
        <Skeleton variant="shimmer" rounded="xl" className="h-10 flex-1" />
        <Skeleton variant="shimmer" rounded="xl" className="h-10 flex-1" />
      </motion.div>
    </motion.div>
  );
}
