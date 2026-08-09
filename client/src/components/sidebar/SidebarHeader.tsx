"use client";

import Image from "next/image";
import { Settings, Edit, Sun, Moon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { NotificationBell } from "@/components/ui/NotificationBell";
import { OnlineIndicator } from "@/components/chat/message/OnlineIndicator";

interface SidebarHeaderProps {
  mounted: boolean;
  theme: string | undefined;
  setTheme: (theme: string) => void;
  onSettingsOpen: () => void;
  onNewGroupOpen: () => void;
}

export function SidebarHeader({ mounted, theme, setTheme, onSettingsOpen, onNewGroupOpen }: SidebarHeaderProps) {
  const { user } = useSelector((state: RootState) => state.auth);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 group cursor-pointer" onClick={onSettingsOpen}>
          {user?.avatar && user.avatar.trim() ? (
            <Image
              src={user.avatar}
              alt={user.name || "User"}
              fill
              unoptimized
              className="rounded-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-105">
              {initials}
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5">
            <OnlineIndicator isOnline={true} size="sm" />
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-none mb-1">
            {user?.username || "Guest User"}
          </h1>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">Online</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-0.5">
        <NotificationBell />
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-150 text-gray-400 dark:text-gray-500"
          title="Toggle theme"
        >
          {!mounted ? (
            <div className="w-5 h-5" />
          ) : theme === "dark" ? (
            <Sun className="w-4.5 h-4.5" />
          ) : (
            <Moon className="w-4.5 h-4.5" />
          )}
        </button>
        <button
          onClick={onSettingsOpen}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-150 text-gray-400 dark:text-gray-500"
        >
          <Settings className="w-4.5 h-4.5" />
        </button>
        <button
          onClick={onNewGroupOpen}
          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-150 active:scale-95 shadow-sm shadow-blue-500/20"
        >
          <Edit className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
}
