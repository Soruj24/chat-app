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
        "px-2 pb-0.5 flex justify-end items-center gap-1 leading-none select-none",
        isMe ? "text-[#c4e9c2]" : "text-[#8e8e93]"
      )}
    >
      <div className="flex items-center gap-0.5">
        {message.isStarred && (
          <Star className="w-2.5 h-2.5" fill="#ffab00" stroke="none" />
        )}
        {message.isPinned && (
          <Pin className={cn("w-2.5 h-2.5", isMe ? "text-[#c4e9c2]" : "text-[#28a8e8]")} />
        )}
      </div>
      <span className="text-[10px] tabular-nums">
        {message.timestamp}
      </span>
      {isMe && (
        <MessageStatus status={message.status || 'sent'} size={10} />
      )}
    </div>
  );
}
