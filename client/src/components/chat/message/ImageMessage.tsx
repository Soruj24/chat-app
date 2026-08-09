"use client";

import { Download, Star, Pin, Maximize2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Message } from "@/lib/types";
import { MessageStatus } from "./MessageStatus";
import { cn } from "@/lib/utils";
import { SkeletonImage } from "@/components/skeletons";

interface ImageMessageProps {
  message: Message;
  isMe: boolean;
  onImageClick?: (url: string) => void;
}

export function ImageMessage({ message, isMe, onImageClick }: ImageMessageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const url = message.mediaUrl || "";

  return (
    <div
      className={cn(
        "relative group/image overflow-hidden",
        isMe ? "rounded-2xl rounded-tr-md" : "rounded-2xl rounded-tl-md"
      )}
    >
      {/* Loading shimmer */}
      {isLoading && (
        <SkeletonImage
          className="absolute inset-0 min-h-[200px]"
          showOverlay
        />
      )}

      <div className={cn("relative overflow-hidden", isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-300")}>
        <Image
          src={url}
          alt="Shared image"
          width={400}
          height={300}
          unoptimized
          className="w-full h-auto max-h-[400px] object-cover cursor-pointer transition-transform duration-500 group-hover/image:scale-[1.02]"
          onClick={() => onImageClick?.(url)}
          onLoadingComplete={() => setIsLoading(false)}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />

        {/* Expand button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onImageClick?.(url);
          }}
          className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md text-white rounded-xl opacity-0 group-hover/image:opacity-100 transition-all duration-200 hover:bg-black/60"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Download button */}
        <a
          href={url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 p-2 bg-black/40 backdrop-blur-md text-white rounded-xl opacity-0 group-hover/image:opacity-100 transition-all duration-200 hover:bg-black/60 translate-y-2 group-hover/image:translate-y-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Download className="w-4 h-4" />
        </a>

        {/* Bottom info bar */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-2 pt-8 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-200">
          <div className="flex items-center justify-end gap-1.5">
            {message.isStarred && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
            {message.isPinned && <Pin className="w-3 h-3 text-white/80" />}
            <span className="text-[10px] font-medium text-white/90">{message.timestamp}</span>
            {isMe && (
              <MessageStatus status={message.status || "sent"} className="text-white/80" size={12} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
