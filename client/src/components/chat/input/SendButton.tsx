"use client";

import { Send, Mic } from "lucide-react";

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
  themeColor
}: SendButtonProps) {
  if (hasValue || isRecording) {
    const bgColor = themeColor || '#28a8e8';
    return (
      <button 
        onClick={isRecording ? onStopRecording : onSend}
        className="p-2.5 text-white rounded-full hover:opacity-90 transition-all duration-200 active:scale-90 shadow-lg"
        style={{ backgroundColor: bgColor }}
      >
        <Send className="w-4.5 h-4.5" />
      </button>
    );
  }

  return (
    <button 
      onClick={onStartRecording}
      className="p-2.5 bg-[#effdde] hover:bg-[#34c759] text-[#34c759] hover:text-white rounded-full transition-all duration-200 active:scale-90"
    >
      <Mic className="w-4.5 h-4.5" />
    </button>
  );
}
