"use client";

import Image from "next/image";
import { MessageSquare } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addChat, setActiveChat } from "@/store/slices/chatSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User as UserType } from "@/lib/types";
import { cn, getUserColor } from "@/lib/utils";

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
        const chatId = chatData._id || chatData.id;
        const participants = chatData.participants || [];
        const otherParticipant = participants.find(
          (p: UserType) => p._id !== currentUser?.id && p.id !== currentUser?.id
        );

        const mappedChat = {
          id: chatId,
          name: otherParticipant?.name || otherParticipant?.username || user.name,
          avatar: otherParticipant?.avatar || user.avatar,
          type: chatData.type,
          lastMessage: chatData.lastMessage,
          unreadCount: 0,
          otherParticipantId: otherParticipant?._id || otherParticipant?.id,
        };

        dispatch(addChat(mappedChat));
        dispatch(setActiveChat(mappedChat.id));
        if (mappedChat.id) {
          router.push(`/chat/${mappedChat.id}`);
        }
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
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl cursor-pointer transition-all duration-150 group",
        "hover:bg-[var(--sidebar-hover)]"
      )}
    >
      <div className="relative w-10 h-10 shrink-0">
        {user.avatar && user.avatar.trim() ? (
          <Image
            src={user.avatar}
            alt={user.name || "User avatar"}
            fill
            unoptimized
            className="rounded-full object-cover"
          />
        ) : (
          <div
            className={cn(
              "w-full h-full rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br",
              getUserColor(user.name)
            )}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-[var(--sidebar-text)] truncate">
          {user.name}
        </h4>
        <p className="text-xs text-[var(--sidebar-text-secondary)] truncate">
          @{user.username}
        </p>
      </div>
      <MessageSquare className="w-4 h-4 text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </div>
  );
}
