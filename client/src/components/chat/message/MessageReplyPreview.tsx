"use client";

import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MessageReplyPreviewProps {
  replyTo: NonNullable<Message["replyTo"]>;
  isMe: boolean;
  themeColor?: string;
}

export function MessageReplyPreview({ replyTo, isMe, themeColor }: MessageReplyPreviewProps) {
  const accentColor = themeColor || (isMe ? '#34c759' : '#28a8e8');
  
  return (
    <div 
      className={cn(
        "mx-2 mt-1.5 pl-2 py-1.5 pr-3 rounded-lg border-l-2 text-xs",
        isMe 
          ? "bg-[#2b4a40]" 
          : "bg-[#18222d] dark:bg-[#242f3d]"
      )}
      style={{ borderLeftColor: accentColor }}
    >
      <div className="flex items-center gap-1.5">
        <div 
          className="w-0.5 h-3 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        <p 
          className="font-medium"
          style={{ color: isMe ? '#c4e9c2' : '#28a8e8' }}
        >
          {replyTo.senderName}
        </p>
      </div>
      <p className={cn(
        "mt-0.5 truncate",
        isMe ? "text-[#c4e9c2]/80" : "text-[#8e8e93]"
      )}>
        {replyTo.text || 'Media'}
      </p>
    </div>
  );
}
