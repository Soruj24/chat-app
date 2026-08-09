"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface MessageLikeAnimationProps {
  showHeart: boolean;
}

export function MessageLikeAnimation({ showHeart }: MessageLikeAnimationProps) {
  return (
    <AnimatePresence>
      {showHeart && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", damping: 10, stiffness: 200 }}
          className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <Heart className="w-14 h-14 text-red-500 fill-red-500 drop-shadow-lg" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
