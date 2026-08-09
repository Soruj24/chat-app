"use client";

import { Download, Play, Pause } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface VideoMessageProps {
  url: string;
  isMe: boolean;
}

export function VideoMessage({ url, isMe }: VideoMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={cn(
      "relative group/video overflow-hidden",
      isMe ? "rounded-2xl rounded-tr-md" : "rounded-2xl rounded-tl-md"
    )}>
      <video
        ref={videoRef}
        src={url}
        className="w-full max-h-[350px] object-cover cursor-pointer"
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />

      {/* Play/Pause overlay */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/video:bg-black/30 transition-colors"
        >
          <div className="w-14 h-14 rounded-full bg-white/90 dark:bg-gray-900/90 flex items-center justify-center shadow-xl backdrop-blur-sm transition-transform hover:scale-110 active:scale-95">
            <Play className="w-6 h-6 text-gray-900 dark:text-white ml-0.5" fill="currentColor" />
          </div>
        </button>
      )}

      {/* Download button */}
      <a
        href={url}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md text-white rounded-xl opacity-0 group-hover/video:opacity-100 transition-all duration-200 hover:bg-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        <Download className="w-4 h-4" />
      </a>
    </div>
  );
}
