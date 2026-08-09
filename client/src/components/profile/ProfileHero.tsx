"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import {
  Phone,
  Video,
  Search,
  Camera,
  ChevronRight,
} from "lucide-react";
import { User } from "@/lib/types";
import { cn } from "@/lib/utils";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const ring: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

interface ProfileHeroProps {
  user: User;
  isOwnProfile?: boolean;
  onEditAvatar?: () => void;
}

export function ProfileHero({ user, isOwnProfile, onEditAvatar }: ProfileHeroProps) {
  const initials = (user.name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
      className="relative bg-white dark:bg-gray-900/80 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
    >
      {/* Decorative gradient banner */}
      <div className="h-28 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtNnY2aDJ2Mmgydi0yem0wLThoLTJ2MmgyVjI2ek0zNCAyNGgtMnYyaDJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
      </div>

      {/* Avatar */}
      <div className="relative -mt-16 flex flex-col items-center">
        <motion.div
          variants={ring}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.15, type: "spring" as const, stiffness: 300, damping: 30 }}
          className="relative"
        >
          <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-[3px] shadow-lg">
            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 p-[2px]">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={112}
                  height={112}
                  unoptimized
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                  {initials}
                </div>
              )}
            </div>
          </div>

          {/* Online indicator */}
          <div className={cn(
            "absolute bottom-1 right-1 w-5 h-5 rounded-full border-[3px] border-white dark:border-gray-900",
            user.status === "online" ? "bg-emerald-500" : "bg-gray-400"
          )} />

          {/* Edit avatar button */}
          {isOwnProfile && (
            <button
              onClick={onEditAvatar}
              className="absolute -bottom-1 -right-1 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-2 border-white dark:border-gray-900 transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </motion.div>

        {/* Name and username */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-4 px-5"
        >
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {user.name}
          </h1>
          {user.username && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              @{user.username}
            </p>
          )}
          <p className={cn(
            "text-xs font-medium mt-1.5",
            user.status === "online"
              ? "text-emerald-500"
              : "text-gray-400 dark:text-gray-500"
          )}>
            {user.status === "online" ? "Online" : user.status === "last seen recently" ? "Last seen recently" : user.status}
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex gap-3 mt-5 pb-6"
        >
          {[
            { icon: Phone, label: "Audio", color: "text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10" },
            { icon: Video, label: "Video", color: "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10" },
            { icon: Search, label: "Search", color: "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" },
          ].map(({ icon: Icon, label, color }) => (
            <button
              key={label}
              className={cn(
                "flex flex-col items-center gap-1.5 px-6 py-2.5 rounded-xl transition-colors",
                color
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] font-medium">{label}</span>
            </button>
          ))}
        </motion.div>

        {/* Quick info row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full border-t border-gray-100 dark:border-gray-800"
        >
          {user.phoneNumber && (
            <div className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{user.phoneNumber}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
            </div>
          )}
          {user.email && (
            <div className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-700 dark:text-gray-300">{user.email}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
