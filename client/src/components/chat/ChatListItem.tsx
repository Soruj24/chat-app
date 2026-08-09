"use client";

import { IChat } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChatAvatar } from "../chat/list-item/ChatAvatar";
import { ChatListItemContent } from "../chat/list-item/ChatListItemContent";
import { ChatContextMenu } from "../chat/list-item/ChatContextMenu";
import { useChatListItemActions } from "@/hooks/useChatListItemActions";
import { Pin, Volume2 } from "lucide-react";

interface ChatListItemProps {
  chat: IChat;
  isActive: boolean;
  onPin?: (id: string) => void;
  onMute?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ChatListItem({
  chat,
  isActive,
  onPin,
  onMute,
  onArchive,
  onDelete,
}: ChatListItemProps) {
  const {
    showContextMenu,
    setShowContextMenu,
    menuPosition,
    menuRef,
    handleContextMenu,
  } = useChatListItemActions(chat.id, onPin, onArchive);

  return (
    <div
      className="relative group px-2 py-0.5"
      onContextMenu={handleContextMenu}
    >
      <motion.div
        className={cn(
          "relative flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-xl)] cursor-pointer select-none transition-all duration-200",
          isActive
            ? "bg-[var(--sidebar-active-bg)] shadow-[var(--shadow-xs)]"
            : "hover:bg-[var(--sidebar-hover)] hover:shadow-[var(--shadow-xs)]"
        )}
        whileHover={{ x: 1 }}
        transition={{ duration: 0.15 }}
      >
        {/* Link */}
        {chat.id && <Link href={`/chat/${chat.id}`} className="absolute inset-0 z-20 rounded-[var(--radius-xl)]" />}

        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="active-chat-indicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 rounded-r-full bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)]"
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          />
        )}

        {/* Avatar */}
        <ChatAvatar avatar={chat.avatar} name={chat.name} status={chat.status} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <ChatListItemContent chat={chat} />
        </div>

        {/* Status indicators */}
        <div className="flex items-center gap-1 shrink-0">
          {chat.isPinned && (
            <Pin className="w-3 h-3 text-[var(--sidebar-text-muted)] rotate-45" />
          )}
          {chat.isMuted && (
            <Volume2 className="w-3 h-3 text-[var(--sidebar-text-muted)]" />
          )}
        </div>
      </motion.div>

      {/* Context menu */}
      <AnimatePresence>
        {showContextMenu && (
          <ChatContextMenu
            chat={chat}
            menuRef={menuRef}
            menuPosition={menuPosition}
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
