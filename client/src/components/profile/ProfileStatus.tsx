"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Circle, Smile, Pencil, Check, X } from "lucide-react";
import { User } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProfileStatusProps {
  user: User;
  isOwnProfile?: boolean;
  onStatusChange?: (status: string) => void;
}

const STATUS_OPTIONS = [
  { value: "online", label: "Online", color: "bg-emerald-500" },
  { value: "away", label: "Away", color: "bg-amber-500" },
  { value: "busy", label: "Do Not Disturb", color: "bg-red-500" },
  { value: "offline", label: "Invisible", color: "bg-gray-400" },
] as const;

const CUSTOM_EMOJIS = [
  "💼", "🎯", "🏃", "☕", "🎮", "📚", "🎵", "🌍",
  "🚀", "💡", "🎨", "🏋️", "🎬", "🍕", "🌅", "⭐",
];

export function ProfileStatus({ user, isOwnProfile, onStatusChange }: ProfileStatusProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(user.status === "online" ? "online" : "offline");
  const [customEmoji, setCustomEmoji] = useState("💼");
  const [customText, setCustomText] = useState("");

  const handleSave = () => {
    onStatusChange?.(selectedStatus);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      {/* Current status display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Circle className={cn(
              "w-3 h-3 fill-current",
              selectedStatus === "online" ? "text-emerald-500" :
              selectedStatus === "away" ? "text-amber-500" :
              selectedStatus === "busy" ? "text-red-500" :
              "text-gray-400"
            )} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {STATUS_OPTIONS.find(s => s.value === selectedStatus)?.label || "Online"}
            </p>
            {customText && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {customEmoji} {customText}
              </p>
            )}
          </div>
        </div>
        {isOwnProfile && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Edit mode */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3 overflow-hidden"
        >
          {/* Status options */}
          <div className="space-y-1">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                className={cn(
                  "w-full flex items-center gap-3 p-2.5 rounded-xl transition-colors text-left",
                  selectedStatus === option.value
                    ? "bg-blue-50 dark:bg-blue-500/10"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                )}
              >
                <div className={cn("w-3 h-3 rounded-full", option.color)} />
                <span className={cn(
                  "text-sm",
                  selectedStatus === option.value
                    ? "font-medium text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"
                )}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>

          {/* Custom emoji */}
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Add emoji</p>
            <div className="flex flex-wrap gap-1.5">
              {CUSTOM_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setCustomEmoji(emoji)}
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all",
                    customEmoji === emoji
                      ? "bg-blue-100 dark:bg-blue-500/20 scale-110"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Custom text */}
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Status message</p>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
