"use client";

import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { CornerUpRight, Heart } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { MessageContent } from "./message/MessageContent";
import { MessageQuickReactions } from "./message/MessageQuickReactions";
import { MessageActionButtons } from "./message/MessageActionButtons";
import { SwipeToReplyIndicator } from "./message/SwipeToReplyIndicator";
import { MessageTail } from "./message/MessageTail";
import { MessageLikeAnimation } from "./message/MessageLikeAnimation";
import { MessageHeader } from "./message/MessageHeader";
import { MessageFooter } from "./message/MessageFooter";
import { useMessageSwipe } from "@/hooks/useMessageSwipe";
import { useDoubleTap } from "@/hooks/useDoubleTap";

interface MessageBubbleProps {
  message: Message;
  onImageClick?: (url: string) => void;
  onReply?: (message: Message) => void;
  onForward?: (message: Message) => void;
  onReaction?: (message: Message, emoji: string) => void;
  onContextMenu?: (e: React.MouseEvent, message: Message) => void;
  onLike?: (message: Message) => void;
  showSenderName?: boolean;
  highlight?: string;
}

export function MessageBubble({ 
  message, 
  onImageClick, 
  onReply, 
  onForward, 
  onReaction,
  onContextMenu,
  onLike,
  showSenderName,
  highlight
}: MessageBubbleProps) {
  const isMe = message.isMe;
  const [showQuickReactions, setShowQuickReactions] = useState(false);
  const quickReactionsRef = useRef<HTMLDivElement>(null);
  
  const { x, replyOpacity, replyScale, handleDragEnd } = useMessageSwipe(isMe, () => onReply?.(message));
  const { handleDoubleTap, showAnimation: showHeart } = useDoubleTap(() => onLike?.(message));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (quickReactionsRef.current && !quickReactionsRef.current.contains(event.target as Node)) {
        setShowQuickReactions(false);
      }
    };
    if (showQuickReactions) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showQuickReactions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      style={{ x }}
      transition={{ 
        duration: 0.3,
        ease: [0.23, 1, 0.32, 1]
      }}
      className={cn(
        "flex w-full mb-1 group px-4 relative touch-pan-y",
        isMe ? "justify-end" : "justify-start"
      )}
      onClick={handleDoubleTap}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.(e, message);
      }}
    >
      {/* Swipe to reply indicator */}
      <SwipeToReplyIndicator 
        x={x} 
        replyOpacity={replyOpacity} 
        replyScale={replyScale} 
        isMe={isMe} 
      />

      <div className={cn(
        "flex max-w-[70%] relative",
        isMe ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Like animation heart */}
        <MessageLikeAnimation showHeart={showHeart} />

        {/* Quick Reactions Bar */}
        <AnimatePresence>
          {showQuickReactions && (
            <MessageQuickReactions 
              message={message}
              isMe={isMe}
              onReaction={onReaction || (() => {})}
              onClose={() => setShowQuickReactions(false)}
              innerRef={quickReactionsRef}
            />
          )}
        </AnimatePresence>

        {/* Message Actions - Hover only */}
        <MessageActionButtons 
          message={message}
          isMe={isMe}
          showQuickReactions={showQuickReactions}
          setShowQuickReactions={setShowQuickReactions}
          onReply={onReply || (() => {})}
          onForward={onForward || (() => {})}
        />

        <div
          className={cn(
            "rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.1)] relative transition-all duration-200",
            isMe
              ? "bg-blue-600 text-white rounded-tr-none"
              : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none border-transparent dark:border-gray-700 shadow-sm"
          )}
        >
          {/* Tail Design */}
          <MessageTail isMe={isMe} />

          {/* Message Header (Sender name, Reply, Forwarded) */}
          <MessageHeader 
            message={message} 
            isMe={isMe} 
            showSenderName={showSenderName} 
          />

          {/* Message Content */}
          <MessageContent 
            message={message} 
            isMe={isMe} 
            highlight={highlight} 
            onImageClick={onImageClick} 
          />

          {/* Message Footer (Timestamp, Status, Reactions) */}
          <MessageFooter 
            message={message} 
            isMe={isMe} 
            onReactionClick={(emoji) => onReaction?.(message, emoji)}
          />
        </div>
      </div>
    </motion.div>
  );
}
