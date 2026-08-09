"use client";

import { motion } from "framer-motion";
import { Pin, MessageCircle, Star } from "lucide-react";
import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProfilePinnedMessagesProps {
  messages: Message[];
}

export function ProfilePinnedMessages({ messages }: ProfilePinnedMessagesProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-3">
          <Pin className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">No pinned messages</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Pinned messages will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {messages.map((msg, i) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
        >
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 shrink-0 mt-0.5">
              <Pin className="w-3 h-3 text-amber-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {msg.senderName || "Unknown"}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                  {new Date(msg.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
                {msg.text}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
