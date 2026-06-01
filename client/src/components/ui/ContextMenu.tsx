"use client";

import { useState, useRef, useEffect } from "react";
import { X, Copy, Reply, Forward, Smile, MoreVertical, Trash2, Edit, Pin, Star } from "lucide-react";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  actions: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: "default" | "danger";
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

  // Adjust position to stay within viewport
  const adjustedX = Math.min(x, window.innerWidth - 200);
  const adjustedY = Math.min(y, window.innerHeight - 300);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[180px] animate-in fade-in zoom-in-95 duration-100"
      style={{ left: adjustedX, top: adjustedY }}
    >
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => {
            action.onClick();
            onClose();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
            action.variant === "danger"
              ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          {action.icon}
          {action.label}
        </button>
      ))}
    </div>
  );
}

// Message context menu for chat
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

// Example usage actions for message
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
  { label: "Reply", icon: <Reply className="w-4 h-4" />, onClick: handlers.onReply },
  { label: "Forward", icon: <Forward className="w-4 h-4" />, onClick: handlers.onForward },
  { label: "Copy", icon: <Copy className="w-4 h-4" />, onClick: handlers.onCopy },
  ...(isOwner ? [
    { label: "Edit", icon: <Edit className="w-4 h-4" />, onClick: handlers.onEdit || (() => {}) },
    { label: "Delete", icon: <Trash2 className="w-4 h-4" />, onClick: handlers.onDelete, variant: "danger" as const },
  ] : []),
  { label: "Pin", icon: <Pin className="w-4 h-4" />, onClick: handlers.onPin },
  { label: "Star", icon: <Star className="w-4 h-4" />, onClick: handlers.onStar },
];