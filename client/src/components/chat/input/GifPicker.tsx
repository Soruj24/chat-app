"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Search, X, Image } from "lucide-react";

interface GifPickerProps {
  isOpen: boolean;
  onSelect: (url: string) => void;
  onClose: () => void;
}

const TRENDING_GIFS = [
  "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
  "https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif",
  "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
  "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif",
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif",
  "https://media.giphy.com/media/3o7TKDEzZl3lwWq5Go/giphy.gif",
  "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
];

const GIF_CATEGORIES = [
  { name: "Trending", query: "trending" },
  { name: "Reactions", query: "reactions" },
  { name: "Funny", query: "funny" },
  { name: "Sad", query: "sad" },
  { name: "Love", query: "love" },
  { name: "Animals", query: "animals" },
];

export function GifPicker({ isOpen, onSelect, onClose }: GifPickerProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute bottom-full left-0 mb-2 w-[340px] h-[420px] rounded-2xl overflow-hidden z-50 flex flex-col composer-popup"
        >
          {/* Search */}
          <div className="p-3 border-b border-[var(--border-light)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search GIFs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-[var(--composer-bg)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-[var(--composer-toolbar-hover)] rounded-full text-[var(--text-tertiary)]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-[var(--border-light)] overflow-x-auto no-scrollbar">
            {GIF_CATEGORIES.map((cat, i) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(i)}
                className={cn(
                  "px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-150 whitespace-nowrap",
                  activeCategory === i
                    ? "bg-[var(--color-primary)] text-white shadow-sm"
                    : "bg-[var(--composer-bg)] text-[var(--text-secondary)] hover:bg-[var(--composer-toolbar-hover)] border border-[var(--border-default)]"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* GIF grid */}
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            <div className="grid grid-cols-2 gap-2">
              {TRENDING_GIFS.map((gif, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelect(gif);
                    onClose();
                  }}
                  className="relative aspect-video rounded-xl overflow-hidden bg-[var(--composer-bg)] hover:ring-2 hover:ring-[var(--color-primary)]/50 transition-all duration-200 group"
                >
                  <img
                    src={gif}
                    alt={`GIF ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <Image className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
