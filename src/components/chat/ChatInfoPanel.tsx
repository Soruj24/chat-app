"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Chat, Message } from "@/lib/types";
import { useState } from "react";
import { ChatInfoMainView } from "./info-panel/ChatInfoMainView";
import { ChatMediaView } from "./info-panel/ChatMediaView";
import { ChatStarredView } from "./info-panel/ChatStarredView";
import { ChatWallpaperView } from "./info-panel/ChatWallpaperView";

interface ChatInfoPanelProps {
  chat: Chat;
  onClose: () => void;
  onWallpaperChange?: (url: string) => void;
  starredMessages?: Message[];
  onMessageClick?: (messageId: string) => void;
}

const WALLPAPERS = [
  { id: 'default', url: '', label: 'Default' },
  { id: 'abstract', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop', label: 'Dark Abstract' },
  { id: 'nature', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1000&auto=format&fit=crop', label: 'Nature' },
  { id: 'minimal', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop', label: 'Scenic' },
  { id: 'gradient', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop', label: 'Gradient' },
  { id: 'texture', url: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=1000&auto=format&fit=crop', label: 'Texture' },
];

export function ChatInfoPanel({ chat, onClose, onWallpaperChange, starredMessages, onMessageClick }: ChatInfoPanelProps) {
  const [viewMode, setViewMode] = useState<"info" | "media" | "wallpaper" | "starred">("info");

  // Generate more media for "View All" mode
  const allMedia = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    url: `https://picsum.photos/seed/${chat.id}-${i}/400`
  }));

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute inset-y-0 right-0 w-full md:w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 z-50 flex flex-col shadow-2xl"
    >
      <AnimatePresence mode="wait">
        {viewMode === "info" && (
          <motion.div
            key="info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            <ChatInfoMainView 
              chat={chat}
              onClose={onClose}
              setViewMode={setViewMode}
              starredMessages={starredMessages}
              allMedia={allMedia}
            />
          </motion.div>
        )}

        {viewMode === "media" && (
          <motion.div
            key="media"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            <ChatMediaView 
              allMedia={allMedia}
              onBack={() => setViewMode("info")}
            />
          </motion.div>
        )}

        {viewMode === "starred" && (
          <motion.div
            key="starred"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            <ChatStarredView 
              starredMessages={starredMessages}
              chat={chat}
              onBack={() => setViewMode("info")}
              onMessageClick={onMessageClick}
            />
          </motion.div>
        )}

        {viewMode === "wallpaper" && (
          <motion.div
            key="wallpaper"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            <ChatWallpaperView 
              chat={chat}
              wallpapers={WALLPAPERS}
              onBack={() => setViewMode("info")}
              onWallpaperChange={onWallpaperChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
