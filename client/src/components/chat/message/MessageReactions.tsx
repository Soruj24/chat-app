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
    <div
      className={cn(
        "flex flex-wrap gap-1 mt-1",
        isMe ? "justify-end" : "justify-start"
      )}
    >
      {reactions.map((reaction) => (
        <button
          key={reaction.emoji}
          onClick={() => onReactionClick?.(reaction.emoji)}
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all duration-150 active:scale-95 border",
            reaction.me
              ? isMe
                ? "bg-white/20 border-white/30 text-white"
                : "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
              : "bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
        >
          <span className="text-sm leading-none">{reaction.emoji}</span>
          {reaction.count > 1 && (
            <span className="text-[10px] font-semibold leading-none">{reaction.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
