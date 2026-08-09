"use client";

import { motion } from "framer-motion";
import {
  User,
  Info,
  Image as ImageIcon,
  FileText,
  Link2,
  Pin,
  Settings,
} from "lucide-react";
import { User as UserType, Message } from "@/lib/types";
import { ProfileSection } from "./ProfileSection";
import { ProfileHero } from "./ProfileHero";
import { ProfileStatus } from "./ProfileStatus";
import { ProfileBio } from "./ProfileBio";
import { ProfileMedia } from "./ProfileMedia";
import { ProfileFiles } from "./ProfileFiles";
import { ProfileLinks } from "./ProfileLinks";
import { ProfilePinnedMessages } from "./ProfilePinnedMessages";
import { ProfileActions } from "./ProfileActions";

interface EnterpriseProfilePanelProps {
  user: UserType;
  isOwnProfile?: boolean;
  messages?: Message[];
  sharedMedia?: { id: string; url: string; type: "image" | "video"; timestamp: string }[];
  sharedFiles?: { id: string; name: string; type: string; size: string; url: string; timestamp: string }[];
  sharedLinks?: { id: string; url: string; title: string; description?: string; timestamp: string }[];
  pinnedMessages?: Message[];
  isMuted?: boolean;
  isBlocked?: boolean;
  notificationsEnabled?: boolean;
  soundEnabled?: boolean;
  showPreview?: boolean;
  onEditAvatar?: () => void;
  onStatusChange?: (status: string) => void;
  onBioChange?: (bio: string) => void;
  onMuteToggle?: () => void;
  onBlockToggle?: () => void;
  onNotificationToggle?: () => void;
  onSoundToggle?: () => void;
  onPreviewToggle?: () => void;
  onThemeClick?: () => void;
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

export function EnterpriseProfilePanel({
  user,
  isOwnProfile,
  messages = [],
  sharedMedia = [],
  sharedFiles = [],
  sharedLinks = [],
  pinnedMessages = [],
  isMuted,
  isBlocked,
  notificationsEnabled,
  soundEnabled,
  showPreview,
  onEditAvatar,
  onStatusChange,
  onBioChange,
  onMuteToggle,
  onBlockToggle,
  onNotificationToggle,
  onSoundToggle,
  onPreviewToggle,
  onThemeClick,
}: EnterpriseProfilePanelProps) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Hero Card */}
      <ProfileHero
        user={user}
        isOwnProfile={isOwnProfile}
        onEditAvatar={onEditAvatar}
      />

      {/* Status */}
      <ProfileSection
        title="Status"
        icon={<User className="w-3.5 h-3.5 text-gray-500" />}
        delay={0.1}
      >
        <ProfileStatus
          user={user}
          isOwnProfile={isOwnProfile}
          onStatusChange={onStatusChange}
        />
      </ProfileSection>

      {/* Bio */}
      <ProfileSection
        title="About"
        icon={<Info className="w-3.5 h-3.5 text-gray-500" />}
        delay={0.15}
      >
        <ProfileBio
          user={user}
          isOwnProfile={isOwnProfile}
          onBioChange={onBioChange}
        />
      </ProfileSection>

      {/* Shared Media */}
      <ProfileSection
        title="Shared Media"
        icon={<ImageIcon className="w-3.5 h-3.5 text-gray-500" />}
        action={
          sharedMedia.length > 0 ? (
            <button className="text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors">
              View All
            </button>
          ) : undefined
        }
        delay={0.2}
      >
        <ProfileMedia media={sharedMedia} />
      </ProfileSection>

      {/* Shared Files */}
      <ProfileSection
        title="Shared Files"
        icon={<FileText className="w-3.5 h-3.5 text-gray-500" />}
        action={
          sharedFiles.length > 0 ? (
            <button className="text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors">
              View All
            </button>
          ) : undefined
        }
        delay={0.25}
      >
        <ProfileFiles files={sharedFiles} />
      </ProfileSection>

      {/* Shared Links */}
      <ProfileSection
        title="Shared Links"
        icon={<Link2 className="w-3.5 h-3.5 text-gray-500" />}
        action={
          sharedLinks.length > 0 ? (
            <button className="text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors">
              View All
            </button>
          ) : undefined
        }
        delay={0.3}
      >
        <ProfileLinks links={sharedLinks} />
      </ProfileSection>

      {/* Pinned Messages */}
      <ProfileSection
        title="Pinned Messages"
        icon={<Pin className="w-3.5 h-3.5 text-gray-500" />}
        delay={0.35}
      >
        <ProfilePinnedMessages messages={pinnedMessages} />
      </ProfileSection>

      {/* Settings */}
      <ProfileSection
        title="Settings"
        icon={<Settings className="w-3.5 h-3.5 text-gray-500" />}
        delay={0.4}
      >
        <ProfileActions
          isOwnProfile={isOwnProfile}
          isMuted={isMuted}
          isBlocked={isBlocked}
          notificationsEnabled={notificationsEnabled}
          soundEnabled={soundEnabled}
          showPreview={showPreview}
          onMuteToggle={onMuteToggle}
          onBlockToggle={onBlockToggle}
          onNotificationToggle={onNotificationToggle}
          onSoundToggle={onSoundToggle}
          onPreviewToggle={onPreviewToggle}
          onThemeClick={onThemeClick}
        />
      </ProfileSection>

      {/* Bottom spacer */}
      <div className="h-8" />
    </motion.div>
  );
}
