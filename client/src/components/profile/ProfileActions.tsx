"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  BellOff,
  BellRing,
  Palette,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Shield,
  ShieldOff,
  Slash,
  ChevronRight,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileActionsProps {
  isOwnProfile?: boolean;
  isMuted?: boolean;
  isBlocked?: boolean;
  notificationsEnabled?: boolean;
  soundEnabled?: boolean;
  showPreview?: boolean;
  onMuteToggle?: () => void;
  onBlockToggle?: () => void;
  onNotificationToggle?: () => void;
  onSoundToggle?: () => void;
  onPreviewToggle?: () => void;
  onThemeClick?: () => void;
}

const THEME_COLORS = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
  { name: "Green", value: "#22C55E" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Indigo", value: "#6366F1" },
];

export function ProfileActions({
  isOwnProfile,
  isMuted = false,
  isBlocked = false,
  notificationsEnabled = true,
  soundEnabled = true,
  showPreview = true,
  onMuteToggle,
  onBlockToggle,
  onNotificationToggle,
  onSoundToggle,
  onPreviewToggle,
  onThemeClick,
}: ProfileActionsProps) {
  const [selectedTheme, setSelectedTheme] = useState("#3B82F6");
  const [showThemePicker, setShowThemePicker] = useState(false);

  return (
    <div className="space-y-2">
      {/* Notification Settings */}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1 mb-2">
          Notifications
        </p>

        <button
          onClick={onNotificationToggle}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {notificationsEnabled ? (
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10">
                <Bell className="w-4 h-4 text-blue-500" />
              </div>
            ) : (
              <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                <BellOff className="w-4 h-4 text-gray-400" />
              </div>
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Push Notifications
            </span>
          </div>
          <Toggle checked={notificationsEnabled} />
        </button>

        <button
          onClick={onSoundToggle}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {soundEnabled ? (
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                <Volume2 className="w-4 h-4 text-emerald-500" />
              </div>
            ) : (
              <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                <VolumeX className="w-4 h-4 text-gray-400" />
              </div>
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sound Effects
            </span>
          </div>
          <Toggle checked={soundEnabled} />
        </button>

        <button
          onClick={onPreviewToggle}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {showPreview ? (
              <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-500/10">
                <Eye className="w-4 h-4 text-purple-500" />
              </div>
            ) : (
              <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                <EyeOff className="w-4 h-4 text-gray-400" />
              </div>
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Message Preview
            </span>
          </div>
          <Toggle checked={showPreview} />
        </button>
      </div>

      {/* Theme */}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1 mb-2">
          Appearance
        </p>

        <button
          onClick={() => setShowThemePicker(!showThemePicker)}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
              <Palette className="w-4 h-4 text-indigo-500" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Chat Theme
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-full border-2 border-white dark:border-gray-900 shadow-sm"
              style={{ backgroundColor: selectedTheme }}
            />
            <ChevronRight className={cn(
              "w-4 h-4 text-gray-400 transition-transform",
              showThemePicker && "rotate-90"
            )} />
          </div>
        </button>

        {showThemePicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-3 pb-3"
          >
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              {THEME_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedTheme(color.value)}
                  className={cn(
                    "w-8 h-8 rounded-full transition-all relative",
                    selectedTheme === color.value
                      ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 scale-110"
                      : "hover:scale-105"
                  )}
                  style={{
                    backgroundColor: color.value,
                    ringColor: color.value,
                  } as React.CSSProperties}
                  title={color.name}
                >
                  {selectedTheme === color.value && (
                    <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-lg" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Privacy */}
      {!isOwnProfile && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1 mb-2">
            Privacy
          </p>

          <button
            onClick={onMuteToggle}
            className={cn(
              "w-full flex items-center justify-between p-3 rounded-xl transition-colors",
              isMuted
                ? "bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20"
                : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
            )}
          >
            <div className="flex items-center gap-3">
              {isMuted ? (
                <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-500/20">
                  <BellRing className="w-4 h-4 text-amber-500" />
                </div>
              ) : (
                <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <Bell className="w-4 h-4 text-gray-400" />
                </div>
              )}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isMuted ? "Unmute" : "Mute"} Notifications
              </span>
            </div>
            <Toggle checked={isMuted} variant="warning" />
          </button>

          <button
            onClick={onBlockToggle}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl transition-colors",
              isBlocked
                ? "bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20"
                : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
            )}
          >
            {isBlocked ? (
              <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-500/20">
                <ShieldOff className="w-4 h-4 text-red-500" />
              </div>
            ) : (
              <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                <Slash className="w-4 h-4 text-red-400" />
              </div>
            )}
            <span className={cn(
              "text-sm font-medium",
              isBlocked ? "text-red-600 dark:text-red-400" : "text-red-500"
            )}>
              {isBlocked ? "Unblock User" : "Block User"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

function Toggle({
  checked,
  variant = "default",
}: {
  checked: boolean;
  variant?: "default" | "warning";
}) {
  return (
    <div className={cn(
      "w-10 h-[22px] rounded-full relative transition-colors cursor-pointer",
      checked
        ? variant === "warning"
          ? "bg-amber-500"
          : "bg-blue-500"
        : "bg-gray-200 dark:bg-gray-700"
    )}>
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: "spring" as const, stiffness: 500, damping: 30 }}
        className="absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full shadow-sm"
      />
    </div>
  );
}
