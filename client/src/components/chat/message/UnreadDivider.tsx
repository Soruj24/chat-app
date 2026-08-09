"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface UnreadDividerProps {
  count?: number;
}

export function UnreadDivider({ count }: UnreadDividerProps) {
  return (
    <div className="flex items-center justify-center my-4 px-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-800/40 to-transparent" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "mx-3 px-3 py-1 text-[11px] font-bold tracking-wide",
          "bg-blue-500 text-white",
          "rounded-full",
          "shadow-md shadow-blue-500/20"
        )}
      >
        {count && count > 0 ? `${count} new message${count > 1 ? "s" : ""}` : "New messages"}
      </motion.div>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-800/40 to-transparent" />
    </div>
  );
}
