"use client";

import { motion } from "framer-motion";
import { Pin, BellOff, Volume2, Archive, Trash2, Forward, Star } from "lucide-react";
import { IChat } from "@/lib/types";
import { RefObject } from "react";
import { cn } from "@/lib/utils";
import { spring, scaleIn } from "@/lib/animations";

interface ChatContextMenuProps {
  chat: IChat;
  menuRef: RefObject<HTMLDivElement | null>;
  menuPosition: { x: number; y: number };
  onPin?: (id: string) => void;
  onMute?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export function ChatContextMenu({
  chat,
  menuRef,
  menuPosition,
  onPin,
  onMute,
  onArchive,
  onDelete,
  onClose,
}: ChatContextMenuProps) {
  return (
    <motion.div
      ref={menuRef}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={scaleIn}
      transition={spring.snappy}
      className="fixed z-[100] w-56 bg-[var(--bg-elevated)] rounded-2xl shadow-2xl border border-[var(--border-default)] py-1.5 overflow-hidden backdrop-blur-xl"
      style={{
        left: Math.min(
          menuPosition.x,
          typeof window !== "undefined" ? window.innerWidth - 240 : menuPosition.x
        ),
        top: Math.min(
          menuPosition.y,
          typeof window !== "undefined" ? window.innerHeight - 280 : menuPosition.y
        ),
      }}
    >
      <MenuItem
        icon={<Pin className="w-4 h-4" />}
        label={chat.isPinned ? "Unpin Chat" : "Pin Chat"}
        shortcut="P"
        onClick={() => {
          onPin?.(chat.id);
          onClose();
        }}
      />
      <MenuItem
        icon={chat.isMuted ? <Volume2 className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
        label={chat.isMuted ? "Unmute" : "Mute Notifications"}
        shortcut="M"
        onClick={() => {
          onMute?.(chat.id);
          onClose();
        }}
      />
      <div className="h-px bg-[var(--border-light)] my-1 mx-3" />
      <MenuItem
        icon={<Archive className="w-4 h-4" />}
        label={chat.isArchived ? "Unarchive Chat" : "Archive Chat"}
        shortcut="E"
        onClick={() => {
          onArchive?.(chat.id);
          onClose();
        }}
      />
      <MenuItem
        icon={<Trash2 className="w-4 h-4" />}
        label="Delete Chat"
        danger
        shortcut="Del"
        onClick={() => {
          onDelete?.(chat.id);
          onClose();
        }}
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
        "w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors group",
        danger
          ? "text-[var(--danger)] hover:bg-[var(--danger-light)]"
          : "text-[var(--fg)] hover:bg-[var(--surface-hover)]"
      )}
    >
      <span className={danger ? "text-[var(--danger)]" : "text-[var(--fg-secondary)]"}>
        {icon}
      </span>
      <span className="font-medium flex-1 text-left">{label}</span>
      {shortcut && (
        <span className={cn(
          "text-[10px] font-mono font-bold opacity-0 group-hover:opacity-60 transition-opacity",
          danger ? "text-[var(--danger)]" : "text-[var(--fg-muted)]"
        )}>
          {shortcut}
        </span>
      )}
    </button>
  );
}
