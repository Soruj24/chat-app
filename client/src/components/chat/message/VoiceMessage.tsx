"use client";

import { Play, Pause, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAudioWaveform } from "@/hooks/useAudioWaveform";

interface VoiceMessageProps {
  url?: string;
  duration: string;
  messageId: string;
  isMe: boolean;
  themeColor?: string;
}

export function VoiceMessage({ url, duration, messageId, isMe, themeColor }: VoiceMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const BARS_COUNT = 32;
  const { waveform, loading } = useAudioWaveform(url, BARS_COUNT);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setProgress((current / total) * 100);
      
      const mins = Math.floor(current / 60);
      const secs = Math.floor(current % 60);
      setCurrentTime(`${mins}:${secs.toString().padStart(2, '0')}`);
    }
  };

  const onEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime("0:00");
  };

  return (
    <div className="py-2 px-3 flex items-center gap-3 min-w-[260px]">
      {url && (
        <audio 
          ref={audioRef} 
          src={url} 
          onTimeUpdate={onTimeUpdate} 
          onEnded={onEnded}
          className="hidden" 
        />
      )}
      
      <button 
        onClick={togglePlay}
        disabled={!url}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 shrink-0",
          isMe ? "bg-white/30 hover:bg-white/40" : "bg-[#28a8e8] hover:bg-[#1a99e0] text-white"
        )}
        style={!isMe && themeColor ? { backgroundColor: themeColor } : {}}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </button>
      
      <div className="flex-1 flex flex-col gap-1">
        <div className="h-8 flex items-center gap-px relative">
          {loading ? (
            <div className="flex items-center gap-px opacity-30">
              {[...Array(BARS_COUNT)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1 rounded-full bg-current animate-pulse",
                    isMe ? "text-white" : "text-[#28a8e8]"
                  )}
                  style={{ height: `${4 + (i * 17 % 24)}px` }}
                />
              ))}
            </div>
          ) : (
            waveform.map((peak, i) => {
              const barProgress = (i / BARS_COUNT) * 100;
              const isPlayed = progress > barProgress;

              return (
                <div
                  key={i}
                  className={cn(
                    "w-[3px] rounded-full transition-all duration-150",
                    isMe ? "bg-white" : "bg-[#28a8e8]",
                    !isPlayed && "opacity-35"
                  )}
                  style={{ 
                    height: `${Math.max(4, peak * 28)}px`,
                    ...(!isMe && themeColor ? { backgroundColor: themeColor } : {})
                  }}
                />
              );
            })
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className={cn(
            "text-[10px] font-medium tabular-nums",
            isMe ? "text-[#c4e9c2]" : "text-[#8e8e93]"
          )}>
            {isPlaying ? currentTime : duration}
          </span>
        </div>
      </div>
    </div>
  );
}
