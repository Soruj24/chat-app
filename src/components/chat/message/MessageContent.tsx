"use client";

import { Message } from "@/lib/types";
import { ImageMessage } from "./ImageMessage";
import { VoiceMessage } from "./VoiceMessage";
import { FileIcon } from "lucide-react";
import React from "react";
import { FormattedText } from "./FormattedText";

interface MessageContentProps {
  message: Message;
  isMe: boolean;
  highlight?: string;
  onImageClick?: (url: string) => void;
}

export function MessageContent({ message, isMe, highlight, onImageClick }: MessageContentProps) {
  return (
    <>
      {/* Media Content */}
      {message.type === "image" && message.mediaUrl && (
        <ImageMessage 
          url={message.mediaUrl} 
          onClick={() => onImageClick?.(message.mediaUrl!)} 
        />
      )}

      {message.type === "file" && (
        <div className="p-3 flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <FileIcon className="w-8 h-8" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{message.fileName}</p>
            <p className="text-[10px] opacity-70 uppercase">{message.fileSize}</p>
          </div>
        </div>
      )}

      {message.type === "voice" && (
        <VoiceMessage 
          duration={message.duration || "0:00"} 
          messageId={message.id} 
          isMe={isMe} 
        />
      )}

      {/* Text Content */}
      {message.text && (
        <div className="p-3 pb-1">
          <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
            <FormattedText text={message.text} query={highlight} />
          </p>
        </div>
      )}
    </>
  );
}
