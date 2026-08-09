"use client";

import { MessageBubble } from "@/components/chat/MessageBubble";
import { DateSeparator } from "@/components/chat/DateSeparator";
import { UnreadDivider } from "@/components/chat/message/UnreadDivider";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { MessageListSkeleton } from "./MessageListSkeleton";
import { cn } from "@/lib/utils";
import { RefObject, useMemo } from "react";
import { Message } from "@/lib/types";
import { motion } from "framer-motion";
import { EmptyState, noMessages } from "@/components/empty-states";
import { ProgressBar } from "@/components/loading";

interface MessageListProps {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  onScroll: () => void;
  chatWallpaper?: string;
  themeColor?: string;
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
  fontSize?: "small" | "medium" | "large";
  bubbleStyle?: "modern" | "classic" | "rounded";
  accentColor?: string;
}

export function MessageList({
  scrollContainerRef,
  onScroll,
  chatWallpaper,
  themeColor,
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
  fontSize = "medium",
  bubbleStyle = "modern",
  accentColor,
}: MessageListProps) {
  return (
    <div
      ref={scrollContainerRef}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto custom-scrollbar relative"
    >
      {/* Wallpaper overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: chatWallpaper
            ? `url('${chatWallpaper}')`
            : undefined,
          backgroundSize: "cover",
        }}
      />

      <div className="max-w-4xl mx-auto min-h-full flex flex-col relative z-10">
        {/* Pagination loading */}
        {isPaginationLoading && (
          <div className="px-8 py-3">
            <ProgressBar variant="indeterminate" size="sm" />
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading ? (
          <div className="py-4">
            <MessageListSkeleton groupAvatar={chatType === "group"} />
          </div>
        ) : localMessages.length === 0 ? (
          /* Empty state */
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              {...noMessages()}
              compact
            />
          </div>
        ) : (
          /* Message groups */
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              <DateSeparator date={date} />
              {msgs.map((msg, idx) => {
                const prevMsg = idx > 0 ? msgs[idx - 1] : null;
                const nextMsg = idx < msgs.length - 1 ? msgs[idx + 1] : null;

                // Grouping logic: determine if this message starts/ends a group
                const isGroupStart = !prevMsg || prevMsg.senderId !== msg.senderId || prevMsg.isMe !== msg.isMe;
                const isGroupEnd = !nextMsg || nextMsg.senderId !== msg.senderId || nextMsg.isMe !== msg.isMe;

                return (
                  <div
                    key={msg.id || `msg-${date}-${idx}`}
                    ref={(el) => {
                      if (messageRefs.current) {
                        messageRefs.current[msg.id] = el;
                      }
                    }}
                    className={cn(
                      "transition-all duration-300 rounded-xl",
                      highlightedMessageId === msg.id && "bg-blue-500/5 ring-1 ring-blue-500/20"
                    )}
                  >
                    <MessageBubble
                      message={{
                        ...msg,
                        isStarred: starredMessageIds.has(msg.id),
                        isPinned: !!pinnedMessages.find((pm) => pm.id === msg.id),
                      }}
                      isGroupStart={isGroupStart}
                      isGroupEnd={isGroupEnd}
                      onImageClick={onImageClick}
                      onReply={onReply}
                      onForward={onForward}
                      onLike={onLike}
                      onReaction={onReaction}
                      themeColor={themeColor}
                      showSenderName={chatType === "group"}
                      highlight={searchQuery}
                      onContextMenu={(e, message) => onContextMenu(e, message)}
                      fontSize={fontSize}
                      bubbleStyle={bubbleStyle}
                      accentColor={accentColor}
                    />
                  </div>
                );
              })}
            </div>
          ))
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="mt-1">
            <TypingIndicator userName={typingUser || "Someone"} themeColor={themeColor} />
          </div>
        )}

        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  );
}
