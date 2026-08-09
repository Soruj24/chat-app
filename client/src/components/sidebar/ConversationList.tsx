"use client";

import { IChat } from "@/lib/types";
import { ConversationItem } from "./ConversationItem";
import { Pin } from "lucide-react";

interface ConversationListProps {
  pinnedChats?: IChat[];
  otherChats?: IChat[];
  chats?: IChat[];
  activeId?: string | null;
  onPin: (id: string) => void;
  onMute: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  searchMode?: boolean;
}

export function ConversationList({
  pinnedChats = [],
  otherChats = [],
  chats,
  activeId,
  onPin,
  onMute,
  onArchive,
  onDelete,
  searchMode = false,
}: ConversationListProps) {
  if (searchMode) {
    return (
      <div className="flex-1 overflow-y-auto px-2 py-1">
        {chats?.map((chat) => (
          <ConversationItem
            key={chat.id}
            chat={chat}
            isActive={activeId === chat.id}
            onPin={onPin}
            onMute={onMute}
            onArchive={onArchive}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  const hasPinned = pinnedChats.length > 0;
  const hasRecent = otherChats.length > 0;

  return (
    <div className="flex-1 overflow-y-auto px-2 py-1">
      {/* Pinned Section */}
      {hasPinned && (
        <div className="mb-1">
          <div className="flex items-center gap-2 px-3 py-2">
            <Pin className="w-3 h-3 text-[var(--muted-foreground)] rotate-45" />
            <span className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
              Pinned
            </span>
          </div>
          {pinnedChats.map((chat) => (
            <ConversationItem
              key={chat.id}
              chat={chat}
              isActive={activeId === chat.id}
              onPin={onPin}
              onMute={onMute}
              onArchive={onArchive}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Recent Section */}
      {hasRecent && (
        <div className="mb-1">
          {hasPinned && (
            <div className="flex items-center gap-2 px-3 py-2">
              <span className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                Recent
              </span>
            </div>
          )}
          {otherChats.map((chat) => (
            <ConversationItem
              key={chat.id}
              chat={chat}
              isActive={activeId === chat.id}
              onPin={onPin}
              onMute={onMute}
              onArchive={onArchive}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
