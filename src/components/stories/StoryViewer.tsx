"use client";

import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Story } from "@/lib/types";
import Image from "next/image";
import { StoryProgressBar } from "./StoryProgressBar";

interface StoryViewerProps {
  selectedStory: Story | null;
  currentIndex: number;
  stories: Story[];
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function StoryViewer({
  selectedStory,
  currentIndex,
  stories,
  onClose,
  onNext,
  onPrev,
}: StoryViewerProps) {
  if (!selectedStory) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      >
        <StoryProgressBar stories={stories} currentIndex={currentIndex} />

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-[110]">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 shrink-0">
              <Image 
                src={selectedStory.userAvatar} 
                alt={selectedStory.userName} 
                fill 
                unoptimized 
                className="rounded-full border-2 border-white object-cover" 
              />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">{selectedStory.userName}</h3>
              <p className="text-white/60 text-xs">{selectedStory.timestamp}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Media Content */}
        <div className="relative w-full max-w-[500px] aspect-[9/16] flex items-center justify-center">
          <Image 
            src={selectedStory.mediaUrl} 
            alt="Story" 
            fill
            unoptimized
            className="object-cover rounded-xl shadow-2xl"
          />
          
          {/* Navigation Controls */}
          <button 
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-[-60px] top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors hidden md:flex"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-[-60px] top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors hidden md:flex"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Click zones for mobile */}
          <div className="absolute inset-0 flex md:hidden">
            <div className="w-1/3 h-full" onClick={onPrev} />
            <div className="w-2/3 h-full" onClick={onNext} />
          </div>
        </div>

        {/* Reply Input */}
        <div className="absolute bottom-8 left-4 right-4 flex gap-3 max-w-[500px] mx-auto z-[110]">
          <input 
            type="text" 
            placeholder="Send a reply..." 
            className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
