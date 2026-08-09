"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";
import { spring, fadeScale } from "@/lib/animations";

interface LightboxProps {
  url: string | null;
  onClose: () => void;
}

export function Lightbox({ url, onClose }: LightboxProps) {
  const [scale, setScale] = useState(1);

  if (!url) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={fadeScale}
        transition={spring.gentle}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 md:p-8"
        onClick={onClose}
      >
        {/* Top controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setScale((s) => Math.min(s + 0.25, 3));
            }}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors backdrop-blur-md"
          >
            <ZoomIn className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setScale((s) => Math.max(s - 0.25, 0.5));
            }}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors backdrop-blur-md"
          >
            <ZoomOut className="w-5 h-5" />
          </motion.button>
          <motion.a
            href={url}
            download
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Download className="w-5 h-5" />
          </motion.a>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <motion.img
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={spring.smooth}
          src={url}
          alt="Preview"
          className="max-w-full max-h-[85vh] object-contain rounded-xl"
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    </AnimatePresence>
  );
}
