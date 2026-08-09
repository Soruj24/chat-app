"use client";

import { motion } from "framer-motion";
import { Reply, Forward, Copy, Pin, Star, Trash2, SmilePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/types";
import { spring, scaleIn } from "@/lib/animations";

interface ContextMenuProps {
  x: number;
  y: number;
  isPinned: boolean;
  isStarred: boolean;
  onClose: () => void;
  onReply: () => void;
  onForward: () => void;
  onPin: () => void;
  onStar: () => void;
  onDelete: () => void;
  onCopy: () => void;
  onReact?: (emoji: string) => void;
}

const QUICK_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

const MENU_ITEMS = [
  { action: "reply", icon: Reply, label: "Reply", shortcut: "R" },
  { action: "forward", icon: Forward, label: "Forward", shortcut: "F" },
  { action: "copy", icon: Copy, label: "Copy", shortcut: "C" },
  { action: "pin", icon: Pin, label: "Pin", shortcut: "P" },
  { action: "star", icon: Star, label: "Star", shortcut: "S" },
  { action: "delete", icon: Trash2, label: "Delete", danger: true, shortcut: "Del" },
];

export function ContextMenu({
  x,
  y,
  isPinned,
  isStarred,
  onClose,
  onReply,
  onForward,
  onPin,
  onStar,
  onDelete,
  onCopy,
  onReact,
}: ContextMenuProps) {
  const menuX = Math.min(x, window.innerWidth - 220);
  const menuY = Math.min(y, window.innerHeight - 400);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
        className="fixed inset-0 z-[80]"
        onClick={onClose}
      />
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={scaleIn}
        transition={spring.snappy}
        className="fixed z-[90] bg-[var(--bg-elevated)] rounded-2xl shadow-2xl border border-[var(--border-default)] overflow-hidden min-w-[220px] backdrop-blur-xl"
        style={{ left: menuX, top: menuY }}
      >
        {/* Quick reactions */}
        {onReact && (
          <div className="flex items-center gap-0.5 p-2 border-b border-[var(--border-light)]">
            {QUICK_EMOJIS.map((emoji) => (
              <motion.button
                key={emoji}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  onReact(emoji);
                  onClose();
                }}
                className="w-8 h-8 flex items-center justify-center hover:bg-[var(--surface-hover)] rounded-lg transition-colors text-lg"
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        )}

        {/* Menu items */}
        <div className="py-1.5">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.action === "pin" ? isPinned : item.action === "star" ? isStarred : false;
            const label = item.action === "pin"
              ? (isPinned ? "Unpin" : "Pin")
              : item.action === "star"
              ? (isStarred ? "Unstar" : "Star")
              : item.label;

            return (
              <motion.button
                key={item.action}
                whileHover={{ x: 2 }}
                transition={spring.gentle}
                onClick={() => {
                  if (item.action === "reply") onReply();
                  else if (item.action === "forward") onForward();
                  else if (item.action === "copy") onCopy();
                  else if (item.action === "pin") onPin();
                  else if (item.action === "star") onStar();
                  else if (item.action === "delete") onDelete();
                  onClose();
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors group",
                  item.danger
                    ? "text-[var(--danger)] hover:bg-[var(--danger-light)]"
                    : isActive
                    ? "text-[var(--accent)] bg-[var(--accent-light)]"
                    : "text-[var(--fg)] hover:bg-[var(--surface-hover)]"
                )}
              >
                <Icon className={cn(
                  "w-4 h-4",
                  item.danger ? "text-[var(--danger)]" : isActive ? "text-[var(--accent)]" : "text-[var(--fg-secondary)]"
                )} />
                <span className="font-medium flex-1 text-left">{label}</span>
                <span className={cn(
                  "text-[10px] font-mono font-bold opacity-0 group-hover:opacity-60 transition-opacity",
                  item.danger ? "text-[var(--danger)]" : "text-[var(--fg-muted)]"
                )}>
                  {item.shortcut}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
