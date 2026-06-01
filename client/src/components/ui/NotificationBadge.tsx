"use client";

import { Bell, MessageSquare, Users, Heart } from "lucide-react";

interface NotificationBadgeProps {
  count: number;
  type?: "bell" | "messages" | "users" | "heart";
  maxCount?: number;
  className?: string;
  onClick?: () => void;
}

export function NotificationBadge({ 
  count, 
  type = "bell", 
  maxCount = 99,
  className = "",
  onClick
}: NotificationBadgeProps) {
  const icons = {
    bell: Bell,
    messages: MessageSquare,
    users: Users,
    heart: Heart,
  };

  const Icon = icons[type];

  if (count <= 0) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count;

  return (
    <div 
      className={`relative inline-flex ${className}`}
      onClick={onClick}
    >
      <Icon className="w-5 h-5" />
      <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full animate-in zoom-in-95">
        {displayCount}
      </span>
    </div>
  );
}

interface ChatBadgeProps {
  unreadCount?: number;
  isPinned?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
}

export function ChatBadge({ unreadCount, isPinned, isMuted, isArchived }: ChatBadgeProps) {
  return (
    <div className="flex items-center gap-1">
      {isPinned && (
        <span className="text-xs text-blue-500" title="Pinned">
          📌
        </span>
      )}
      {isMuted && (
        <span className="text-xs text-gray-400" title="Muted">
          🔕
        </span>
      )}
      {isArchived && (
        <span className="text-xs text-gray-400" title="Archived">
          🗄️
        </span>
      )}
      {unreadCount && unreadCount > 0 && (
        <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[11px] font-bold text-white bg-blue-500 rounded-full">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </div>
  );
}

interface OnlineIndicatorProps {
  status: "online" | "offline" | "typing" | "last-seen";
  showLabel?: boolean;
}

export function OnlineIndicator({ status, showLabel = false }: OnlineIndicatorProps) {
  const statusConfig = {
    online: { color: "bg-green-500", label: "Online" },
    offline: { color: "bg-gray-400", label: "Offline" },
    typing: { color: "bg-blue-500", label: "Typing..." },
    "last-seen": { color: "bg-gray-400", label: "Last seen recently" },
  };

  const { color, label } = statusConfig[status];

  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2.5 h-2.5 rounded-full ${color} ${status === "typing" ? "animate-pulse" : ""}`} />
      {showLabel && <span className="text-xs text-gray-500">{label}</span>}
    </div>
  );
}