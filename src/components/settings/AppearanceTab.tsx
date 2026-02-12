"use client";

import { Sun, Moon, Monitor } from "lucide-react";

export function AppearanceTab() {
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
            return (
              <button
                key={theme.id}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-transparent bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{theme.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Chat Font Size</h3>
        <input type="range" className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600" />
        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
          <span>Small</span>
          <span>Medium</span>
          <span>Large</span>
        </div>
      </div>
    </div>
  );
}
