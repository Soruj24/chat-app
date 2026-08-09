"use client";

import { Smile, Paperclip, Film, Bold, Italic, Code, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface InputActionsProps {
  showEmojiPicker: boolean;
  onEmojiPickerToggle: () => void;
  isAttachmentMenuOpen: boolean;
  onAttachmentMenuToggle: () => void;
  showGifPicker: boolean;
  onGifPickerToggle: () => void;
  themeColor?: string;
  showMarkdownBar?: boolean;
  onMarkdownToggle?: () => void;
}

export function InputActions({
  showEmojiPicker,
  onEmojiPickerToggle,
  isAttachmentMenuOpen,
  onAttachmentMenuToggle,
  showGifPicker,
  onGifPickerToggle,
  showMarkdownBar,
  onMarkdownToggle,
}: InputActionsProps) {
  return (
    <div className="flex items-center gap-0.5 mb-1">
      <ActionButton
        isActive={showEmojiPicker}
        onClick={onEmojiPickerToggle}
        title="Emoji (Ctrl+E)"
      >
        <Smile className="w-[18px] h-[18px]" />
      </ActionButton>
      <ActionButton
        isActive={showGifPicker}
        onClick={onGifPickerToggle}
        title="GIF"
      >
        <span className="text-[10px] font-black leading-none">GIF</span>
      </ActionButton>
      <ActionButton
        isActive={isAttachmentMenuOpen}
        onClick={onAttachmentMenuToggle}
        title="Attach file"
      >
        <Paperclip className="w-[18px] h-[18px]" />
      </ActionButton>
      {onMarkdownToggle && (
        <ActionButton
          isActive={!!showMarkdownBar}
          onClick={onMarkdownToggle}
          title="Formatting (Ctrl+M)"
        >
          <Hash className="w-[18px] h-[18px]" />
        </ActionButton>
      )}
    </div>
  );
}

function ActionButton({
  isActive,
  onClick,
  title,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150",
        isActive
          ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10"
          : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--composer-toolbar-hover)]"
      )}
    >
      {children}
    </motion.button>
  );
}
