"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";

interface SkeletonImageProps {
  width?: number | string;
  height?: number | string;
  aspectRatio?: "square" | "video" | "wide" | "tall";
  className?: string;
  showOverlay?: boolean;
}

const aspectRatioMap = {
  square: "aspect-square",
  video: "aspect-video",
  wide: "aspect-[16/9]",
  tall: "aspect-[3/4]",
};

export function SkeletonImage({
  width,
  height,
  aspectRatio = "video",
  className,
  showOverlay = true,
}: SkeletonImageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "relative overflow-hidden bg-gray-100 dark:bg-gray-800/50",
        !height && aspectRatioMap[aspectRatio],
        className
      )}
      style={{ width, height }}
    >
      {/* Base shimmer */}
      <Skeleton variant="shimmer" className="absolute inset-0 w-full h-full rounded-none" />

      {/* Image icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-gray-300 dark:text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      {/* Shimmer sweep overlay */}
      {showOverlay && (
        <div className="absolute inset-0 skeleton-sweep" />
      )}
    </motion.div>
  );
}

export function SkeletonImageGrid({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonImage key={i} aspectRatio="square" />
      ))}
    </div>
  );
}
