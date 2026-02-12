"use client";

import { Loader2 } from "lucide-react";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { DateSeparator } from "@/components/chat/DateSeparator";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { cn } from "@/lib/utils";
import { RefObject } from "react";
import { Message } from "@/lib/types";

interface MessageListProps {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  onScroll: () => void;
  chatWallpaper?: string;
  isPaginationLoading: boolean;
  isLoading: boolean;
  localMessages: Message[];
  groupedMessages: { [key: string]: Message[] };
  messageRefs: RefObject<{ [key: string]: HTMLDivElement | null }>;
  highlightedMessageId: string | null;
  starredMessageIds: Set<string>;
  pinnedMessages: Message[];
  searchQuery: string;
  chatType: string;
  chatId: string;
  onImageClick: (url: string) => void;
  onReply: (message: Message) => void;
  onForward: (message: Message) => void;
  onLike: (message: Message) => void;
  onReaction: (message: Message, emoji: string) => void;
  onContextMenu: (e: React.MouseEvent, message: Message) => void;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  isTyping?: boolean;
  typingUser?: string;
}

export function MessageList({
  scrollContainerRef,
  onScroll,
  chatWallpaper,
  isPaginationLoading,
  isLoading,
  localMessages,
  groupedMessages,
  messageRefs,
  highlightedMessageId,
  starredMessageIds,
  pinnedMessages,
  searchQuery,
  chatType,
  chatId,
  onImageClick,
  onReply,
  onForward,
  onLike,
  onReaction,
  onContextMenu,
  messagesEndRef,
  isTyping,
  typingUser,
}: MessageListProps) {
  return (
    <div
      ref={scrollContainerRef}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-repeat opacity-95 dark:opacity-40"
      style={{
        backgroundImage: chatWallpaper
          ? `url('${chatWallpaper}')`
          : "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
        backgroundSize: chatWallpaper ? "cover" : "auto",
      }}
    >
      <div className="max-w-4xl mx-auto min-h-full flex flex-col">
        {isPaginationLoading && (
          <div className="flex justify-center py-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          </div>
        )}

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
            <p className="text-sm animate-pulse">Loading messages...</p>
          </div>
        ) : localMessages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-400 opacity-60">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-1 text-gray-600 dark:text-gray-300">
              No messages yet
            </h3>
            <p className="text-sm">Send a message to start the conversation</p>
          </div>
        ) : (
          <>
            {Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date}>
                <DateSeparator date={date} />
                {msgs.map((msg) => (
                  <div
                    key={msg.id}
                    ref={(el) => {
                      if (messageRefs.current) {
                        messageRefs.current[msg.id] = el;
                      }
                    }}
                    className={cn(
                      "transition-all duration-500 rounded-xl",
                      highlightedMessageId === msg.id &&
                        "bg-blue-500/10 ring-2 ring-blue-500/20",
                    )}
                  >
                    <MessageBubble
                      message={{
                        ...msg,
                        isStarred: starredMessageIds.has(msg.id),
                        isPinned: !!pinnedMessages.find(
                          (pm) => pm.id === msg.id,
                        ),
                      }}
                      onImageClick={onImageClick}
                      onReply={onReply}
                      onForward={onForward}
                      onLike={onLike}
                      onReaction={onReaction}
                      showSenderName={chatType === "group"}
                      highlight={searchQuery}
                      onContextMenu={(e, message) => onContextMenu(e, message)}
                    />
                  </div>
                ))}
              </div>
            ))}

            {isTyping && (
              <div className="mt-2">
                <TypingIndicator userName={typingUser || "Someone"} />
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  );
}
