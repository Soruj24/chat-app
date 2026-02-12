"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LightboxControls } from "./LightboxControls";

interface LightboxProps {
  url: string | null;
  onClose: () => void;
}

export function Lightbox({ url, onClose }: LightboxProps) {
  if (!url) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4"
        onClick={onClose}
      >
        <LightboxControls onClose={onClose} />
        
        <motion.img
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          src={url}
          alt="Preview"
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    </AnimatePresence>
  );
}
