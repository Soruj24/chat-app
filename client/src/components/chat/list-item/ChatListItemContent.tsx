"use client";

import { IChat } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ChatListItemContentProps {
  chat: IChat;
}

export function ChatListItemContent({ chat }: ChatListItemContentProps) {
  const lastMessage = chat.lastMessage;
  const hasUnread = chat.unreadCount > 0;
  const isTyping = chat.isTyping;

  const getPreviewText = () => {
    if (isTyping) return "typing...";
    if (!lastMessage) return "No messages yet";

    const prefix = lastMessage.senderId === "me" ? "You: " : "";

    switch (lastMessage.type) {
      case "image":
        return `${prefix}📷 Photo`;
      case "video":
        return `${prefix}🎥 Video`;
      case "voice":
        return `${prefix}🎤 Voice message`;
      case "file":
        return `${prefix}📎 File`;
      case "location":
        return `${prefix}📍 Location`;
      case "contact":
        return `${prefix}👤 Contact`;
      default:
        return `${prefix}${lastMessage.text || "No messages"}`;
    }
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <h3
          className={cn(
            "text-sm truncate leading-tight",
            hasUnread
              ? "font-bold text-[var(--sidebar-text)]"
              : "font-medium text-[var(--sidebar-text)]/80"
          )}
        >
          {chat.name}
        </h3>
        {lastMessage?.timestamp && (
          <span
            className={cn(
              "text-[10px] shrink-0 tabular-nums",
              hasUnread
                ? "font-bold text-[var(--color-primary)]"
                : "text-[var(--sidebar-text-muted)]"
            )}
          >
            {lastMessage.timestamp}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 mt-0.5">
        <p
          className={cn(
            "text-xs truncate leading-snug",
            hasUnread
              ? "font-semibold text-[var(--sidebar-text-secondary)]"
              : "text-[var(--sidebar-text-secondary)]/70",
            isTyping && "text-[var(--color-primary)] italic"
          )}
        >
          {getPreviewText()}
        </p>
        <div className="flex items-center gap-1.5 shrink-0">
          {chat.isMuted && (
            <span className="text-[10px] text-[var(--sidebar-text-muted)]">🔇</span>
          )}
          {hasUnread && (
            <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-[var(--sidebar-unread-badge)] text-white text-[10px] font-bold rounded-full badge-pulse">
              {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
