"use client";

import { ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { spring, scaleIn } from "@/lib/animations";

interface ScrollToBottomButtonProps {
  isVisible: boolean;
  unreadCount: number;
  onClick: () => void;
}

export function ScrollToBottomButton({ isVisible, unreadCount, onClick }: ScrollToBottomButtonProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={scaleIn}
          transition={spring.gentle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          className="absolute bottom-24 right-4 md:right-8 flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg shadow-black/10 dark:shadow-black/30 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-20"
        >
          {unreadCount > 0 && (
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-blue-500 text-white text-[10px] font-bold rounded-full">
              {unreadCount}
            </span>
          )}
          <ArrowDown className="w-4 h-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
