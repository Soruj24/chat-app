"use client";

import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { socketService } from "@/lib/socket/socket-client";

interface TypingIndicatorProps {
  chatId?: string;
  userName?: string;
  themeColor?: string;
}

export function TypingIndicator({ chatId, userName, themeColor }: TypingIndicatorProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!chatId || !user?.id) return;

    const handleTyping = ({ chatId: typingChatId, userId, isTyping }: { chatId: string; userId: string; isTyping: boolean }) => {
      if (typingChatId === chatId && userId !== user.id) {
        if (isTyping) {
          setTypingUsers(prev => prev.includes(userId) ? prev : [...prev, userId]);
        } else {
          setTypingUsers(prev => prev.filter(id => id !== userId));
        }
      }
    };

    socketService.on("user-typing", handleTyping);

    return () => {
      socketService.off("user-typing", handleTyping);
    };
  }, [chatId, user?.id]);

  const displayName = userName || (typingUsers.length > 0 ? typingUsers.join(", ") : null);
  
  if (!displayName) return null;

  const message = userName ? `${userName} is typing...` : 
    typingUsers.length === 1 ? `${typingUsers[0]} is typing...` : 
    `${typingUsers.length} users are typing...`;

  return (
    <div className="flex items-center gap-1 px-3 py-1 text-xs text-[#8e8e93]">
      <div className="flex gap-0.5">
        <span className="w-1.5 h-1.5 bg-[#28a8e8] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-1.5 h-1.5 bg-[#28a8e8] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-1.5 h-1.5 bg-[#28a8e8] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <span className="ml-1 italic">{message}</span>
    </div>
  );
}

// Hook for sending typing events
export function useTypingIndicator(chatId: string) {
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef: React.RefObject<NodeJS.Timeout | null> = { current: null };

  const startTyping = useCallback(() => {
    if (!chatId) return;
    
    socketService.sendTyping(chatId, true);
    setIsTyping(true);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      socketService.sendTyping(chatId, false);
      setIsTyping(false);
    }, 3000);
  }, [chatId]);

  const stopTyping = useCallback(() => {
    if (!chatId) return;
    
    socketService.sendTyping(chatId, false);
    setIsTyping(false);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [chatId]);

  return { isTyping, startTyping, stopTyping };
}