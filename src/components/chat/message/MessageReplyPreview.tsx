"use client";

import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MessageReplyPreviewProps {
  replyTo: NonNullable<Message["replyTo"]>;
  isMe: boolean;
}

export function MessageReplyPreview({ replyTo, isMe }: MessageReplyPreviewProps) {
  return (
    <div className={cn(
      "mx-2 mt-2 p-2 rounded-lg border-l-4 text-xs bg-black/5 dark:bg-white/5",
      isMe ? "border-blue-200" : "border-blue-500"
    )}>
      <p className="font-bold mb-0.5">{replyTo.senderName}</p>
      <p className="opacity-70 truncate">{replyTo.text}</p>
    </div>
  );
}
