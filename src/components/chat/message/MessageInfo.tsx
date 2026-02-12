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
        "px-3 pb-1.5 flex justify-end items-center gap-1.5",
        isMe ? "text-blue-100/80" : "text-gray-500"
      )}
    >
      {message.isStarred && <Star className="w-2.5 h-2.5 fill-current text-yellow-400 opacity-90" />}
      <span className={cn(
        "text-[10px] tabular-nums",
        isMe ? "text-blue-100/70" : "text-gray-400"
      )}>
        {message.timestamp}
      </span>
      {message.isPinned && (
        <Pin className={cn("w-2.5 h-2.5", isMe ? "text-blue-100" : "text-blue-500")} />
      )}
      {isMe && <MessageStatus status={message.status || 'sent'} />}
    </div>
  );
}
