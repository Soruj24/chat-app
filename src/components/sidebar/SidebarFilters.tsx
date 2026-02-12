"use client";

import { cn } from "@/lib/utils";

interface SidebarFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: "all" | "unread" | "groups" | "archived") => void;
}

export function SidebarFilters({ activeFilter, onFilterChange }: SidebarFiltersProps) {
  const filters = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "groups", label: "Groups" },
    { id: "archived", label: "Archived" },
  ] as const;

  return (
    <div className="flex items-center gap-1.5 animate-in fade-in duration-300 overflow-x-auto no-scrollbar pb-1">
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => onFilterChange(f.id)}
          className={cn(
            "px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap",
            activeFilter === f.id 
              ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20" 
              : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
