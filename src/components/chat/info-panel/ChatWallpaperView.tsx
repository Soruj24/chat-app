"use client";

import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Chat } from "@/lib/types";

interface ChatWallpaperViewProps {
  chat: Chat;
  wallpapers: { id: string; url: string; label: string }[];
  onBack: () => void;
  onWallpaperChange?: (url: string) => void;
}

export function ChatWallpaperView({ chat, wallpapers, onBack, onWallpaperChange }: ChatWallpaperViewProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Wallpaper View Header */}
      <div className="p-4 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-gray-100">Wallpaper</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase">Customize your chat</p>
        </div>
      </div>

      {/* Wallpaper Grid */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        <div className="grid grid-cols-2 gap-3">
          {wallpapers.map((wp) => (
            <button 
              key={wp.id}
              onClick={() => onWallpaperChange?.(wp.url)}
              className={cn(
                "group relative aspect-[9/16] rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.02]",
                chat.wallpaper === wp.url 
                  ? "border-blue-500 ring-2 ring-blue-500/20" 
                  : "border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              )}
            >
              {wp.url ? (
                <img src={wp.url} alt={wp.label} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-[10px] font-bold text-white uppercase truncate">{wp.label}</p>
              </div>
              {chat.wallpaper === wp.url && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
