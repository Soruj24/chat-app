"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { socketService } from "@/lib/socket/socket-client";

export function useOnlineStatus() {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [userLastSeen, setUserLastSeen] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleUsersOnline = ({ users }: { users: string[] }) => {
      setOnlineUsers(users);
    };

    const handleUserOnline = ({ userId, status }: { userId: string; status: string }) => {
      if (status === "online") {
        setOnlineUsers(prev => prev.includes(userId) ? prev : [...prev, userId]);
      } else {
        setOnlineUsers(prev => prev.filter(id => id !== userId));
      }
    };

    const handleLastSeen = ({ userId, lastSeen }: { userId: string; lastSeen: string }) => {
      setUserLastSeen(prev => ({ ...prev, [userId]: lastSeen }));
    };

    socketService.on("users-online", handleUsersOnline);
    socketService.on("user-online", handleUserOnline);
    socketService.on("last-seen", handleLastSeen);

    // Request current online users
    socketService.emit("get-online-users", {});

    return () => {
      socketService.off("users-online", handleUsersOnline);
      socketService.off("user-online", handleUserOnline);
      socketService.off("last-seen", handleLastSeen);
    };
  }, []);

  const isOnline = (userId: string) => onlineUsers.includes(userId);

  const getLastSeen = (userId: string) => {
    const lastSeen = userLastSeen[userId];
    if (!lastSeen) return null;
    
    const date = new Date(lastSeen);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return { onlineUsers, isOnline, getLastSeen };
}

// Online status badge component
export function OnlineStatusBadge({ userId, showLastSeen = true }: { userId: string; showLastSeen?: boolean }) {
  const { isOnline, getLastSeen } = useOnlineStatus();
  const online = isOnline(userId);
  const lastSeen = getLastSeen(userId);

  return (
    <span className="flex items-center gap-1.5 text-xs">
      {online ? (
        <span className="flex items-center gap-1 text-green-500">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          Online
        </span>
      ) : showLastSeen && lastSeen ? (
        <span className="text-gray-400">Last seen {lastSeen}</span>
      ) : null}
    </span>
  );
}