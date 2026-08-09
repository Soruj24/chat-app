"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Settings, Sun, Moon, PenSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  onSettingsOpen: () => void;
  onNewGroupOpen: () => void;
}

export function SidebarHeader({ onSettingsOpen, onNewGroupOpen }: SidebarHeaderProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  return (
    <div className="px-4 py-3 flex items-center justify-between border-b border-[var(--border-ds)]">
      {/* Left: Logo + User */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onSettingsOpen}
          className="relative w-9 h-9 shrink-0 rounded-full overflow-hidden ring-2 ring-[var(--border-ds)] hover:ring-[var(--primary)] transition-all duration-200"
        >
          {user?.avatar && user.avatar.trim() ? (
            <img src={user.avatar} alt={user.name || "User"} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs">
              {initials}
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[var(--success)] rounded-full border-2 border-[var(--background)]" />
        </button>
        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-[var(--foreground)] truncate leading-tight">
            {user?.name || user?.username || "Guest"}
          </h1>
          <p className="text-[11px] text-[var(--muted-foreground)] truncate">
            @{user?.username || "user"}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-[var(--radius-ds)] hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-all duration-200"
          title="Toggle theme"
        >
          {!mounted ? <div className="w-4 h-4" /> : theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button
          onClick={onSettingsOpen}
          className="p-2 rounded-[var(--radius-ds)] hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-all duration-200"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
        <button
          onClick={onNewGroupOpen}
          className="p-2 rounded-[var(--radius-ds)] bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] transition-all duration-200 shadow-[var(--shadow-sm)]"
          title="New conversation"
        >
          <PenSquare className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
