"use client";

import { Play, Pause } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface VoiceMessageProps {
  duration: string;
  messageId: string;
  isMe: boolean;
}

export function VoiceMessage({ duration, messageId, isMe }: VoiceMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="p-3 flex items-center gap-3 min-w-[200px]">
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90",
          isMe ? "bg-white/20 hover:bg-white/30" : "bg-blue-500 hover:bg-blue-600 text-white"
        )}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 fill-current" />
        ) : (
          <Play className="w-5 h-5 fill-current ml-0.5" />
        )}
      </button>
      
      <div className="flex-1 h-8 flex items-center gap-0.5">
        {[...Array(24)].map((_, i) => {
          const seed = (messageId.charCodeAt(0) || 0) + i;
          const height = ((seed * 1337) % 100);
          return (
            <div
              key={i}
              className={cn(
                "w-1 rounded-full transition-all duration-300",
                isPlaying ? "animate-pulse" : "opacity-40",
                isMe ? "bg-white" : "bg-blue-500"
              )}
              style={{ 
                height: `${Math.max(20, height)}%`,
                animationDelay: `${i * 0.05}s`
              }}
            />
          );
        })}
      </div>
      
      <span className={cn(
        "text-[10px] font-medium min-w-[30px]",
        isMe ? "text-blue-100" : "text-gray-500"
      )}>
        {duration}
      </span>
    </div>
  );
}
