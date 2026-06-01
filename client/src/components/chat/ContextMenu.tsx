"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Copy, Trash2, Share2, CornerUpRight, Pin, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { QuickReactions } from "./context-menu/QuickReactions";
import { ContextMenuItem } from "./context-menu/ContextMenuItem";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onCopy: () => void;
  onDelete: () => void;
  onForward: () => void;
  onReply: () => void;
  onPin: () => void;
  onStar: () => void;
  onReact: (emoji: string) => void;
  isPinned?: boolean;
  isStarred?: boolean;
}

export function ContextMenu({
  x,
  y,
  onClose,
  onCopy,
  onDelete,
  onForward,
  onReply,
  onPin,
  onStar,
  onReact,
  isPinned,
  isStarred,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const emojis = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  // Determine transform based on screen position to avoid overflow
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 0;
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 0;
  
  const isRightSide = x > screenWidth / 2;
  const isBottomSide = y > screenHeight / 2;

  const [deleteMode, setDeleteMode] = useState<"me" | "everyone" | null>(null);

  const handleDelete = (mode: "me" | "everyone") => {
    setDeleteMode(mode);
    onDelete();
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.9, y: isBottomSide ? 10 : -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: isBottomSide ? 10 : -10 }}
        className="fixed z-[100] bg-[#ffffff] dark:bg-[#18222d] rounded-xl shadow-2xl border border-[#e6e8ec] dark:border-[#2b3142] py-1.5 min-w-[200px] overflow-hidden"
        style={{ 
          left: x, 
          top: y,
          transform: `translate(${isRightSide ? "-100%" : "0"}, ${isBottomSide ? "-100%" : "0"})`
        }}
      >
        <QuickReactions emojis={emojis} onReact={onReact} onClose={onClose} />

        <div className="flex flex-col">
          <ContextMenuItem
            label="Reply"
            icon={CornerUpRight}
            onClick={() => handleAction(onReply)}
            iconColor="text-[#28a8e8]"
          />
          <ContextMenuItem
            label={isStarred ? "Unstar" : "Star"}
            icon={Star}
            onClick={() => handleAction(onStar)}
            iconColor={
              isStarred ? "text-[#ffab00]" : "text-[#8e8e93]"
            }
            iconFill={isStarred}
          />
          <ContextMenuItem
            label={isPinned ? "Unpin" : "Pin"}
            icon={Pin}
            onClick={() => handleAction(onPin)}
            iconColor={
              isPinned ? "text-[#28a8e8]" : "text-[#8e8e93]"
            }
            iconFill={isPinned}
          />
          <ContextMenuItem
            label="Copy"
            icon={Copy}
            onClick={() => handleAction(onCopy)}
            iconColor="text-[#8e8e93]"
          />
          <ContextMenuItem
            label="Forward"
            icon={Share2}
            onClick={() => handleAction(onForward)}
            iconColor="text-[#34c759]"
          />

          <div className="h-px bg-[#e6e8ec] dark:bg-[#2b3142] my-1" />

          <ContextMenuItem
            label="Delete for me"
            icon={Trash2}
            onClick={() => handleDelete("me")}
            variant="danger"
          />
          <ContextMenuItem
            label="Delete for everyone"
            icon={Trash2}
            onClick={() => handleDelete("everyone")}
            variant="danger"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
