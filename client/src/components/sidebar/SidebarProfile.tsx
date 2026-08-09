"use client";

import Image from "next/image";
import { Settings, Sun, Moon, LogOut, Edit3 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { logout } from "@/store/slices/authSlice";
import { OnlineIndicator } from "@/components/chat/message/OnlineIndicator";
import { NotificationBell } from "@/components/ui/NotificationBell";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface SidebarProfileProps {
  onSettingsOpen: () => void;
  onNewGroupOpen: () => void;
}

export function SidebarProfile({ onSettingsOpen, onNewGroupOpen }: SidebarProfileProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <div className="px-3 py-3 border-b border-[var(--sidebar-border)] bg-[var(--sidebar-bg)]">
      <div className="flex items-center justify-between">
        {/* Left: User info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSettingsOpen}
            className="relative w-10 h-10 shrink-0 rounded-[var(--radius-xl)] overflow-hidden ring-2 ring-[var(--border-default)] hover:ring-[var(--accent)] transition-all duration-200 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-glow)]"
          >
            {user?.avatar && user.avatar.trim() ? (
              <Image
                src={user.avatar}
                alt={user.name || "User"}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                {initials}
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5">
              <OnlineIndicator isOnline={true} size="sm" />
            </div>
          </motion.button>

          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-[var(--sidebar-text)] truncate leading-tight">
              {user?.name || user?.username || "Guest User"}
            </h2>
            <p className="text-[11px] text-[var(--sidebar-text-muted)] truncate mt-0.5">
              {user?.username ? `@${user.username}` : "Online"}
            </p>
          </div>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-0.5 shrink-0">
          <NotificationBell />

          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-[var(--radius-lg)] hover:bg-[var(--sidebar-hover)] transition-all duration-200 text-[var(--sidebar-text-secondary)] hover:text-[var(--sidebar-text)]"
            title="Toggle theme"
          >
            {!mounted ? (
              <div className="w-4 h-4" />
            ) : theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onSettingsOpen}
            className="p-2 rounded-[var(--radius-lg)] hover:bg-[var(--sidebar-hover)] transition-all duration-200 text-[var(--sidebar-text-secondary)] hover:text-[var(--sidebar-text)]"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewGroupOpen}
            className="p-2 rounded-[var(--radius-lg)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white transition-all duration-200 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-glow)]"
            title="New conversation"
          >
            <Edit3 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
