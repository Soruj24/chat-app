"use client";

import { Message } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Pin, X, ChevronRight } from "lucide-react";
import { spring } from "@/lib/animations";

interface PinnedMessagesBarProps {
  pinnedMessages: Message[];
  currentPinnedIndex: number;
  onNavigate: () => void;
  onClear: () => void;
}

export function PinnedMessagesBar({ pinnedMessages, currentPinnedIndex, onNavigate, onClear }: PinnedMessagesBarProps) {
  return (
    <AnimatePresence>
      {pinnedMessages.length > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={spring.gentle}
          className="bg-white/80 dark:bg-[#0f1724]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800/50 overflow-hidden z-10"
        >
          <div className="flex items-center justify-between px-4 py-2.5 gap-3 cursor-pointer group" onClick={onNavigate}>
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Pin className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider">
                  Pinned {pinnedMessages.length > 1 ? `(${currentPinnedIndex + 1}/${pinnedMessages.length})` : ""}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate group-hover:text-blue-500 transition-colors">
                  {pinnedMessages[currentPinnedIndex].text}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClear}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
