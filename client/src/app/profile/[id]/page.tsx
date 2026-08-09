"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { EnterpriseProfilePanel } from "@/components/profile/EnterpriseProfilePanel";
import { User, Message } from "@/lib/types";
import { SkeletonProfile } from "@/components/skeletons";

export default function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token, user: currentUser } = useSelector((state: RootState) => state.auth);

  const isOwnProfile = currentUser?.id === id || currentUser?._id === id;

  useEffect(() => {
    const fetchUser = async () => {
      if (!id || !token) return;
      try {
        const response = await fetch(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Failed to fetch user:", error.message);
        } else {
          console.error("Unknown error:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [id, token]);

  const handleEditAvatar = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !token) return;
      const formData = new FormData();
      formData.append("avatar", file);
      try {
        const res = await fetch("/api/users/avatar", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          setUser((prev) => prev ? { ...prev, avatar: data.avatar } : prev);
        }
      } catch (err) {
        console.error("Failed to upload avatar:", err);
      }
    };
    input.click();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex-1 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
        <ProfileHeader />
        <div className="max-w-2xl mx-auto py-8 px-4">
          <SkeletonProfile variant="full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
      <ProfileHeader />

      <div className="max-w-2xl mx-auto py-6 px-4">
        <EnterpriseProfilePanel
          user={user}
          isOwnProfile={isOwnProfile}
          messages={[]}
          sharedMedia={[]}
          sharedFiles={[]}
          sharedLinks={[]}
          pinnedMessages={[]}
          notificationsEnabled={user.settings?.showNotifications ?? true}
          soundEnabled={user.settings?.soundEffects ?? true}
          showPreview={user.settings?.messagePreview ?? true}
          onEditAvatar={handleEditAvatar}
          onStatusChange={(status) => {
            setUser((prev) => prev ? { ...prev, status: status as User["status"] } : prev);
          }}
          onBioChange={(bio) => {
            setUser((prev) => prev ? { ...prev, bio } : prev);
          }}
          onMuteToggle={() => {
            // TODO: Wire to Redux/settings
          }}
          onBlockToggle={() => {
            // TODO: Wire to API
          }}
          onNotificationToggle={() => {
            setUser((prev) => prev ? {
              ...prev,
              settings: {
                theme: prev.settings?.theme ?? "system",
                fontSize: prev.settings?.fontSize ?? "medium",
                accentColor: prev.settings?.accentColor ?? "#3B82F6",
                bubbleStyle: prev.settings?.bubbleStyle ?? "modern",
                showNotifications: !(prev.settings?.showNotifications ?? true),
                messagePreview: prev.settings?.messagePreview ?? true,
                soundEffects: prev.settings?.soundEffects ?? true,
                readReceipts: prev.settings?.readReceipts ?? true,
                lastSeenVisibility: prev.settings?.lastSeenVisibility ?? "everyone",
                twoFactorAuth: prev.settings?.twoFactorAuth ?? false,
                notificationSound: prev.settings?.notificationSound ?? "default",
              },
            } : prev);
          }}
          onSoundToggle={() => {
            setUser((prev) => prev ? {
              ...prev,
              settings: {
                theme: prev.settings?.theme ?? "system",
                fontSize: prev.settings?.fontSize ?? "medium",
                accentColor: prev.settings?.accentColor ?? "#3B82F6",
                bubbleStyle: prev.settings?.bubbleStyle ?? "modern",
                showNotifications: prev.settings?.showNotifications ?? true,
                messagePreview: prev.settings?.messagePreview ?? true,
                soundEffects: !(prev.settings?.soundEffects ?? true),
                readReceipts: prev.settings?.readReceipts ?? true,
                lastSeenVisibility: prev.settings?.lastSeenVisibility ?? "everyone",
                twoFactorAuth: prev.settings?.twoFactorAuth ?? false,
                notificationSound: prev.settings?.notificationSound ?? "default",
              },
            } : prev);
          }}
          onPreviewToggle={() => {
            setUser((prev) => prev ? {
              ...prev,
              settings: {
                theme: prev.settings?.theme ?? "system",
                fontSize: prev.settings?.fontSize ?? "medium",
                accentColor: prev.settings?.accentColor ?? "#3B82F6",
                bubbleStyle: prev.settings?.bubbleStyle ?? "modern",
                showNotifications: prev.settings?.showNotifications ?? true,
                messagePreview: !(prev.settings?.messagePreview ?? true),
                soundEffects: prev.settings?.soundEffects ?? true,
                readReceipts: prev.settings?.readReceipts ?? true,
                lastSeenVisibility: prev.settings?.lastSeenVisibility ?? "everyone",
                twoFactorAuth: prev.settings?.twoFactorAuth ?? false,
                notificationSound: prev.settings?.notificationSound ?? "default",
              },
            } : prev);
          }}
        />
      </div>
    </div>
  );
}
