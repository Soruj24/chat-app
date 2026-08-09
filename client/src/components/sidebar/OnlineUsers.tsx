"use client";

import Image from "next/image";
import { User } from "@/lib/types";
import { cn, getUserColor, sanitizeAvatar } from "@/lib/utils";
import { OnlineIndicator } from "@/components/chat/message/OnlineIndicator";
import { motion } from "framer-motion";

interface OnlineUsersProps {
  users: User[];
}

export function OnlineUsers({ users }: OnlineUsersProps) {
  const onlineUsers = users.filter((u) => u.status === "online");

  if (onlineUsers.length === 0) return null;

  return (
    <div className="px-3 pb-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-[var(--radius-full)] bg-[var(--success)]" style={{ animation: 'glow-pulse 2s ease-in-out infinite' }} />
          <span className="text-[10px] font-bold text-[var(--sidebar-text-muted)] uppercase tracking-widest">
            Online
          </span>
        </div>
        <span className="text-[10px] font-medium text-[var(--sidebar-text-muted)]/60">
          {onlineUsers.length}
        </span>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {onlineUsers.slice(0, 12).map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03, type: "spring", damping: 20 }}
            className="online-user-bubble relative shrink-0"
          >
            <div className="w-10 h-10 rounded-[var(--radius-xl)] overflow-hidden ring-2 ring-[var(--success)]/20 shadow-[var(--shadow-xs)]">
              {sanitizeAvatar(user.avatar) ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={40}
                  height={40}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={cn(
                    "w-full h-full flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br",
                    getUserColor(user.name)
                  )}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5">
              <OnlineIndicator isOnline={true} size="sm" />
            </div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <span className="text-[9px] font-medium text-[var(--sidebar-text-secondary)] whitespace-nowrap bg-[var(--sidebar-bg)] px-1.5 py-0.5 rounded-[var(--radius-sm)] shadow-[var(--shadow-sm)] border border-[var(--sidebar-border)]">
                {user.name.split(" ")[0]}
              </span>
            </div>
          </motion.div>
        ))}
        {onlineUsers.length > 12 && (
          <div className="w-10 h-10 rounded-[var(--radius-xl)] bg-[var(--surface-secondary)] flex items-center justify-center shrink-0 border border-[var(--border-light)]">
            <span className="text-[11px] font-bold text-[var(--sidebar-text-secondary)]">
              +{onlineUsers.length - 12}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
