"use client";

import { CornerUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageForwardedLabelProps {
  isMe: boolean;
}

export function MessageForwardedLabel({ isMe }: MessageForwardedLabelProps) {
  return (
    <div className={cn(
      "px-3 pt-2 flex items-center gap-1.5",
      isMe ? "text-white/60" : "text-gray-400 dark:text-gray-500"
    )}>
      <CornerUpRight className="w-3 h-3" />
      <span className="text-[10px] font-medium uppercase tracking-wider">Forwarded</span>
    </div>
  );
}
