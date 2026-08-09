"use client";

import { cn } from "@/lib/utils";

interface MessageTailProps {
  isMe: boolean;
  themeColor?: string;
}

export function MessageTail({ isMe, themeColor }: MessageTailProps) {
  return (
    <svg
      className={cn(
        "absolute top-0 w-[9px] h-[16px]",
        isMe ? "-right-[4px]" : "-left-[4px]"
      )}
      viewBox="0 0 9 16"
      fill="none"
    >
      {isMe ? (
        <path
          d="M0 0C0 0 9 0 9 0C9 0 0 16 0 16L0 0Z"
          fill={themeColor || "rgb(16, 163, 127)"}
        />
      ) : (
        <path
          d="M9 0C9 0 0 0 0 0C0 0 9 16 9 16L9 0Z"
          fill="currentColor"
          className="text-white dark:text-[#1e2c33]"
        />
      )}
    </svg>
  );
}
