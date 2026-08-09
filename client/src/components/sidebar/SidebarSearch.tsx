"use client";

import { Search, X, Command } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SidebarSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function SidebarSearch({ value, onChange, onClear }: SidebarSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        onClear();
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClear]);

  return (
    <div className="px-3 pb-3">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sidebar-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors duration-200" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search conversations..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full pl-10 pr-20 py-2.5 rounded-[var(--radius-xl)] text-sm font-medium",
            "bg-[var(--surface-secondary)] text-[var(--sidebar-text)] placeholder:text-[var(--sidebar-text-muted)]",
            "border border-transparent focus:border-[var(--color-primary)]/20",
            "focus:outline-none focus:bg-[var(--bg-elevated)] focus:ring-2 focus:ring-[var(--color-primary)]/10",
            "transition-all duration-200 shadow-[var(--shadow-xs)]"
          )}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {value ? (
            <button
              onClick={onClear}
              className="p-1 rounded-[var(--radius-sm)] hover:bg-[var(--sidebar-hover)] text-[var(--sidebar-text-muted)] transition-colors duration-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-0.5">
              <span className="kbd">
                <Command className="w-2.5 h-2.5" />
              </span>
              <span className="kbd">K</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
