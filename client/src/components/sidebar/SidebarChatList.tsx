"use client";

import { ChatListItem } from "../chat/ChatListItem";
import { ChatListSkeleton } from "./ChatListSkeleton";
import { Archive } from "lucide-react";
import { IChat } from "@/lib/types";
import { motion } from "framer-motion";
import { EmptyState, noChats, noArchivedChats } from "@/components/empty-states";

interface SidebarChatListProps {
  pinnedChats: IChat[];
  otherChats: IChat[];
  activeId?: string | null;
  loading?: boolean;
  filter: string;
  onPin: (id: string) => void;
  onMute: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SidebarChatList({
  pinnedChats,
  otherChats,
  activeId,
  loading = false,
  filter,
  onPin,
  onMute,
  onArchive,
  onDelete,
}: SidebarChatListProps) {
  const hasChats = pinnedChats.length > 0 || otherChats.length > 0;

  if (loading) {
    return <ChatListSkeleton />;
  }

  if (!hasChats) {
    const preset = filter === "archived" ? noArchivedChats() : noChats();
    return (
      <EmptyState
        illustration={preset.illustration}
        title={preset.title}
        description={preset.description}
        primaryAction={preset.primaryAction}
        secondaryAction={preset.secondaryAction}
        compact
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-1">
      {/* Pinned Section */}
      {pinnedChats.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-1"
        >
          <div className="px-3 py-2 flex items-center gap-2">
            <Pin className="w-3 h-3 text-[var(--sidebar-text-muted)] rotate-45" />
            <span className="text-[10px] font-bold text-[var(--sidebar-text-muted)] uppercase tracking-widest">
              Pinned
            </span>
            <span className="text-[10px] font-medium text-[var(--sidebar-text-muted)]/60">
              {pinnedChats.length}
            </span>
          </div>
          {pinnedChats.map((chat, index) => (
            <motion.div
              key={`pinned-${chat.id}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <ChatListItem
                chat={chat}
                isActive={activeId === chat.id}
                onPin={onPin}
                onMute={onMute}
                onArchive={onArchive}
                onDelete={onDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Recent/All Section */}
      {otherChats.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-1"
        >
          {pinnedChats.length > 0 && (
            <div className="px-3 py-2 flex items-center gap-2">
              <span className="text-[10px] font-bold text-[var(--sidebar-text-muted)] uppercase tracking-widest">
                {filter === "archived" ? "Archived" : "Recent"}
              </span>
              <span className="text-[10px] font-medium text-[var(--sidebar-text-muted)]/60">
                {otherChats.length}
              </span>
            </div>
          )}
          {otherChats.map((chat, index) => (
            <motion.div
              key={`other-${chat.id}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <ChatListItem
                chat={chat}
                isActive={activeId === chat.id}
                onPin={onPin}
                onMute={onMute}
                onArchive={onArchive}
                onDelete={onDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function Pin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
    </svg>
  );
}
