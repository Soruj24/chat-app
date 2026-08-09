"use client";

import { useDesignSystem } from "@/components/ThemeProvider";
import { Sun, Moon, Monitor, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { designTheme, setDesignTheme } = useDesignSystem();

  const options = [
    { id: "light" as const, icon: Sun, label: "Light" },
    { id: "dark" as const, icon: Moon, label: "Dark" },
    { id: "midnight" as const, icon: Moon, label: "Midnight" },
    { id: "glass" as const, icon: Sparkles, label: "Glass" },
  ];

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {options.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setDesignTheme(id)}
          className={cn(
            "p-2 rounded-lg transition-all duration-200",
            designTheme === id
              ? "bg-[var(--accent-light)] text-[var(--accent)]"
              : "text-[var(--fg-tertiary)] hover:bg-[var(--surface-hover)] hover:text-[var(--fg-secondary)]"
          )}
          title={label}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
