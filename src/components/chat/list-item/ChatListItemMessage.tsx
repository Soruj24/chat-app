"use client";

import { cn } from "@/lib/utils";
import { MessageStatus } from "../message/MessageStatus";
import { Chat } from "@/lib/types";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface ChatListItemMessageProps {
  chat: Chat;
}

export function ChatListItemMessage({ chat }: ChatListItemMessageProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const isMe = chat.lastMessage?.senderId === user?.id || chat.lastMessage?.senderId === "me";
  const hasUnread = chat.unreadCount > 0;

  return (
    <div className="flex items-center gap-1 min-w-0 flex-1">
      {isMe && chat.lastMessage?.status && (
        <MessageStatus
          status={chat.lastMessage.status}
          className="flex-shrink-0 scale-90"
        />
      )}
      <p
        className={cn(
          "text-[13px] truncate flex-1 leading-tight",
          hasUnread
            ? "text-gray-950 dark:text-gray-50 font-semibold"
            : "text-gray-500 dark:text-gray-400",
        )}
      >
        {chat.status === "typing" ? (
          <span className="text-blue-600 italic font-medium">
            typing...
          </span>
        ) : (
          <>
            {chat.lastMessage?.type === "image" && (
              <span className="flex items-center gap-1 text-blue-500">
                📷 Photo
              </span>
            )}
            {chat.lastMessage?.type === "voice" && (
              <span className="flex items-center gap-1 text-blue-500">
                🎤 Voice message
              </span>
            )}
            {chat.lastMessage?.type === "file" && (
              <span className="flex items-center gap-1 text-blue-500">
                📄 File
              </span>
            )}
            {(!chat.lastMessage?.type ||
              chat.lastMessage?.type === "text") &&
              chat.lastMessage?.text}
          </>
        )}
      </p>
    </div>
  );
}
