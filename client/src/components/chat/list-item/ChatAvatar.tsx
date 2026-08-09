"use client";

import Image from "next/image";
import { cn, getUserColor } from "@/lib/utils";
import { OnlineIndicator } from "../message/OnlineIndicator";
import { UserStatus } from "@/lib/types";

interface ChatAvatarProps {
  avatar?: string;
  name: string;
  status?: UserStatus;
}

export function ChatAvatar({ avatar, name, status }: ChatAvatarProps) {
  const isOnline = status === "online";

  return (
    <div className="relative w-11 h-11 shrink-0">
      {avatar && avatar.trim() ? (
        <Image
          src={avatar}
          alt={name}
          fill
          unoptimized
          className="rounded-[var(--radius-xl)] object-cover shadow-[var(--shadow-xs)]"
        />
      ) : (
        <div
          className={cn(
            "w-full h-full rounded-[var(--radius-xl)] flex items-center justify-center text-white text-sm font-semibold bg-gradient-to-br shadow-[var(--shadow-sm)]",
            getUserColor(name)
          )}
        >
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      {isOnline && (
        <div className="absolute -bottom-0.5 -right-0.5">
          <OnlineIndicator isOnline={true} size="md" />
        </div>
      )}
    </div>
  );
}
