"use client";

import { motion } from "framer-motion";
import { Users, UserPlus } from "lucide-react";
import Image from "next/image";

import { User } from "@/lib/types";

interface MemberListProps {
  members: User[];
}

interface MemberListProps {
  members: User[];
  isAdmin?: boolean;
  onAddMember?: () => void;
  onRemoveMember?: (memberId: string) => void;
}

export function MemberList({ members, isAdmin, onAddMember, onRemoveMember }: MemberListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-[#ffffff] dark:bg-[#0f0f0f] rounded-2xl overflow-hidden"
    >
      <div className="px-4 py-3 flex items-center justify-between">
        <h3 className="font-semibold text-[#000000] dark:text-[#ffffff] flex items-center gap-2">
          <Users className="w-5 h-5 text-[#8e8e93]" />
          Members ({members?.length || 0})
        </h3>
        {isAdmin && (
          <button 
            onClick={onAddMember}
            className="text-sm text-[#28a8e8] font-medium flex items-center gap-1 hover:underline"
          >
            <UserPlus className="w-4 h-4" />
            Add
          </button>
        )}
      </div>
      <div className="divide-y divide-[#e6e8ec] dark:divide-[#2b3142]">
        {members?.map((member) => (
          <div
            key={member.id}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#f5f5f5] dark:hover:bg-[#18222d] transition-colors"
          >
            <div className="relative w-10 h-10 flex-shrink-0">
              {member.avatar ? (
                <Image
                  src={member.avatar}
                  alt={member.name || "Member avatar"}
                  fill
                  unoptimized
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#28a8e8] to-[#0ba4e8] flex items-center justify-center text-white font-medium">
                  {(member.name || "U").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#000000] dark:text-[#ffffff]">
                  {member.name}
                  {member.id === "me" && " (You)"}
                </span>
              </div>
              <p className="text-xs text-[#34c759]">{member.status}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
