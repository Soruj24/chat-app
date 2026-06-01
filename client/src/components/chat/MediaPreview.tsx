"use client";

import { useState } from "react";
import { X, Download, Share2, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface MediaPreviewProps {
  src: string;
  type: "image" | "video" | "audio";
  alt?: string;
  onClose: () => void;
}

export function MediaPreview({ src, type, alt = "Media", onClose }: MediaPreviewProps) {
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {type === "image" && (
        <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            unoptimized
          />
        </div>
      )}

      {type === "video" && (
        <video
          src={src}
          controls
          className="max-w-[90vw] max-h-[90vh] rounded-lg"
          autoPlay
        />
      )}

      {type === "audio" && (
        <div className="bg-gray-800 p-6 rounded-xl" onClick={(e) => e.stopPropagation()}>
          <audio src={src} controls className="w-[300px]" autoPlay />
        </div>
      )}
    </div>
  );
}

interface ImageGalleryProps {
  images: Array<{ src: string; alt?: string }>;
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) return null;

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative">
      <div 
        className="relative h-64 w-full rounded-lg overflow-hidden cursor-pointer"
        onClick={() => setSelectedIndex(selectedIndex)}
      >
        <Image
          src={images[selectedIndex].src}
          alt={images[selectedIndex].alt || "Gallery image"}
          fill
          className="object-cover"
          unoptimized
        />
        
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-1 mt-2 overflow-x-auto py-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`w-16 h-12 rounded overflow-hidden flex-shrink-0 transition-opacity ${
                idx === selectedIndex ? "ring-2 ring-blue-500 opacity-100" : "opacity-50"
              }`}
            >
              <Image src={img.src} alt={img.alt || ""} fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}