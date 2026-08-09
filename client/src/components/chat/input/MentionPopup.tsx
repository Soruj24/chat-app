"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User } from "@/lib/types";
import { cn, getUserColor, sanitizeAvatar } from "@/lib/utils";
import Image from "next/image";

interface MentionPopupProps {
  isOpen: boolean;
  users: User[];
  query: string;
  selectedIndex: number;
  onSelect: (user: User) => void;
  position: { top: number; left: number };
}

export function MentionPopup({ isOpen, users, query, selectedIndex, onSelect, position }: MentionPopupProps) {
  const filtered = users.filter((u) =>
    (u.name || "").toLowerCase().includes(query.toLowerCase()) ||
    (u.username || "").toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  return (
    <AnimatePresence>
      {isOpen && filtered.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ type: "spring", damping: 25, stiffness: 400 }}
          className="absolute bottom-full mb-2 left-0 w-72 max-h-64 overflow-hidden rounded-2xl composer-popup z-50 flex flex-col"
        >
          <div className="px-3 py-2 border-b border-[var(--border-light)]">
            <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">
              People
            </span>
          </div>
          <div className="overflow-y-auto custom-scrollbar max-h-52 py-1">
            {filtered.map((user, index) => (
              <button
                key={user.id}
                onClick={() => onSelect(user)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 transition-all duration-100",
                  index === selectedIndex
                    ? "bg-[var(--color-primary)]/8"
                    : "hover:bg-[var(--composer-suggestion-hover)]"
                )}
              >
                <div className="relative w-8 h-8 shrink-0 rounded-full overflow-hidden">
                  {sanitizeAvatar(user.avatar) ? (
                    <Image
                      src={user.avatar}
                      alt={user.name || "User"}
                      width={32}
                      height={32}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={cn(
                        "w-full h-full flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br",
                        getUserColor(user.name || "User")
                      )}
                    >
                      {(user.name || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {user.name || "Unknown"}
                  </p>
                  {user.username && (
                    <p className="text-[11px] text-[var(--text-tertiary)] truncate">
                      @{user.username}
                    </p>
                  )}
                </div>
                {user.status === "online" && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
