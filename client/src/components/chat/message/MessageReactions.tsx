"use client";

import { cn } from "@/lib/utils";

interface Reaction {
  emoji: string;
  count: number;
  me?: boolean;
}

interface MessageReactionsProps {
  reactions: Reaction[];
  isMe: boolean;
  onReactionClick?: (emoji: string) => void;
}

export function MessageReactions({ reactions, isMe, onReactionClick }: MessageReactionsProps) {
  if (!reactions || reactions.length === 0) return null;

  return (
    <div className={cn(
      "absolute -bottom-2 flex gap-0.5",
      isMe ? "right-2" : "left-2"
    )}>
      {reactions.slice(0, 3).map((reaction) => (
        <button
          key={reaction.emoji}
          onClick={() => onReactionClick?.(reaction.emoji)}
          className={cn(
            "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] transition-all active:scale-90 border",
            isMe
              ? "bg-[#203239] border-[#2b4a40]"
              : "bg-[#ffffff] border-[#e6e8ec] dark:bg-[#242f3d] dark:border-[#2b3142]",
            reaction.me && "ring-1 ring-[#34c759]"
          )}
        >
          <span className="text-xs">{reaction.emoji}</span>
          {reaction.count > 1 && (
            <span className={cn(
              "font-medium",
              isMe ? "text-[#c4e9c2]" : "text-[#000000] dark:text-[#ffffff]"
            )}>
              {reaction.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
