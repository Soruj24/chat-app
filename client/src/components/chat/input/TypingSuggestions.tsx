"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface TypingSuggestionsProps {
  suggestions: string[];
  visible: boolean;
  onSelect: (suggestion: string) => void;
  selectedIndex: number;
}

const QUICK_REPLIES = [
  "Ok",
  "Sure",
  "Thanks!",
  "Got it",
  "Sounds good",
  "On my way",
  "Let me check",
  "Sure thing",
  "No problem",
  "Perfect",
];

export function TypingSuggestions({ suggestions, visible, onSelect, selectedIndex }: TypingSuggestionsProps) {
  const items = suggestions.length > 0 ? suggestions : QUICK_REPLIES;

  return (
    <AnimatePresence>
      {visible && items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-1.5 px-3 py-1.5 overflow-x-auto no-scrollbar"
        >
          <Sparkles className="w-3 h-3 text-[var(--color-primary)] shrink-0 opacity-60" />
          {items.slice(0, 5).map((suggestion, index) => (
            <motion.button
              key={suggestion}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => onSelect(suggestion)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150",
                "border border-[var(--border-default)]",
                index === selectedIndex
                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm"
                  : "bg-[var(--composer-suggestion-bg)] text-[var(--text-secondary)] hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)]"
              )}
            >
              {suggestion}
            </motion.button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
