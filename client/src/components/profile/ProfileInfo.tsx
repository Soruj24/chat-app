"use client";

import { motion } from "framer-motion";
import { Info, Phone, Mail } from "lucide-react";

import { User } from "@/lib/types";

interface ProfileInfoProps {
  user: User;
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-[#ffffff] dark:bg-[#0f0f0f] rounded-2xl overflow-hidden"
    >
      <div className="p-2">
        <div className="flex items-center gap-4 p-3 hover:bg-[#f5f5f5] dark:hover:bg-[#18222d] rounded-lg transition-colors">
          <div className="p-2 bg-[#effdde] dark:bg-[#2b4a40] rounded-lg">
            <Info className="w-5 h-5 text-[#34c759]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#000000] dark:text-[#ffffff]">{user.bio || 'No bio yet'}</p>
            <p className="text-[10px] uppercase font-medium text-[#8e8e93] mt-0.5">Bio</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 hover:bg-[#f5f5f5] dark:hover:bg-[#18222d] rounded-lg transition-colors">
          <div className="p-2 bg-[#effdde] dark:bg-[#2b4a40] rounded-lg">
            <Phone className="w-5 h-5 text-[#34c759]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#000000] dark:text-[#ffffff]">{user.phoneNumber || 'Not set'}</p>
            <p className="text-[10px] uppercase font-medium text-[#8e8e93] mt-0.5">Mobile</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 hover:bg-[#f5f5f5] dark:hover:bg-[#18222d] rounded-lg transition-colors">
          <div className="p-2 bg-[#effdde] dark:bg-[#2b4a40] rounded-lg">
            <Mail className="w-5 h-5 text-[#34c759]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#000000] dark:text-[#ffffff]">@{user.username || 'Not set'}</p>
            <p className="text-[10px] uppercase font-medium text-[#8e8e93] mt-0.5">Username</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
