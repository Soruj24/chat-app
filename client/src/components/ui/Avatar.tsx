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
            className="rounded-full object-cover"
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={48}
            height={48}
            unoptimized
            className="rounded-full object-cover"
          />
        )
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm">
          {fallback || "??"}
        </div>
      )}
      {status && (
        <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-900 ${
          status === "online" ? "bg-green-500" : status === "typing" ? "bg-blue-500 animate-pulse" : "bg-gray-400"
        }`} />
      )}
    </div>
  );
}