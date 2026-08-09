"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Info, Pencil, Check, X } from "lucide-react";
import { User } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProfileBioProps {
  user: User;
  isOwnProfile?: boolean;
  onBioChange?: (bio: string) => void;
}

export function ProfileBio({ user, isOwnProfile, onBioChange }: ProfileBioProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user.bio || "");

  const handleSave = () => {
    onBioChange?.(bio);
    setIsEditing(false);
  };

  return (
    <div className="space-y-3">
      {isEditing ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            rows={3}
            maxLength={200}
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{bio.length}/200</span>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={handleSave}
                className="p-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
              >
                <Check className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="flex items-start justify-between">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {user.bio || (
              <span className="text-gray-400 dark:text-gray-500 italic">
                No bio yet
              </span>
            )}
          </p>
          {isOwnProfile && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0 ml-2"
            >
              <Pencil className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
