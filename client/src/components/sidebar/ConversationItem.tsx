"use client";

import { IChat } from "@/lib/types";
import { cn, getUserColor } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import { ConversationContextMenu } from "./ConversationContextMenu";
import { Pin, VolumeX, Check, CheckCheck } from "lucide-react";

interface ConversationItemProps {
  chat: IChat;
  isActive: boolean;
  onPin?: (id: string) => void;
  onMute?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ConversationItem({
  chat,
  isActive,
  onPin,
  onMute,
  onArchive,
  onDelete,
}: ConversationItemProps) {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const itemRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  }, []);

  const hasUnread = chat.unreadCount > 0;
  const isTyping = chat.isTyping;
  const lastMessage = chat.lastMessage;

  const getPreviewText = () => {
    if (isTyping) return "typing...";
    if (!lastMessage) return "No messages yet";
    const prefix = lastMessage.senderId === "me" ? "You: " : "";
    switch (lastMessage.type) {
      case "image": return `${prefix}Photo`;
      case "video": return `${prefix}Video`;
      case "voice": return `${prefix}Voice message`;
      case "file": return `${prefix}File`;
      case "location": return `${prefix}Location`;
      case "contact": return `${prefix}Contact`;
      default: return `${prefix}${lastMessage.text || ""}`;
    }
  };

  const getStatusIcon = () => {
    if (!lastMessage || lastMessage.senderId !== "me") return null;
    switch (lastMessage.status) {
      case "read": return <CheckCheck className="w-3.5 h-3.5 text-[var(--primary)]" />;
      case "delivered": return <CheckCheck className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />;
      case "sent": return <Check className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />;
      default: return null;
    }
  };

  return (
    <div ref={itemRef} className="relative group" onContextMenu={handleContextMenu}>
      <Link
        href={chat.id ? `/chat/${chat.id}` : "#"}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-ds)] transition-all duration-150 outline-none",
          "hover:bg-[var(--muted)] focus-visible:bg-[var(--muted)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1",
          isActive && "bg-[var(--primary)]/10 hover:bg-[var(--primary)]/15",
          !isActive && "hover:bg-[var(--muted)]"
        )}
      >
        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="active-conversation"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-[var(--primary)]"
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          />
        )}

        {/* Avatar */}
        <div className="relative w-10 h-10 shrink-0">
          {chat.avatar && chat.avatar.trim() ? (
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div
              className={cn(
                "w-full h-full rounded-full flex items-center justify-center text-white text-sm font-semibold",
                "bg-gradient-to-br",
                getUserColor(chat.name)
              )}
            >
              {chat.name.charAt(0).toUpperCase()}
            </div>
          )}
          {chat.status === "online" && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[var(--success)] rounded-full border-2 border-[var(--background)]" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3
              className={cn(
                "text-sm truncate",
                hasUnread ? "font-semibold text-[var(--foreground)]" : "font-medium text-[var(--foreground)]"
              )}
            >
              {chat.name}
            </h3>
            <div className="flex items-center gap-1.5 shrink-0">
              {lastMessage?.timestamp && (
                <span
                  className={cn(
                    "text-[11px] tabular-nums",
                    hasUnread ? "font-semibold text-[var(--primary)]" : "text-[var(--muted-foreground)]"
                  )}
                >
                  {lastMessage.timestamp}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              {getStatusIcon()}
              <p
                className={cn(
                  "text-[13px] truncate",
                  isTyping
                    ? "text-[var(--primary)] italic"
                    : hasUnread
                      ? "font-medium text-[var(--foreground)]"
                      : "text-[var(--muted-foreground)]"
                )}
              >
                {getPreviewText()}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {chat.isMuted && (
                <VolumeX className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
              )}
              {hasUnread && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] text-[11px] font-semibold rounded-full">
                  {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pin indicator */}
        {chat.isPinned && !hasUnread && (
          <Pin className="w-3 h-3 text-[var(--muted-foreground)] rotate-45 shrink-0" />
        )}
      </Link>

      {/* Context menu */}
      <AnimatePresence>
        {showContextMenu && (
          <ConversationContextMenu
            chat={chat}
            position={menuPosition}
            onPin={onPin}
            onMute={onMute}
            onArchive={onArchive}
            onDelete={onDelete}
            onClose={() => setShowContextMenu(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
