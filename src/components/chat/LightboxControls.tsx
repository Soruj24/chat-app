"use client";

import { X, Download, Share2 } from "lucide-react";

interface LightboxControlsProps {
  onClose: () => void;
}

export function LightboxControls({ onClose }: LightboxControlsProps) {
  return (
    <div className="absolute top-4 right-4 flex gap-4">
      <button className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
        <Download className="w-6 h-6" />
      </button>
      <button className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
        <Share2 className="w-6 h-6" />
      </button>
      <button 
        className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
}
