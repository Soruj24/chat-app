"use client";

import { motion } from "framer-motion";
import { Story } from "@/lib/types";

interface StoryProgressBarProps {
  stories: Story[];
  currentIndex: number;
}

export function StoryProgressBar({ stories, currentIndex }: StoryProgressBarProps) {
  return (
    <div className="absolute top-4 left-4 right-4 flex gap-1 z-[110]">
      {stories.map((s, idx) => (
        <div key={s.id} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: idx === currentIndex ? "100%" : idx < currentIndex ? "100%" : "0%" }}
            transition={{ duration: idx === currentIndex ? 5 : 0, ease: "linear" }}
            className="h-full bg-white"
          />
        </div>
      ))}
    </div>
  );
}
