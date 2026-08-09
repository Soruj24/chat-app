"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ImageIcon, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileMediaProps {
  media: { id: string; url: string; type: "image" | "video"; timestamp: string }[];
}

export function ProfileMedia({ media }: ProfileMediaProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-3">
          <ImageIcon className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">No shared media yet</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Photos and videos will appear here
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-1.5">
        {media.slice(0, 9).map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => setSelectedImage(item.url)}
            className={cn(
              "relative aspect-square rounded-xl overflow-hidden group",
              "bg-gray-100 dark:bg-gray-800"
            )}
          >
            <Image
              src={item.url}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Expand className="w-5 h-5 text-white drop-shadow-lg" />
            </div>
          </motion.button>
        ))}
      </div>

      {media.length > 9 && (
        <button className="w-full mt-2 py-2 text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors">
          View all {media.length} media
        </button>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <Image
            src={selectedImage}
            alt=""
            width={800}
            height={600}
            unoptimized
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </motion.div>
      )}
    </>
  );
}
