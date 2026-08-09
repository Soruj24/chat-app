"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { spring, scaleIn } from "@/lib/animations";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  actions: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: "default" | "danger";
    shortcut?: string;
  }>;
}

export function ContextMenu({ x, y, onClose, actions }: ContextMenuProps) {
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const adjustedX = Math.min(x, window.innerWidth - 220);
  const adjustedY = Math.min(y, window.innerHeight - 300);

  return (
    <>
      <div className="fixed inset-0 z-[80]" onClick={onClose} />
      <motion.div
        ref={menuRef}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={scaleIn}
        transition={spring.snappy}
        className="fixed z-[90] bg-[var(--bg-elevated)] rounded-2xl shadow-2xl border border-[var(--border-default)] py-1.5 min-w-[200px] overflow-hidden backdrop-blur-xl"
        style={{ left: adjustedX, top: adjustedY }}
      >
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => {
              action.onClick();
              onClose();
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors group",
              action.variant === "danger"
                ? "text-[var(--danger)] hover:bg-[var(--danger-light)]"
                : "text-[var(--fg)] hover:bg-[var(--surface-hover)]"
            )}
          >
            {action.icon && (
              <span className={action.variant === "danger" ? "text-[var(--danger)]" : "text-[var(--fg-secondary)]"}>
                {action.icon}
              </span>
            )}
            <span className="font-medium flex-1 text-left">{action.label}</span>
            {action.shortcut && (
              <span className={cn(
                "text-[10px] font-mono font-bold opacity-0 group-hover:opacity-60 transition-opacity",
                action.variant === "danger" ? "text-[var(--danger)]" : "text-[var(--fg-muted)]"
              )}>
                {action.shortcut}
              </span>
            )}
          </button>
        ))}
      </motion.div>
    </>
  );
}

export function useMessageContextMenu() {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    messageId: string;
  } | null>(null);

  const showContextMenu = (e: React.MouseEvent, messageId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, messageId });
  };

  const hideContextMenu = () => setContextMenu(null);

  return { contextMenu, showContextMenu, hideContextMenu };
}

export const messageContextActions = (
  messageId: string,
  isOwner: boolean,
  handlers: {
    onReply: () => void;
    onForward: () => void;
    onCopy: () => void;
    onEdit?: () => void;
    onDelete: () => void;
    onPin: () => void;
    onStar: () => void;
  }
) => [
  { label: "Reply", icon: <span className="w-4 h-4 flex items-center justify-center">↩</span>, onClick: handlers.onReply, shortcut: "R" },
  { label: "Forward", icon: <span className="w-4 h-4 flex items-center justify-center">↪</span>, onClick: handlers.onForward, shortcut: "F" },
  { label: "Copy", icon: <span className="w-4 h-4 flex items-center justify-center">⎘</span>, onClick: handlers.onCopy, shortcut: "C" },
  ...(isOwner ? [
    { label: "Edit", icon: <span className="w-4 h-4 flex items-center justify-center">✎</span>, onClick: handlers.onEdit || (() => {}), shortcut: "E" },
    { label: "Delete", icon: <span className="w-4 h-4 flex items-center justify-center">⌫</span>, onClick: handlers.onDelete, variant: "danger" as const, shortcut: "Del" },
  ] : []),
  { label: "Pin", icon: <span className="w-4 h-4 flex items-center justify-center">📌</span>, onClick: handlers.onPin, shortcut: "P" },
  { label: "Star", icon: <span className="w-4 h-4 flex items-center justify-center">⭐</span>, onClick: handlers.onStar, shortcut: "S" },
];
