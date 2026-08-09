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
    <div className="px-3 py-2">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors duration-200" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search conversations..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full h-9 pl-9 pr-16 rounded-[var(--radius-ds)] text-sm",
            "bg-[var(--muted)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]",
            "border border-transparent",
            "focus:outline-none focus:border-[var(--primary)]/30 focus:bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)]/10",
            "transition-all duration-200"
          )}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value ? (
            <button
              onClick={onClear}
              className="p-1 rounded-[var(--radius-ds)] hover:bg-[var(--border-ds)] text-[var(--muted-foreground)] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-0.5 text-[var(--muted-foreground)]">
              <kbd className="inline-flex items-center justify-center h-5 min-w-[20px] px-1 text-[10px] font-mono font-medium bg-[var(--background)] border border-[var(--border-ds)] rounded-[var(--radius-ds)]">
                <Command className="w-2.5 h-2.5" />
              </kbd>
              <kbd className="inline-flex items-center justify-center h-5 min-w-[20px] px-1 text-[10px] font-mono font-medium bg-[var(--background)] border border-[var(--border-ds)] rounded-[var(--radius-ds)]">
                K
              </kbd>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
