"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
    <div className="flex items-center gap-1 px-3 pb-3">
      {filters.map((f) => {
        const isActive = activeFilter === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={cn(
              "relative px-3 py-1.5 rounded-[var(--radius-lg)] text-[11px] font-semibold transition-all duration-200 whitespace-nowrap",
              isActive
                ? "text-[var(--color-primary)]"
                : "text-[var(--sidebar-text-secondary)] hover:text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)]"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="sidebar-filter-pill"
                className="absolute inset-0 rounded-[var(--radius-lg)] bg-[var(--color-primary)]/10 shadow-[var(--shadow-xs)]"
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              />
            )}
            <span className="relative z-10">{f.label}</span>
          </button>
        );
      })}
    </div>
  );
}
