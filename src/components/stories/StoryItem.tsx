"use client";

import { cn } from "@/lib/utils";
import { Story } from "@/lib/types";
import Image from "next/image";

interface StoryItemProps {
  story: Story;
  onClick: () => void;
}

export function StoryItem({ story, onClick }: StoryItemProps) {
  return (
    <div 
      className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
      onClick={onClick}
    >
      <div className={cn(
        "w-14 h-14 rounded-full p-0.5 border-2 transition-all duration-300 group-active:scale-95 relative",
        story.isRead 
          ? "border-gray-200 dark:border-gray-800" 
          : "border-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.3)]"
      )}>
        <Image
          src={story.userAvatar}
          alt={story.userName}
          fill
          unoptimized
          className="rounded-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all"
        />
      </div>
      <span className={cn(
        "text-[10px] font-bold uppercase tracking-tighter truncate w-14 text-center",
        story.isRead ? "text-gray-400" : "text-gray-900 dark:text-gray-100"
      )}>
        {story.userName.split(' ')[0]}
      </span>
    </div>
  );
}
