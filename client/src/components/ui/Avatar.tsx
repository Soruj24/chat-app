"use client";

import Image from "next/image";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
  fill?: boolean;
  status?: "online" | "offline" | "typing";
}

export function Avatar({ src, alt = "", fallback, className = "", fill = false, status }: AvatarProps) {
  const hasValidSrc = src && src.trim() !== "" && src.trim() !== "null" && src.trim() !== "undefined";

  return (
    <div className={`relative ${className}`}>
      {hasValidSrc ? (
        fill ? (
          <Image
            src={src}
            alt={alt}
            fill
            unoptimized
            className="rounded-[var(--radius-xl)] object-cover shadow-[var(--shadow-xs)]"
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={48}
            height={48}
            unoptimized
            className="rounded-[var(--radius-xl)] object-cover shadow-[var(--shadow-xs)]"
          />
        )
      ) : (
        <div className="w-full h-full rounded-[var(--radius-xl)] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-[var(--shadow-sm)]">
          {fallback || "??"}
        </div>
      )}
      {status && (
        <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-[var(--radius-full)] border-2 border-[var(--bg-elevated)] ${
          status === "online" ? "bg-[var(--success)]" : status === "typing" ? "bg-[var(--accent)] animate-pulse" : "bg-[var(--fg-muted)]"
        }`} />
      )}
    </div>
  );
}