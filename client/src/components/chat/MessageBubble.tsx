"use client";

import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { MessageContent } from "./message/MessageContent";
import { MessageQuickReactions } from "./message/MessageQuickReactions";
import { MessageActionButtons } from "./message/MessageActionButtons";
import { SwipeToReplyIndicator } from "./message/SwipeToReplyIndicator";
import { MessageLikeAnimation } from "./message/MessageLikeAnimation";
import { MessageHeader } from "./message/MessageHeader";
import { MessageFooter } from "./message/MessageFooter";
import { useMessageSwipe } from "@/hooks/useMessageSwipe";
import { useDoubleTap } from "@/hooks/useDoubleTap";
import Image from "next/image";
import { getUserColor } from "@/lib/utils";
import { spring, fadeUp } from "@/lib/animations";

interface MessageBubbleProps {
  message: Message;
  isGroupStart?: boolean;
  isGroupEnd?: boolean;
  onImageClick?: (url: string) => void;
  onReply?: (message: Message) => void;
  onForward?: (message: Message) => void;
  onReaction?: (message: Message, emoji: string) => void;
  onContextMenu?: (e: React.MouseEvent, message: Message) => void;
  onLike?: (message: Message) => void;
  showSenderName?: boolean;
  highlight?: string;
  themeColor?: string;
  fontSize?: "small" | "medium" | "large";
  bubbleStyle?: "modern" | "classic" | "rounded";
  accentColor?: string;
}

export function MessageBubble({
  message,
  isGroupStart = true,
  isGroupEnd = true,
  onImageClick,
  onReply,
  onForward,
  onReaction,
  onContextMenu,
  onLike,
  themeColor,
  showSenderName,
  highlight,
  fontSize = "medium",
  bubbleStyle = "modern",
  accentColor,
}: MessageBubbleProps) {
  const isMe = message.isMe;
  const [showQuickReactions, setShowQuickReactions] = useState(false);
  const quickReactionsRef = useRef<HTMLDivElement>(null);

  const { x, replyOpacity, replyScale, handleDragEnd } = useMessageSwipe(
    isMe,
    () => onReply?.(message)
  );
  const { handleDoubleTap, showAnimation: showHeart } = useDoubleTap(() =>
    onLike?.(message)
  );

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

  const isImage = message.type === "image";
  const isMedia = isImage || message.type === "video" || message.type === "voice";

  // Bubble radius based on group position and style
  const getBubbleRadius = () => {
    if (bubbleStyle === "classic") return "rounded-[var(--radius-lg)]";
    if (bubbleStyle === "rounded") return "rounded-[var(--radius-3xl)]";

    // Modern style with group-aware corners
    if (isMe) {
      if (isGroupStart && isGroupEnd) return "rounded-[var(--radius-2xl)] rounded-br-[var(--radius-sm)]";
      if (isGroupStart) return "rounded-[var(--radius-2xl)] rounded-br-[var(--radius-sm)] rounded-tr-[var(--radius-2xl)]";
      if (isGroupEnd) return "rounded-[var(--radius-2xl)] rounded-br-[var(--radius-sm)] rounded-tr-[var(--radius-sm)]";
      return "rounded-[var(--radius-2xl)] rounded-r-[var(--radius-sm)]";
    }
    if (isGroupStart && isGroupEnd) return "rounded-[var(--radius-2xl)] rounded-bl-[var(--radius-sm)]";
    if (isGroupStart) return "rounded-[var(--radius-2xl)] rounded-bl-[var(--radius-sm)] rounded-tl-[var(--radius-2xl)]";
    if (isGroupEnd) return "rounded-[var(--radius-2xl)] rounded-bl-[var(--radius-sm)] rounded-tl-[var(--radius-sm)]";
    return "rounded-[var(--radius-2xl)] rounded-l-[var(--radius-sm)]";
  };

  // Bubble background color
  const getBubbleBg = () => {
    if (isMedia) return "bg-transparent";

    if (isMe) {
      if (themeColor || accentColor) return "";
      return "bg-[#10a37f] text-white";
    }
    return "bg-white dark:bg-[#1e2c33] text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700/50";
  };

  // Spacing: reduce margin when grouped
  const marginTop = isGroupStart ? "mt-2" : "mt-0.5";
  const marginBottom = isGroupEnd ? "mb-1" : "mb-0";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      transition={spring.gentle}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.15}
      onDragEnd={handleDragEnd}
      style={{ x }}
      className={cn(
        "flex w-full px-4 group relative items-end gap-2.5 select-none",
        isMe ? "flex-row-reverse" : "flex-row",
        marginTop,
        marginBottom
      )}
      onClick={handleDoubleTap}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.(e, message);
      }}
    >
      {/* Sender Avatar - only show for group start */}
      <div className="flex-shrink-0 w-8 relative" style={{ visibility: isGroupStart ? "visible" : "hidden" }}>
        <div className="relative w-8 h-8 rounded-[var(--radius-xl)] overflow-hidden bg-[var(--surface-secondary)] flex items-center justify-center shadow-[var(--shadow-xs)]">
          {message.senderAvatar ? (
            <Image
              src={message.senderAvatar}
              alt={message.senderName || "User"}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div
              className={cn(
                "w-full h-full flex items-center justify-center bg-gradient-to-br text-white text-[11px] font-bold uppercase",
                getUserColor(message.senderName || "User")
              )}
            >
              {(message.senderName || "U").charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Spacer for grouped messages */}
      {!isGroupStart && <div className="w-8 flex-shrink-0" />}

      {/* Swipe to reply indicator */}
      <SwipeToReplyIndicator x={x} replyOpacity={replyOpacity} replyScale={replyScale} isMe={isMe} />

      <div
        className={cn(
          "flex flex-col relative",
          isMe ? "items-end" : "items-start",
          "max-w-[70%] min-w-0"
        )}
      >
        {/* Like animation */}
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

        {/* Action Buttons - hover only */}
        <div className={cn("transition-opacity duration-150", isGroupEnd ? "opacity-0 group-hover:opacity-100" : "h-0 overflow-hidden")}>
          <MessageActionButtons
            message={message}
            isMe={isMe}
            showQuickReactions={showQuickReactions}
            setShowQuickReactions={setShowQuickReactions}
            onReply={onReply || (() => {})}
            onForward={onForward || (() => {})}
          />
        </div>

        {/* Message Bubble */}
        <div
          className={cn(
            "relative transition-all duration-200 min-w-0 overflow-hidden",
            "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
            "group-hover:shadow-[var(--shadow-md)]",
            getBubbleRadius(),
            getBubbleBg(),
            isMedia ? "" : "max-w-[360px]"
          )}
          style={
            isMe && (themeColor || accentColor) && !isMedia
              ? { backgroundColor: themeColor || accentColor, color: "#fff" }
              : {}
          }
        >
          {/* Message Header (Sender name, Reply, Forwarded) */}
          <MessageHeader
            message={message}
            isMe={isMe}
            showSenderName={showSenderName}
            themeColor={themeColor}
          />

          {/* Message Content */}
          <MessageContent
            message={message}
            isMe={isMe}
            highlight={highlight}
            onImageClick={onImageClick}
            themeColor={themeColor}
            fontSize={fontSize}
          />

          {/* Message Footer (Timestamp, Status, Reactions) */}
          {!isMedia && (
            <MessageFooter
              message={message}
              isMe={isMe}
              onReactionClick={(emoji) => onReaction?.(message, emoji)}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
