"use client";

import { Smile, CornerUpRight, Share2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/types";

interface MessageActionButtonsProps {
  message: Message;
  isMe: boolean;
  showQuickReactions: boolean;
  setShowQuickReactions: (show: boolean) => void;
  onReply: (message: Message) => void;
  onForward: (message: Message) => void;
}

export function MessageActionButtons({
  message,
  isMe,
  showQuickReactions,
  setShowQuickReactions,
  onReply,
  onForward,
}: MessageActionButtonsProps) {
  return (
    <div
      className={cn(
        "flex flex-row items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200",
        "self-center py-1 px-1 rounded-lg",
        "bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700",
        isMe ? "flex-row-reverse" : "flex-row"
      )}
    >
      <button
        onClick={() => setShowQuickReactions(!showQuickReactions)}
        className={cn(
          "p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150",
          showQuickReactions
            ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        )}
        title="React"
      >
        <Smile className="w-4 h-4" />
      </button>
      <button
        onClick={() => onReply(message)}
        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-all duration-150"
        title="Reply"
      >
        <CornerUpRight className="w-4 h-4" />
      </button>
      <button
        onClick={() => onForward(message)}
        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 hover:text-emerald-500 transition-all duration-150"
        title="Forward"
      >
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  );
}
