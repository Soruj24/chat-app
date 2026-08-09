"use client";

import { ChatListItem } from "../chat/ChatListItem";
import { UserSearchResult } from "./UserSearchResult";
import { MessageSearchResult } from "./MessageSearchResult";
import { SearchEmptyState } from "./SearchEmptyState";
import { IChat, Message, User } from "@/lib/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";

interface SidebarSearchResultsProps {
  results: {
    chats: IChat[];
    messages: { chatId: string; message: Message }[];
    users: User[];
  };
  activeId?: string | null;
}

export function SidebarSearchResults({ results, activeId }: SidebarSearchResultsProps) {
  const { chats } = useSelector((state: RootState) => state.chat);
  const hasResults = results.chats.length > 0 || results.messages.length > 0 || results.users.length > 0;

  if (!hasResults) {
    return <SearchEmptyState />;
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-1">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Conversations */}
        {results.chats.length > 0 && (
          <div className="mb-2">
            <SectionHeader title="Conversations" count={results.chats.length} />
            {results.chats.map((chat) => (
              <ChatListItem key={chat.id} chat={chat} isActive={activeId === chat.id} />
            ))}
          </div>
        )}

        {/* Global Users */}
        {results.users.length > 0 && (
          <div className="mb-2">
            <SectionHeader title="People" count={results.users.length} />
            {results.users.map((user) => (
              <UserSearchResult key={user.id} user={user} />
            ))}
          </div>
        )}

        {/* Global Messages */}
        {results.messages.length > 0 && (
          <div className="mb-2">
            <SectionHeader title="Messages" count={results.messages.length} />
            {results.messages.map(({ chatId, message }, idx) => (
              <MessageSearchResult
                key={`${chatId}-${message.id || idx}-${idx}`}
                chatId={chatId}
                message={message}
                chatName={chats.find((c) => c.id === chatId)?.name}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="px-3 py-2 flex items-center gap-2">
      <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">
        {title}
      </span>
      <span className="text-[10px] font-medium text-[var(--sidebar-text-muted)]/60">
        {count}
      </span>
    </div>
  );
}
