"use client";

import { Send, Mic, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface SendButtonProps {
  isRecording: boolean;
  hasValue: boolean;
  onSend: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  themeColor?: string;
}

export function SendButton({
  isRecording,
  hasValue,
  onSend,
  onStartRecording,
  onStopRecording,
  themeColor,
}: SendButtonProps) {
  const [ripple, setRipple] = useState(false);

  const handleSend = () => {
    setRipple(true);
    setTimeout(() => setRipple(false), 600);
    onSend();
  };

  const bgColor = themeColor || "var(--color-primary)";

  if (hasValue || isRecording) {
    return (
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.88 }}
          onClick={isRecording ? onStopRecording : handleSend}
          className={cn(
            "relative w-10 h-10 rounded-[var(--radius-xl)] flex items-center justify-center text-white transition-all duration-200 overflow-hidden shadow-[var(--shadow-md)]"
          )}
          style={{
            backgroundColor: bgColor,
            boxShadow: `0 4px 16px ${bgColor}33, inset 0 1px 0 rgba(255,255,255,0.15)`,
          }}
        >
          <AnimatePresence mode="wait">
            {isRecording ? (
              <motion.div
                key="stop"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="w-3.5 h-3.5 rounded-sm bg-white"
              />
            ) : (
              <motion.div
                key="send"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
              >
                <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
              </motion.div>
            )}
          </AnimatePresence>
          {/* Ripple effect */}
          {ripple && (
            <span
              className="absolute inset-0 rounded-xl send-ripple"
              style={{ backgroundColor: `${bgColor}40` }}
            />
          )}
        </motion.button>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.88 }}
      onClick={onStartRecording}
      className={cn(
        "w-10 h-10 rounded-[var(--radius-xl)] flex items-center justify-center transition-all duration-200",
        "bg-[var(--surface-secondary)] text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)]",
        "hover:bg-[var(--surface-hover)] border border-[var(--border-default)] hover:border-[var(--border-strong)]",
        "shadow-[var(--shadow-xs)]"
      )}
    >
      <Mic className="w-5 h-5" />
    </motion.button>
  );
}
