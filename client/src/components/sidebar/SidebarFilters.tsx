"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SidebarFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: "all" | "unread" | "groups" | "archived") => void;
}

const filters = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "groups", label: "Groups" },
  { id: "archived", label: "Archived" },
] as const;

export function SidebarFilters({ activeFilter, onFilterChange }: SidebarFiltersProps) {
  return (
    <div className="px-3 pb-2">
      <div className="flex items-center gap-1 p-1 bg-[var(--muted)] rounded-[var(--radius-ds)]">
        {filters.map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onFilterChange(f.id)}
              className={cn(
                "relative flex-1 px-3 py-1.5 rounded-[var(--radius-ds)] text-xs font-medium transition-colors duration-200",
                isActive
                  ? "text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-filter"
                  className="absolute inset-0 bg-[var(--background)] rounded-[var(--radius-ds)] shadow-[var(--shadow-sm)]"
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                />
              )}
              <span className="relative z-10">{f.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
