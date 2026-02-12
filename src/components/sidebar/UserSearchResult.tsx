"use client";

import Image from "next/image";
import { User, MessageSquare } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addChat, setActiveChat } from "@/store/slices/chatSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { User as UserType } from "@/lib/types";

interface UserSearchResultProps {
  user: UserType;
}

export function UserSearchResult({ user }: UserSearchResultProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, user: currentUser } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);

  const handleStartChat = async () => {
    if (!token || loading) return;

    setLoading(true);
    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          participantId: user.id,
          type: "private",
        }),
      });

      if (response.ok) {
        const chatData = await response.json();
        
        // Find other participant to get the correct name/avatar
        const otherParticipant = chatData.participants.find((p: UserType) => p._id !== currentUser?.id);
        
        const mappedChat = {
          id: chatData._id,
          name: otherParticipant?.name || user.name,
          avatar: otherParticipant?.avatar || user.avatar,
          type: chatData.type,
          lastMessage: chatData.lastMessage,
          unreadCount: 0,
          otherParticipantId: otherParticipant?._id
        };

        // Add to local chats if not already there and set active
        dispatch(addChat(mappedChat));
        dispatch(setActiveChat(mappedChat.id));
        router.push(`/chat/${mappedChat.id}`);
      }
    } catch (error) {
      console.error("Failed to start chat:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleStartChat}
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors group"
    >
      <div className="relative w-10 h-10 shrink-0">
        <Image
          src={user.avatar || "https://ui-avatars.com/api/?name=" + user.name}
          alt={user.name}
          fill
          unoptimized
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
            {user.name}
          </h4>
          <MessageSquare className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-xs text-gray-500 truncate">@{user.username}</p>
      </div>
    </div>
  );
}
