"use client";

import { motion } from "framer-motion";
import { spring } from "@/lib/animations";

export function MessageListSkeleton({ count = 8, groupAvatar = false }: { count?: number; groupAvatar?: boolean }) {
  const items = Array.from({ length: count });

  return (
    <div className="flex flex-col space-y-3 py-4 px-4">
      {items.map((_, idx) => {
        const isMe = idx % 2 !== 0;
        return (
          <motion.div
            key={idx}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            transition={{ ...spring.gentle, delay: idx * 0.05 }}
            className={cn(
              "flex items-end gap-2.5",
              isMe ? "flex-row-reverse" : "flex-row"
            )}
          >
            {/* Avatar skeleton */}
            <div className="w-8 h-8 rounded-full shrink-0 bg-gray-200 dark:bg-gray-700 animate-shimmer" />

            {/* Bubble skeleton */}
            <div className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
              <div className="h-3 w-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-shimmer mb-1" />
              <div
                className={cn(
                  "h-10 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-shimmer",
                  isMe ? "rounded-br-md" : "rounded-bl-md",
                  isMe ? "w-40" : "w-48"
                )}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}
