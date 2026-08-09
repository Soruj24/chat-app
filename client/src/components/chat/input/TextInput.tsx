"use client";

import { forwardRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TextInputProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onPaste?: (e: React.ClipboardEvent) => void;
  placeholder?: string;
}

export const TextInput = forwardRef<HTMLTextAreaElement, TextInputProps>(
  function TextInput({ textareaRef, value, onChange, onKeyDown, onPaste, placeholder }, _) {
    const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e);
      // Auto-resize: reset to auto then set to scrollHeight
      const textarea = e.target;
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }, [onChange]);

    return (
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          placeholder={placeholder || "Type a message..."}
          rows={1}
          className={cn(
            "w-full bg-transparent text-[14px] leading-relaxed",
            "px-4 py-3 resize-none",
            "focus:outline-none",
            "placeholder:text-[var(--composer-text-muted)]",
            "text-[var(--composer-text)]",
            "max-h-40 min-h-[44px]"
          )}
          style={{ height: "auto" }}
        />
      </div>
    );
  }
);
