"use client";

import { Download } from "lucide-react";
import Image from "next/image";

interface ImageMessageProps {
  url: string;
  onClick?: () => void;
}

export function ImageMessage({ url, onClick }: ImageMessageProps) {
  return (
    <div className="p-1 relative group/image">
      <div className="relative w-full max-w-[300px] h-60 overflow-hidden rounded-xl">
        <Image
          src={url}
          alt="Message content"
          fill
          unoptimized
          className="object-cover cursor-pointer hover:opacity-95 transition-opacity"
          onClick={onClick}
          sizes="(max-width: 768px) 100vw, 300px"
        />
      </div>
      <a 
        href={url} 
        download 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md text-white rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-black/70"
        onClick={(e) => e.stopPropagation()}
      >
        <Download className="w-4 h-4" />
      </a>
    </div>
  );
}
