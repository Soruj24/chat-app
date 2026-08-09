"use client";

import { X, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface VoiceRecorderProps {
  recordingTime: number;
  waveform: number[];
  onCancel: () => void;
  formatTime: (seconds: number) => string;
  themeColor?: string;
}

export function VoiceRecorder({ recordingTime, waveform, onCancel, formatTime, themeColor }: VoiceRecorderProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {/* Recording indicator */}
      <div className="relative flex items-center justify-center">
        <span className="absolute w-8 h-8 rounded-full bg-red-500/20 animate-ping" />
        <span className="relative w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/40" />
      </div>

      {/* Waveform */}
      <div className="flex-1 flex items-center gap-px h-8 overflow-hidden">
        {waveform.map((peak, i) => (
          <motion.div
            key={i}
            initial={{ height: 4 }}
            animate={{ height: `${Math.max(4, peak * 28)}px` }}
            transition={{ duration: 0.1 }}
            className="w-[3px] rounded-full bg-gradient-to-t from-red-400 to-red-300 dark:from-red-500 dark:to-red-400"
          />
        ))}
      </div>

      {/* Time */}
      <span className="text-sm font-mono font-semibold text-[var(--text-secondary)] tabular-nums min-w-[40px] text-right">
        {formatTime(recordingTime)}
      </span>

      {/* Cancel */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onCancel}
        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 text-[var(--color-danger)] transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </motion.button>
    </div>
  );
}
