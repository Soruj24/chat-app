"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

interface EmojiPickerProps {
  isOpen: boolean;
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const EMOJI_CATEGORIES = [
  {
    name: "Smileys",
    icon: "😀",
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "😮‍💨", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "🥸", "😎", "🤓", "🧐"],
  },
  {
    name: "Gestures",
    icon: "👋",
    emojis: ["👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "💪"],
  },
  {
    name: "Hearts",
    icon: "❤️",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "♥️"],
  },
  {
    name: "Objects",
    icon: "🔥",
    emojis: ["🔥", "✨", "🌟", "💫", "⭐", "🌈", "☀️", "🌙", "💧", "💦", "💎", "🎉", "🎊", "🎈", "🎁", "🏆", "🥇", "🎵", "🎶", "📸", "💡", "🔒", "🔑", "🔗", "📌", "📎", "✏️", "📝"],
  },
  {
    name: "Food",
    icon: "🍔",
    emojis: ["🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍒", "🍑", "🥭", "🍍", "🥝", "🍅", "🍔", "🍟", "🍕", "🌭", "🥪", "🌮", "🌯", "🍜", "🍝", "🍣", "🍱", "🍰", "🎂", "🍩", "🍪", "🍫", "☕"],
  },
  {
    name: "Animals",
    icon: "🐱",
    emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🐤", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞"],
  },
  {
    name: "Travel",
    icon: "✈️",
    emojis: ["✈️", "🚀", "🛸", "🏠", "🏡", "🏢", "🏣", "🏥", "🏦", "🏨", "🏪", "🗼", "🎡", "🎢", "🎠", "🏖️", "⛰️", "🌋", "🗻", "🏕️", "🌍", "🌎", "🌏"],
  },
];

export function EmojiPicker({ isOpen, onSelect, onClose }: EmojiPickerProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      setActiveCategory(0);
    }
  }, [isOpen]);

  const filteredCategories = search
    ? [
        {
          name: "Search Results",
          icon: "🔍",
          emojis: EMOJI_CATEGORIES.flatMap((c) => c.emojis).filter(
            (_, i, arr) => arr.indexOf(_) === i
          ),
        },
      ]
    : EMOJI_CATEGORIES;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
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
                placeholder="Search emoji..."
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
          {!search && (
            <div className="flex items-center gap-1 px-3 py-2 border-b border-[var(--border-light)] overflow-x-auto no-scrollbar">
              {EMOJI_CATEGORIES.map((cat, i) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(i)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-sm transition-all duration-150 shrink-0",
                    activeCategory === i
                      ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                      : "text-[var(--text-tertiary)] hover:bg-[var(--composer-toolbar-hover)]"
                  )}
                  title={cat.name}
                >
                  {cat.icon}
                </button>
              ))}
            </div>
          )}

          {/* Emoji grid */}
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {(search
              ? [
                  {
                    name: "Results",
                    emojis: EMOJI_CATEGORIES.flatMap((c) => c.emojis)
                      .filter((e, i, a) => a.indexOf(e) === i)
                      .slice(0, 30),
                  },
                ]
              : [EMOJI_CATEGORIES[activeCategory]]
            ).map((cat) => (
              <div key={cat.name}>
                <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 px-1">
                  {cat.name}
                </p>
                <div className="grid grid-cols-8 gap-0.5">
                  {cat.emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        onSelect(emoji);
                        onClose();
                      }}
                      className="w-9 h-9 flex items-center justify-center hover:bg-[var(--composer-toolbar-hover)] rounded-lg transition-all duration-100 text-xl active:scale-90"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
