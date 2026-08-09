"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Image, FileText, MapPin, User, Smile, Bold, Italic, Code, List,
  Type, Hash, AtSign, Mic, Film
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  query: string;
  selectedIndex: number;
  onSelect: (command: string) => void;
}

const COMMANDS = [
  { id: "image", label: "Send Image", description: "Upload a photo", icon: Image, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { id: "file", label: "Send File", description: "Share a document", icon: FileText, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20" },
  { id: "location", label: "Share Location", description: "Send your location", icon: MapPin, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
  { id: "contact", label: "Share Contact", description: "Send a contact card", icon: User, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
  { id: "gif", label: "Send GIF", description: "Browse animated GIFs", icon: Film, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-900/20" },
  { id: "emoji", label: "Emoji Picker", description: "Open emoji panel", icon: Smile, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
  { id: "bold", label: "Bold Text", description: "Make text bold", icon: Bold, color: "text-gray-600", bg: "bg-gray-50 dark:bg-gray-800/40" },
  { id: "italic", label: "Italic Text", description: "Make text italic", icon: Italic, color: "text-gray-600", bg: "bg-gray-50 dark:bg-gray-800/40" },
  { id: "code", label: "Code Block", description: "Insert code", icon: Code, color: "text-gray-600", bg: "bg-gray-50 dark:bg-gray-800/40" },
  { id: "list", label: "Bullet List", description: "Create a list", icon: List, color: "text-gray-600", bg: "bg-gray-50 dark:bg-gray-800/40" },
  { id: "heading", label: "Heading", description: "Add a heading", icon: Type, color: "text-gray-600", bg: "bg-gray-50 dark:bg-gray-800/40" },
  { id: "mention", label: "Mention Someone", description: "Tag a person", icon: AtSign, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { id: "voice", label: "Voice Message", description: "Record audio", icon: Mic, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
];

export function CommandPalette({ isOpen, query, selectedIndex, onSelect }: CommandPaletteProps) {
  const filtered = COMMANDS.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.description.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  return (
    <AnimatePresence>
      {isOpen && filtered.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ type: "spring", damping: 25, stiffness: 400 }}
          className="absolute bottom-full mb-2 left-0 w-72 max-h-80 overflow-hidden rounded-2xl composer-popup z-50 flex flex-col"
        >
          <div className="px-3 py-2 border-b border-[var(--border-light)]">
            <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">
              Commands
            </span>
          </div>
          <div className="overflow-y-auto custom-scrollbar max-h-64 py-1">
            {filtered.map((cmd, index) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => onSelect(cmd.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 transition-all duration-100",
                    index === selectedIndex
                      ? "bg-[var(--color-primary)]/8"
                      : "hover:bg-[var(--composer-suggestion-hover)]"
                  )}
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", cmd.bg)}>
                    <Icon className={cn("w-4 h-4", cmd.color)} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {cmd.label}
                    </p>
                    <p className="text-[11px] text-[var(--text-tertiary)]">
                      {cmd.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
