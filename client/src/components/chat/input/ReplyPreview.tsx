"use client";

import { X, Reply } from "lucide-react";
import { Message } from "@/lib/types";
import { motion } from "framer-motion";

interface ReplyPreviewProps {
  replyingTo: Message;
  onCancel: () => void;
}

export function ReplyPreview({ replyingTo, onCancel }: ReplyPreviewProps) {
  return (
    <div className="px-3 pb-1">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-3 py-2.5 bg-[var(--composer-bg)] rounded-xl border border-[var(--border-default)]"
      >
        {/* Accent bar */}
        <div className="w-[3px] h-8 rounded-full bg-[var(--color-primary)] shrink-0" />

        {/* Reply icon */}
        <Reply className="w-4 h-4 text-[var(--color-primary)] shrink-0" />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wide">
            Replying to {replyingTo.senderName || "User"}
          </p>
          <p className="text-xs text-[var(--text-secondary)] truncate leading-tight mt-0.5">
            {replyingTo.text || "Media message"}
          </p>
        </div>

        {/* Cancel */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onCancel}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[var(--composer-toolbar-hover)] text-[var(--text-tertiary)] shrink-0 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </motion.button>
      </motion.div>
    </div>
  );
}
