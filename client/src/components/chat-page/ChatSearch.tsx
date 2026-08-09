"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/animations";
import { useEffect } from "react";

interface ChatSearchProps {
  isOpen: boolean;
  query: string;
  setQuery: (query: string) => void;
  filteredCount: number;
  currentIndex: number;
  onNavigate: (direction: "up" | "down") => void;
  onClose: () => void;
}

export function ChatSearch({
  isOpen,
  query,
  setQuery,
  filteredCount,
  currentIndex,
  onNavigate,
  onClose,
}: ChatSearchProps) {
  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault();
        onNavigate("up");
      } else if (e.key === "Enter") {
        e.preventDefault();
        onNavigate("down");
      } else if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault();
        // Already open, focus input
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={spring.gentle}
          className="bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border-light)] overflow-hidden"
        >
          <div className="p-2.5 max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-muted)]" />
              <input
                type="text"
                placeholder="Search in conversation... (⌘F)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl py-2 pl-10 pr-28 text-sm text-[var(--fg)] placeholder-[var(--fg-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]/40 transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {query && (
                  <>
                    <div className="flex items-center bg-[var(--surface-tertiary)] rounded-lg px-2 py-0.5 mr-1">
                      <span className="text-[10px] font-bold text-[var(--fg-secondary)] tabular-nums">
                        {filteredCount > 0 ? currentIndex + 1 : 0}/{filteredCount}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onNavigate("up")}
                      className="p-1 hover:bg-[var(--surface-hover)] rounded-lg text-[var(--fg-muted)] transition-colors"
                      title="Previous (Shift+Enter)"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 rotate-90" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onNavigate("down")}
                      className="p-1 hover:bg-[var(--surface-hover)] rounded-lg text-[var(--fg-muted)] transition-colors"
                      title="Next (Enter)"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 -rotate-90" />
                    </motion.button>
                  </>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-1 hover:bg-[var(--surface-hover)] rounded-lg text-[var(--fg-muted)] transition-colors"
                  title="Close (Esc)"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
