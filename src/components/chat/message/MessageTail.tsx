"use client";

import { cn } from "@/lib/utils";

interface MessageTailProps {
  isMe: boolean;
}

export function MessageTail({ isMe }: MessageTailProps) {
  return (
    <div className={cn(
      "absolute top-0 w-3 h-3",
      isMe 
        ? "-right-1.5 bg-blue-600 [clip-path:polygon(0_0,0_100%,100%_0)]" 
        : "-left-1.5 bg-gray-200 dark:bg-gray-800 [clip-path:polygon(0_0,100%_0,100%_100%)]"
    )} />
  );
}
