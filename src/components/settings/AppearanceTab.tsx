"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppearanceTabProps {
  settings: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
  };
  onChange: (settings: Partial<AppearanceTabProps["settings"]>) => void;
}

export function AppearanceTab({ settings, onChange }: AppearanceTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Theme</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "light", icon: Sun, label: "Light" },
            { id: "dark", icon: Moon, label: "Dark" },
            { id: "system", icon: Monitor, label: "System" },
          ].map((theme) => {
            const Icon = theme.icon;
            const isActive = settings.theme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => onChange({ theme: theme.id as any })}
                className={cn(
                  "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                  isActive 
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" 
                    : "border-transparent bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive ? "text-blue-600" : "text-gray-600 dark:text-gray-300")} />
                <span className={cn("text-xs font-bold", isActive ? "text-blue-600" : "text-gray-900 dark:text-gray-100")}>
                  {theme.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Chat Font Size</h3>
        <div className="px-2">
          <input 
            type="range" 
            min="0"
            max="2"
            step="1"
            value={settings.fontSize === 'small' ? 0 : settings.fontSize === 'medium' ? 1 : 2}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              const size = val === 0 ? 'small' : val === 1 ? 'medium' : 'large';
              onChange({ fontSize: size });
            }}
            className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600" 
          />
        </div>
        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-tighter px-1">
          <span className={cn(settings.fontSize === 'small' && "text-blue-600")}>Small</span>
          <span className={cn(settings.fontSize === 'medium' && "text-blue-600")}>Medium</span>
          <span className={cn(settings.fontSize === 'large' && "text-blue-600")}>Large</span>
        </div>
      </div>
    </div>
  );
}
