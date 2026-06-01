"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Phone, Video, Search } from "lucide-react";

import { User } from "@/lib/types";

interface ProfileCardProps {
  user: User;
}

interface ProfileCardProps {
  user: User;
  isOwnProfile?: boolean;
  onEditAvatar?: () => void;
}

export function ProfileCard({ user, isOwnProfile, onEditAvatar }: ProfileCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#ffffff] dark:bg-[#0f0f0f] rounded-2xl overflow-hidden"
    >
      <div className="px-8 py-8 flex flex-col items-center text-center relative">
        <button 
          onClick={onEditAvatar}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#effdde] dark:bg-[#2b4a40] hover:opacity-80 transition-opacity"
        >
          <svg className="w-4 h-4 text-[#34c759]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        
        <div className="relative w-28 h-28 mb-4 group">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              fill
              unoptimized
              className="rounded-full object-cover border-2 border-[#e6e8ec]"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#28a8e8] to-[#0ba4e8] flex items-center justify-center text-white text-3xl font-medium border-2 border-[#e6e8ec]">
              {(user.name || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-xl font-bold text-[#000000] dark:text-[#ffffff]">{user.name}</h1>
        {user.username && (
          <p className="text-sm text-[#8e8e93]">@{user.username}</p>
        )}
        <p className="text-[#34c759] font-medium">{user.status}</p>
      </div>

      <div className="flex border-t border-[#e6e8ec] dark:border-[#2b3142]">
        <button className="flex-1 py-4 flex flex-col items-center gap-1 hover:bg-[#f5f5f5] dark:hover:bg-[#18222d] transition-colors border-r border-[#e6e8ec] dark:border-[#2b3142]">
          <Phone className="w-5 h-5 text-[#28a8e8]" />
          <span className="text-xs font-medium text-[#8e8e93]">Audio</span>
        </button>
        <button className="flex-1 py-4 flex flex-col items-center gap-1 hover:bg-[#f5f5f5] dark:hover:bg-[#18222d] transition-colors border-r border-[#e6e8ec] dark:border-[#2b3142]">
          <Video className="w-5 h-5 text-[#28a8e8]" />
          <span className="text-xs font-medium text-[#8e8e93]">Video</span>
        </button>
        <button className="flex-1 py-4 flex flex-col items-center gap-1 hover:bg-[#f5f5f5] dark:hover:bg-[#18222d] transition-colors">
          <Search className="w-5 h-5 text-[#28a8e8]" />
          <span className="text-xs font-medium text-[#8e8e93]">Search</span>
        </button>
      </div>
    </motion.div>
  );
}
