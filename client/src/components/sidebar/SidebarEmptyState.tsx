"use client";

import { MessageSquare, Archive, Search } from "lucide-react";

interface SidebarEmptyStateProps {
  filter: string;
}

export function SidebarEmptyState({ filter }: SidebarEmptyStateProps) {
  const configs: Record<string, { icon: React.ReactNode; title: string; description: string }> = {
    all: {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "No conversations yet",
      description: "Start a new conversation to begin messaging.",
    },
    unread: {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "No unread messages",
      description: "You're all caught up!",
    },
    groups: {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "No group chats",
      description: "Create a group to chat with multiple people.",
    },
    archived: {
      icon: <Archive className="w-8 h-8" />,
      title: "No archived chats",
      description: "Archived conversations will appear here.",
    },
    search: {
      icon: <Search className="w-8 h-8" />,
      title: "No results found",
      description: "Try a different search term.",
    },
  };

  const config = configs[filter] || configs.all;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] mb-4">
        {config.icon}
      </div>
      <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">
        {config.title}
      </h3>
      <p className="text-sm text-[var(--muted-foreground)] max-w-[200px]">
        {config.description}
      </p>
    </div>
  );
}
