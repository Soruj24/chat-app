"use client";

import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MessageReplyPreviewProps {
  replyTo: NonNullable<Message["replyTo"]>;
  isMe: boolean;
  themeColor?: string;
}

export function MessageReplyPreview({ replyTo, isMe, themeColor }: MessageReplyPreviewProps) {
  const accent = themeColor || (isMe ? "#10a37f" : "#3b82f6");

  return (
    <div
      className={cn(
        "mx-2.5 mt-2 pl-2.5 py-1.5 pr-3 rounded-lg border-l-[3px] text-xs backdrop-blur-sm",
        isMe
          ? "bg-white/10 border-l-white/40"
          : "bg-gray-50 dark:bg-gray-800/50 border-l-gray-300 dark:border-l-gray-600"
      )}
      style={{ borderLeftColor: accent }}
    >
      <p
        className="font-semibold text-[11px] mb-0.5"
        style={{ color: isMe ? "rgba(255,255,255,0.9)" : accent }}
      >
        {replyTo.senderName}
      </p>
      <p className={cn(
        "truncate text-[11px] leading-snug",
        isMe ? "text-white/60" : "text-gray-400 dark:text-gray-500"
      )}>
        {replyTo.text || "Media"}
      </p>
    </div>
  );
}
