"use client";

import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Star, Pin } from "lucide-react";
import { MessageStatus } from "./MessageStatus";

interface MessageInfoProps {
  message: Message;
  isMe: boolean;
}

export function MessageInfo({ message, isMe }: MessageInfoProps) {
  return (
    <div
      className={cn(
        "px-3 pb-1.5 flex justify-end items-center gap-1 leading-none select-none",
        isMe ? "text-white/50" : "text-gray-400 dark:text-gray-500"
      )}
    >
      <div className="flex items-center gap-0.5">
        {message.isStarred && (
          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
        )}
        {message.isPinned && (
          <Pin className="w-2.5 h-2.5" />
        )}
      </div>
      <span className="text-[10px] tabular-nums font-medium">{message.timestamp}</span>
      {isMe && <MessageStatus status={message.status || "sent"} size={12} />}
    </div>
  );
}
