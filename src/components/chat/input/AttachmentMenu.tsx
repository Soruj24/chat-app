"use client";

import { motion } from "framer-motion";
import { Image, Camera, FileText, User, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttachmentMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const attachmentOptions = [
  { icon: Image, label: "Photos & Videos", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
  { icon: Camera, label: "Camera", color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-900/20" },
  { icon: FileText, label: "Document", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { icon: User, label: "Contact", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
  { icon: MapPin, label: "Location", color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
];

export function AttachmentMenu({ isOpen, onClose }: AttachmentMenuProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute bottom-full left-0 mb-4 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden min-w-[200px] z-20"
    >
      <div className="p-2 space-y-1">
        {attachmentOptions.map((option, i) => {
          const Icon = option.icon;
          return (
            <button
              key={i}
              onClick={onClose}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-colors group"
            >
              <div className={cn("p-2 rounded-xl transition-transform group-hover:scale-110", option.bg, option.color)}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{option.label}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
