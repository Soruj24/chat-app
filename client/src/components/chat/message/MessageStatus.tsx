import { cn } from "@/lib/utils";
import { Clock, AlertCircle, Check, CheckCheck } from "lucide-react";

interface MessageStatusProps {
  status: "sent" | "delivered" | "read" | "sending" | "error";
  className?: string;
  size?: number;
}

export function MessageStatus({ status, className, size = 14 }: MessageStatusProps) {
  const iconSize = Math.max(10, size * 0.6);
  const smallIconSize = Math.max(8, size * 0.5);
  
  if (status === "sending") {
    return <Clock className={cn("w-3 h-3 animate-spin text-white/50", className)} style={{ animationDuration: '1s' }} />;
  }

  if (status === "error") {
    return <AlertCircle className={cn("w-3.5 h-3.5 text-red-400", className)} />;
  }

  if (status === "sent") {
    return (
      <Check 
        className={cn("text-white/50", className)} 
        size={iconSize}
      />
    );
  }

  if (status === "delivered") {
    return (
      <CheckCheck 
        className={cn("text-white/50", className)} 
        size={iconSize}
      />
    );
  }

  return (
    <CheckCheck 
      className={cn("text-[#34c759]", className)} 
      size={iconSize}
    />
  );
}
