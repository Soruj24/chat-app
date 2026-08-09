"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  MessageCircle,
  UserPlus,
  Heart,
  AtSign,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { spring, fadeUp, scaleIn } from "@/lib/animations";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  type: "message" | "mention" | "like" | "follow" | "system";
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  avatar?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "message",
    title: "Sarah Chen",
    body: "Hey! Are you free for a call later today?",
    timestamp: "2 min ago",
    read: false,
  },
  {
    id: "2",
    type: "mention",
    title: "Team Design",
    body: "@you mentioned in #design-review",
    timestamp: "15 min ago",
    read: false,
  },
  {
    id: "3",
    type: "like",
    title: "Alex Rivera",
    body: "Liked your message",
    timestamp: "1 hour ago",
    read: true,
  },
  {
    id: "4",
    type: "follow",
    title: "Jordan Kim",
    body: "Started following you",
    timestamp: "3 hours ago",
    read: true,
  },
  {
    id: "5",
    type: "message",
    title: "Design Team",
    body: "New file shared: Q4-Report.pdf",
    timestamp: "Yesterday",
    read: true,
  },
  {
    id: "6",
    type: "system",
    title: "Security Alert",
    body: "New login from Chrome on Windows",
    timestamp: "Yesterday",
    read: true,
  },
];

const TYPE_ICONS: Record<string, typeof MessageCircle> = {
  message: MessageCircle,
  mention: AtSign,
  like: Heart,
  follow: UserPlus,
  system: Bell,
};

const TYPE_COLORS: Record<string, string> = {
  message: "#3b82f6",
  mention: "#8b5cf6",
  like: "#ef4444",
  follow: "#10b981",
  system: "#f59e0b",
};

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filter === "unread"
    ? notifications.filter((n) => !n.read)
    : notifications;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[85]"
            onClick={onClose}
          />
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={scaleIn}
            transition={spring.gentle}
            className="fixed right-4 top-16 z-[90] w-[380px] max-h-[calc(100vh-80px)] bg-[var(--bg-elevated)] rounded-2xl shadow-2xl border border-[var(--border-default)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-5 pt-5 pb-3 border-b border-[var(--border-light)]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-[var(--accent-light)]">
                    <Bell className="w-4 h-4 text-[var(--accent)]" />
                  </div>
                  <h2 className="text-base font-bold text-[var(--fg)]">Notifications</h2>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-[var(--accent)] rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors text-[var(--fg-secondary)]"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors text-[var(--fg-tertiary)]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex gap-1">
                {(["all", "unread"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize",
                      filter === f
                        ? "bg-[var(--accent-light)] text-[var(--accent)]"
                        : "text-[var(--fg-secondary)] hover:bg-[var(--surface-hover)]"
                    )}
                  >
                    {f}
                    {f === "unread" && unreadCount > 0 && (
                      <span className="ml-1.5 text-[10px]">{unreadCount}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification list */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                  <div className="p-3 rounded-2xl bg-[var(--surface-secondary)] mb-3">
                    <Bell className="w-6 h-6 text-[var(--fg-muted)]" />
                  </div>
                  <p className="text-sm font-bold text-[var(--fg-secondary)]">
                    {filter === "unread" ? "All caught up!" : "No notifications yet"}
                  </p>
                  <p className="text-xs text-[var(--fg-tertiary)] mt-1">
                    {filter === "unread"
                      ? "You've read all your notifications"
                      : "When you get notifications, they'll show up here"}
                  </p>
                </div>
              ) : (
                <div className="py-1">
                  {filtered.map((notification, i) => {
                    const Icon = TYPE_ICONS[notification.type] || Bell;
                    const color = TYPE_COLORS[notification.type] || "var(--accent)";

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => markRead(notification.id)}
                        className={cn(
                          "flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-colors group",
                          !notification.read && "bg-[var(--accent-light)]/30",
                          "hover:bg-[var(--surface-hover)]"
                        )}
                      >
                        {/* Icon */}
                        <div
                          className="p-2 rounded-xl shrink-0 mt-0.5"
                          style={{ backgroundColor: `${color}15` }}
                        >
                          <Icon className="w-4 h-4" style={{ color }} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={cn(
                              "text-sm truncate",
                              !notification.read ? "font-bold text-[var(--fg)]" : "font-medium text-[var(--fg-secondary)]"
                            )}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-[var(--fg-tertiary)] truncate mt-0.5">
                            {notification.body}
                          </p>
                          <p className="text-[10px] text-[var(--fg-muted)] mt-1 font-medium">
                            {notification.timestamp}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="p-1 rounded-lg hover:bg-[var(--surface-active)] transition-colors text-[var(--fg-muted)]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-[var(--border-light)] flex items-center justify-between">
              <button className="text-xs font-bold text-[var(--fg-secondary)] hover:text-[var(--fg)] transition-colors flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5" />
                Notification Settings
              </button>
              <button
                onClick={markAllRead}
                className="text-xs font-bold text-[var(--accent)] hover:opacity-80 transition-opacity"
              >
                Mark all read
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
