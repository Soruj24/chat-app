"use client";

import { motion } from "framer-motion";
import { IChat } from "@/lib/types";
import { useEffect, useRef } from "react";
import {
  Pin,
  BellOff,
  Volume2,
  Archive,
  Trash2,
  CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversationContextMenuProps {
  chat: IChat;
  position: { x: number; y: number };
  onPin?: (id: string) => void;
  onMute?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export function ConversationContextMenu({
  chat,
  position,
  onPin,
  onMute,
  onArchive,
  onDelete,
  onClose,
}: ConversationContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const x = Math.min(position.x, window.innerWidth - 220);
  const y = Math.min(position.y, window.innerHeight - 300);

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className="fixed z-[100] w-[200px] bg-[var(--popover)] border border-[var(--border-ds)] rounded-[var(--radius-ds)] shadow-[var(--shadow-lg)] p-1"
      style={{ left: x, top: y }}
    >
      <MenuItem
        icon={<CheckCheck className="w-4 h-4" />}
        label="Mark as read"
        onClick={() => { onClose(); }}
      />
      <MenuItem
        icon={<Pin className="w-4 h-4" />}
        label={chat.isPinned ? "Unpin" : "Pin"}
        shortcut="P"
        onClick={() => { onPin?.(chat.id); onClose(); }}
      />
      <MenuItem
        icon={chat.isMuted ? <Volume2 className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
        label={chat.isMuted ? "Unmute" : "Mute"}
        shortcut="M"
        onClick={() => { onMute?.(chat.id); onClose(); }}
      />
      <div className="h-px bg-[var(--border-ds)] my-1" />
      <MenuItem
        icon={<Archive className="w-4 h-4" />}
        label={chat.isArchived ? "Unarchive" : "Archive"}
        shortcut="E"
        onClick={() => { onArchive?.(chat.id); onClose(); }}
      />
      <MenuItem
        icon={<Trash2 className="w-4 h-4" />}
        label="Delete"
        danger
        shortcut="Del"
        onClick={() => { onDelete?.(chat.id); onClose(); }}
      />
    </motion.div>
  );
}

function MenuItem({
  icon,
  label,
  danger,
  shortcut,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  shortcut?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2.5 px-2.5 py-2 text-sm rounded-[var(--radius-ds)] transition-colors",
        danger
          ? "text-[var(--destructive)] hover:bg-[var(--destructive)]/10"
          : "text-[var(--foreground)] hover:bg-[var(--muted)]"
      )}
    >
      <span className={danger ? "text-[var(--destructive)]" : "text-[var(--muted-foreground)]"}>
        {icon}
      </span>
      <span className="flex-1 text-left font-medium">{label}</span>
      {shortcut && (
        <span className="text-[11px] font-mono text-[var(--muted-foreground)] opacity-60">
          {shortcut}
        </span>
      )}
    </button>
  );
}
