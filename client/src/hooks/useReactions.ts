"use client";

import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { socketService } from "@/lib/socket/socket-client";

interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

interface UseReactionsOptions {
  chatId: string;
  messageId: string;
  initialReactions?: Array<{ userId: string; emoji: string }>;
}

export function useReactions({ chatId, messageId, initialReactions = [] }: UseReactionsOptions) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [reactions, setReactions] = useState<Reaction[]>([]);

  // Process reactions from the message
  const processReactions = useCallback((serverReactions: Array<{ userId: { _id?: string; username?: string }; emoji: string }>) => {
    if (!serverReactions || serverReactions.length === 0) {
      setReactions([]);
      return;
    }

    const reactionMap = new Map<string, { emoji: string; count: number; userReacted: boolean }>();
    
    serverReactions.forEach((r) => {
      const userId = r.userId?._id || r.userId;
      const existing = reactionMap.get(r.emoji);
      
      if (existing) {
        existing.count += 1;
        if (userId === user?.id) {
          existing.userReacted = true;
        }
      } else {
        reactionMap.set(r.emoji, {
          emoji: r.emoji,
          count: 1,
          userReacted: userId === user?.id,
        });
      }
    });

    setReactions(Array.from(reactionMap.values()));
  }, [user?.id]);

  const addReaction = useCallback((emoji: string) => {
    if (!chatId || !messageId || !user?.id) return;
    socketService.reactToMessage(chatId, messageId, emoji);
  }, [chatId, messageId, user?.id]);

  const removeReaction = useCallback((emoji: string) => {
    if (!chatId || !messageId || !user?.id) return;
    // To remove, we send the same emoji again (toggle behavior on server)
    socketService.reactToMessage(chatId, messageId, emoji);
  }, [chatId, messageId, user?.id]);

  return { reactions, addReaction, removeReaction, processReactions };
}

// Quick reactions for common emojis
export const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];