"use client";

import { useState, useRef, useEffect } from "react";
import { Smile, Send } from "lucide-react";

type EmojiCategory = "Smileys" | "Gestures" | "Hearts" | "Objects" | "Symbols" | "Flags";

const emojiCategories: Record<EmojiCategory, string[]> = {
  "Smileys": ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕"],
  "Gestures": ["👍", "👎", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "👋", "🤚", "🖐️", "✋", "🖖", "👏", "🙌", "🤲", "🤝", "🙏", "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃", "🧠", "🫀", "🫁", "🦷", "🦴", "👀", "👁️", "👅", "👄"],
  "Hearts": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "♥️", "😻", "💯", "🔥", "💥", "⭐", "🌟", "✨", "💫", "💢", "💦", "💨", "🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚"],
  "Objects": ["💼", "📁", "📂", "🗂️", "📅", "📆", "🗒️", "🗓️", "📇", "📈", "📉", "📊", "📋", "📌", "📍", "📎", "🖇️", "📏", "📐", "✂️", "🗃️", "🗄️", "🗑️", "🔒", "🔓", "🔏", "🔐", "🔑", "🗝️", "🔨", "🪓", "⛏️", "⚒️", "🛠️", "🗡️", "⚔️", "🔫", "🛡️", "🔧", "🔩", "⚙️", "🗜️"],
  "Symbols": ["✅", "❌", "❓", "❗", "‼️", "⁉️", "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "⚫", "⚪", "🟤", "🔺", "🔻", "🔸", "🔹", "🔶", "🔷", "🔳", "🔲", "▪️", "▫️", "◾", "◽", "◼️", "◻️", "🟥", "🟧", "🟨", "🟩", "🟦", "🟪", "⬛", "⬜", "🟫", "🔈", "🔇", "🔉", "🔊", "🔔"],
  "Flags": ["🏳️", "🏴", "🏴‍☠️", "🏁", "🚩", "🎌", "🏾", "🏴", "🏵️", "🏷️", "🇺🇸", "🇬🇧", "���🇦", "🇦🇺", "🇩🇪", "🇫🇷", "🇪🇸", "🇮🇹", "🇷🇺", "🇯🇵", "🇰🇷", "🇨🇳", "🇮🇳", "🇧🇷", "🇲🇽", "🇿🇦", "🇳🇬", "🇪🇬", "🇸🇦", "🇮🇪", "🇳🇱", "🇸🇪", "🇨🇭", "🇵🇱", "🇹🇷", "🇹🇭", "🇻🇳", "🇵🇭", "🇮🇩", "🇲🇾", "🇸🇬"],
};

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose?: () => void;
  position?: "top" | "bottom";
}

export function EmojiPicker({ onSelect, onClose, position = "bottom" }: EmojiPickerProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<EmojiCategory>("Smileys");
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const filteredEmojis = Object.fromEntries(
    Object.entries(emojiCategories).map(([category, emojis]) => [
      category,
      emojis.filter(() => !search || category.toLowerCase().includes(search.toLowerCase()))
    ])
  );

  return (
    <div 
      ref={pickerRef}
      className={`absolute z-50 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 w-80 overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
        position === "top" ? "bottom-full mb-2" : "top-full mt-2"
      }`}
    >
      {/* Search */}
      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
        <input
          type="text"
          placeholder="Search emoji..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-1 p-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {Object.keys(emojiCategories).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category as EmojiCategory)}
            className={`p-1.5 rounded-lg text-lg transition-colors ${
              activeCategory === category 
                ? "bg-blue-100 dark:bg-blue-900/30" 
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            title={category}
          >
            {emojiCategories[category as EmojiCategory][0]}
          </button>
        ))}
      </div>

      {/* Emoji Grid */}
      <div className="h-48 overflow-y-auto p-2">
        <div className="grid grid-cols-8 gap-1">
          {(search ? Object.values(filteredEmojis).flat() : emojiCategories[activeCategory]).map((emoji, index) => (
            <button
              key={index}
              onClick={() => {
                onSelect(emoji);
                onClose?.();
              }}
              className="p-1.5 text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ReactionPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export function ReactionPicker({ onSelect, onClose }: ReactionPickerProps) {
  const quickReactions = ["👍", "👎", "❤️", "😂", "😮", "😢", "😡", "🔥"];
  
  return (
    <div className="absolute bottom-full mb-2 left-0 z-50 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-200 dark:border-gray-700 p-2 flex gap-1 animate-in fade-in zoom-in-95 duration-150">
      {quickReactions.map((emoji) => (
        <button
          key={emoji}
          onClick={() => {
            onSelect(emoji);
            onClose();
          }}
          className="p-2 text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          {emoji}
        </button>
      ))}
      <button
        onClick={() => {
          // Could open full emoji picker here
          onClose();
        }}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
      >
        <Smile className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  );
}

interface EmojiButtonProps {
  onClick: () => void;
  className?: string;
}

export function EmojiButton({ onClick, className = "" }: EmojiButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${className}`}
    >
      <Smile className="w-5 h-5 text-gray-500" />
    </button>
  );
}