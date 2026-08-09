"use client";

import { cn } from "@/lib/utils";
import { Clock, AlertCircle, Check, CheckCheck } from "lucide-react";

interface MessageStatusProps {
  status: "sent" | "delivered" | "read" | "sending" | "error";
  className?: string;
  size?: number;
}

export function MessageStatus({ status, className, size = 14 }: MessageStatusProps) {
  const iconSize = Math.max(10, size * 0.7);

  if (status === "sending") {
    return (
      <span className="relative flex items-center justify-center" style={{ width: iconSize, height: iconSize }}>
        <span className="absolute inset-0 rounded-full border border-current opacity-30" style={{ borderWidth: 1.5 }} />
        <Clock className="animate-spin text-current opacity-60" style={{ width: iconSize * 0.6, height: iconSize * 0.6, animationDuration: "1.2s" }} />
      </span>
    );
  }

  if (status === "error") {
    return (
      <span className="relative flex items-center justify-center text-red-400" style={{ width: iconSize, height: iconSize }}>
        <AlertCircle style={{ width: iconSize, height: iconSize }} />
      </span>
    );
  }

  if (status === "sent") {
    return <Check className="text-current opacity-50" style={{ width: iconSize, height: iconSize }} />;
  }

  if (status === "delivered") {
    return <CheckCheck className="text-current opacity-50" style={{ width: iconSize, height: iconSize }} />;
  }

  return <CheckCheck className="text-emerald-400" style={{ width: iconSize, height: iconSize }} />;
}
