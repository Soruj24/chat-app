"use client";

import { Play, Pause } from "lucide-react";
import { useState, useRef } from "react";
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
      if (total > 0) {
        setProgress((current / total) * 100);
      }
      const mins = Math.floor(current / 60);
      const secs = Math.floor(current % 60);
      setCurrentTime(`${mins}:${secs.toString().padStart(2, "0")}`);
    }
  };

  const onEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime("0:00");
  };

  const accentColor = isMe
    ? "rgba(255,255,255,0.9)"
    : themeColor || "#3b82f6";

  const waveformColor = isMe ? "rgba(255,255,255,0.4)" : themeColor || "#3b82f6";
  const waveformActiveColor = isMe ? "rgba(255,255,255,0.9)" : themeColor || "#3b82f6";

  return (
    <div className="py-2.5 px-3 flex items-center gap-3 min-w-[260px]">
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
          "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 shrink-0 shadow-md",
          isMe ? "bg-white/20 hover:bg-white/30 text-white" : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        )}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" style={{ color: isMe ? "white" : accentColor }} />
        )}
      </button>

      <div className="flex-1 flex flex-col gap-1.5">
        {/* Waveform */}
        <div className="h-8 flex items-center gap-px">
          {loading ? (
            <div className="flex items-center gap-px opacity-30">
              {Array.from({ length: BARS_COUNT }).map((_, i) => (
                <div
                  key={i}
                  className={cn("w-[3px] rounded-full animate-pulse", isMe ? "bg-white/30" : "bg-gray-300 dark:bg-gray-600")}
                  style={{ height: `${4 + (i * 17) % 24}px` }}
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
                  className="w-[3px] rounded-full transition-colors duration-100"
                  style={{
                    height: `${Math.max(4, peak * 28)}px`,
                    backgroundColor: isPlayed ? waveformActiveColor : waveformColor,
                    opacity: isPlayed ? 1 : 0.35,
                  }}
                />
              );
            })
          )}
        </div>

        {/* Time */}
        <div className="flex justify-between items-center">
          <span
            className="text-[10px] font-medium tabular-nums"
            style={{ color: isMe ? "rgba(255,255,255,0.6)" : undefined }}
          >
            {isPlaying ? currentTime : duration}
          </span>
        </div>
      </div>
    </div>
  );
}
