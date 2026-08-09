"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, WifiOff, Search, Phone, Info, MoreVertical, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { initiateCall } from "@/store/slices/callSlice";
import { OnlineIndicator } from "@/components/chat/message/OnlineIndicator";
import { motion } from "framer-motion";
import { spring } from "@/lib/animations";

interface ChatHeaderProps {
  chat: {
    id: string;
    type: "private" | "group" | "individual";
    otherParticipantId?: string;
    name: string;
    avatar: string;
    themeColor?: string;
  };
  isOnline: boolean;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  setShowInfo: (show: boolean) => void;
}

export function ChatHeader({ chat, isOnline, isSearchOpen, setIsSearchOpen, setShowInfo }: ChatHeaderProps) {
  const dispatch = useDispatch();

  const handleCall = (type: "audio" | "video") => {
    const receiverId =
      chat.type === "private" || chat.type === "individual"
        ? chat.otherParticipantId
        : chat.id;

    if (!receiverId) return;

    dispatch(
      initiateCall({
        user: { id: receiverId, name: chat.name, avatar: chat.avatar },
        type,
      })
    );
  };

  return (
    <header className="sticky top-0 bg-[var(--glass-bg-heavy)] backdrop-blur-[var(--glass-blur)] saturate-[var(--glass-saturate)] border-b border-[var(--border-default)] px-3 py-2.5 flex items-center justify-between z-20 shadow-[var(--shadow-xs)]">
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Back button (mobile) */}
        <Link
          href="/"
          className="md:hidden p-1.5 hover:bg-[var(--surface-hover)] rounded-[var(--radius-lg)] transition-all duration-200 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 text-[var(--fg-secondary)]" />
        </Link>

        {/* Avatar */}
        <div className="relative w-10 h-10 shrink-0">
          {chat.avatar && chat.avatar.trim() ? (
            <Image
              src={chat.avatar}
              alt={chat.name}
              fill
              unoptimized
              className="rounded-[var(--radius-xl)] object-cover shadow-[var(--shadow-sm)]"
            />
          ) : (
            <div className="w-full h-full rounded-[var(--radius-xl)] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-[var(--shadow-sm)]">
              {chat.name.charAt(0).toUpperCase()}
            </div>
          )}
          {isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5">
              <OnlineIndicator isOnline={true} size="md" themeColor={chat.themeColor} />
            </div>
          )}
        </div>

        {/* Name & status */}
        <div
          className="min-w-0 cursor-pointer hover:opacity-80 transition-opacity duration-200"
          onClick={() => setShowInfo(true)}
        >
          <h2 className="font-semibold text-sm text-[var(--fg)] truncate leading-tight">
            {chat.name}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            {chat.type === "group" ? (
              <p className="text-[11px] text-[var(--fg-tertiary)]">Group</p>
            ) : (
              <>
                {!isOnline && <WifiOff className="w-3 h-3 text-[var(--fg-tertiary)]" />}
                <p
                  className={cn(
                    "text-[11px] font-medium",
                    isOnline ? "text-[var(--success)]" : "text-[var(--fg-tertiary)]"
                  )}
                >
                  {isOnline ? "Online" : "Offline"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-0.5">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          transition={spring.gentle}
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className={cn(
            "p-2 rounded-[var(--radius-lg)] transition-all duration-200",
            isSearchOpen
              ? "bg-[var(--accent-light)] text-[var(--accent)]"
              : "text-[var(--fg-tertiary)] hover:bg-[var(--surface-hover)] hover:text-[var(--fg)]"
          )}
        >
          <Search className="w-[18px] h-[18px]" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          transition={spring.gentle}
          onClick={() => handleCall("audio")}
          className="p-2 rounded-[var(--radius-lg)] text-[var(--fg-tertiary)] hover:bg-[var(--surface-hover)] hover:text-[var(--fg)] transition-all duration-200"
        >
          <Phone className="w-[18px] h-[18px]" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          transition={spring.gentle}
          onClick={() => handleCall("video")}
          className="p-2 rounded-[var(--radius-lg)] text-[var(--fg-tertiary)] hover:bg-[var(--surface-hover)] hover:text-[var(--fg)] transition-all duration-200"
        >
          <Video className="w-[18px] h-[18px]" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          transition={spring.gentle}
          className="p-2 rounded-[var(--radius-lg)] text-[var(--fg-tertiary)] hover:bg-[var(--surface-hover)] hover:text-[var(--fg)] transition-all duration-200"
          onClick={() => setShowInfo(true)}
        >
          <Info className="w-[18px] h-[18px]" />
        </motion.button>
      </div>
    </header>
  );
}
