"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/types";
import { Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface MessageQuickReactionsProps {
  message: Message;
  isMe: boolean;
  onReaction: (message: Message, emoji: string) => void;
  onClose: () => void;
  innerRef: React.RefObject<HTMLDivElement | null>;
}

const QUICK_EMOJIS = ["❤️", "😂", "😮", "😢", "🙏", "👍", "🔥", "🎉"];

export function MessageQuickReactions({
  message,
  isMe,
  onReaction,
  onClose,
  innerRef,
}: MessageQuickReactionsProps) {
  return (
    <motion.div
      ref={innerRef}
      initial={{ opacity: 0, y: 8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.9 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={cn(
        "absolute -top-14 z-[60] flex items-center gap-0.5 p-1",
        "bg-white dark:bg-gray-800 rounded-full",
        "shadow-lg shadow-black/10 dark:shadow-black/30",
        "border border-gray-100 dark:border-gray-700",
        isMe ? "right-0" : "left-0"
      )}
    >
      {QUICK_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => {
            onReaction(message, emoji);
            onClose();
          }}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-150 hover:scale-125 active:scale-90 text-lg"
        >
          {emoji}
        </button>
      ))}
    </motion.div>
  );
}
