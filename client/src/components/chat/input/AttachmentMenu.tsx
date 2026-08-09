"use client";

import { Image, FileText, MapPin, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AttachmentMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => void;
  onLocationSelect: () => void;
  onContactSelect: () => void;
}

const ATTACHMENTS = [
  { type: "image", icon: Image, label: "Photo", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20", gradient: "from-blue-500 to-blue-600" },
  { type: "file", icon: FileText, label: "Document", color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20", gradient: "from-violet-500 to-violet-600" },
  { type: "location", icon: MapPin, label: "Location", color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20", gradient: "from-green-500 to-green-600" },
  { type: "contact", icon: User, label: "Contact", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20", gradient: "from-orange-500 to-orange-600" },
];

export function AttachmentMenu({ isOpen, onClose, onFileSelect, onLocationSelect, onContactSelect }: AttachmentMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-full left-0 mb-2 composer-popup rounded-2xl p-3 z-50"
          >
            <div className="grid grid-cols-2 gap-2 min-w-[240px]">
              {ATTACHMENTS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.type}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      if (item.type === "location") {
                        onLocationSelect();
                      } else if (item.type === "contact") {
                        onContactSelect();
                      } else if (item.type === "image") {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) onFileSelect(file);
                        };
                        input.click();
                      } else {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) onFileSelect(file);
                        };
                        input.click();
                      }
                      onClose();
                    }}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95",
                      item.bg
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-sm",
                      item.gradient
                    )}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-[var(--text-secondary)]">{item.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
