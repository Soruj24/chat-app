export type UserStatus = "online" | "offline" | "typing" | "last seen recently";

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: UserStatus;
  phoneNumber?: string;
  username?: string;
  bio?: string;
  lastSeen?: string;
  settings?: UserSettings;
}

export interface UserSettings {
  theme: "light" | "dark" | "system";
  notifications: boolean;
  readReceipts: boolean;
  lastSeen: boolean;
  twoFactorAuth: boolean;
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  mediaUrl: string;
  type: "image" | "video";
  timestamp: string;
  isRead: boolean;
}

export type MessageType = "text" | "image" | "file" | "voice";

export interface Message {
  id: string;
  senderId: string;
  senderName?: string; // For group chats
  text?: string;
  timestamp: string;
  date: string;
  status: "sent" | "delivered" | "read" | "sending" | "error";
  isMe: boolean;
  type: MessageType;
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  duration?: string;
  replyTo?: {
    id: string;
    text?: string;
    senderName: string;
  };
  isForwarded?: boolean;
  isStarred?: boolean;
  isPinned?: boolean;
  reactions?: {
    emoji: string;
    count: number;
    me: boolean;
  }[];
}

export interface Chat {
  id: string;
  type: "individual" | "group" | "private"; // Added private
  otherParticipantId?: string; // Added this
  name: string;
  avatar: string;
  lastMessage?: {
    text: string;
    timestamp: string;
    senderId: string;
    status?: "sent" | "delivered" | "read";
  };
  unreadCount: number;
  members?: User[];
  description?: string;
  isMuted?: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
  status?: UserStatus;
  wallpaper?: string;
  themeColor?: string;
  pinnedMessageIds?: string[];
}
