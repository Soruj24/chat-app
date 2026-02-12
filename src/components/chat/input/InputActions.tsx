"use client";

import { Smile, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputActionsProps {
  showEmojiPicker: boolean;
  onEmojiPickerToggle: () => void;
  isAttachmentMenuOpen: boolean;
  onAttachmentMenuToggle: () => void;
}

export function InputActions({
  showEmojiPicker,
  onEmojiPickerToggle,
  isAttachmentMenuOpen,
  onAttachmentMenuToggle,
}: InputActionsProps) {
  return (
    <div className="flex items-center mb-0.5">
      <button 
        onClick={onEmojiPickerToggle}
        className={cn(
          "p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200",
          showEmojiPicker ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30" : "text-gray-400 dark:text-gray-500"
        )}
      >
        <Smile className="w-5 h-5" />
      </button>
      <button 
        onClick={onAttachmentMenuToggle}
        className={cn(
          "p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200",
          isAttachmentMenuOpen ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30" : "text-gray-400 dark:text-gray-500"
        )}
      >
        <Paperclip className="w-5 h-5" />
      </button>
    </div>
  );
}
