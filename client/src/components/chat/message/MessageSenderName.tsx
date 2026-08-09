"use client";

import { cn } from "@/lib/utils";

interface MessageSenderNameProps {
  name: string;
  color?: string;
}

const SENDER_COLORS = [
  "text-blue-500", "text-violet-500", "text-rose-500",
  "text-amber-500", "text-emerald-500", "text-cyan-500",
  "text-pink-500", "text-indigo-500", "text-teal-500",
];

function getSenderColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SENDER_COLORS[Math.abs(hash) % SENDER_COLORS.length];
}

export function MessageSenderName({ name, color }: MessageSenderNameProps) {
  return (
    <p
      className={cn(
        "px-3 pt-2.5 text-[11px] font-semibold tracking-wide uppercase",
        color ? "" : getSenderColor(name)
      )}
      style={color ? { color } : undefined}
    >
      {name}
    </p>
  );
}
