"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, Sun, Bell, Shield, HardDrive, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { ProfileTab } from "../settings/ProfileTab";
import { AppearanceTab } from "../settings/AppearanceTab";
import { NotificationsTab } from "../settings/NotificationsTab";
import { PrivacyTab } from "../settings/PrivacyTab";
import { DataStorageTab } from "../settings/DataStorageTab";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { updateUser } from "@/store/slices/authSlice";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { SettingsSidebar } from "../settings/SettingsSidebar";
import { spring, fadeUp } from "@/lib/animations";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<
    "profile" | "appearance" | "notifications" | "privacy" | "data"
  >("profile");
  const [isSaving, setIsSaving] = useState(false);

  const [notifications, setNotifications] = useState({
    showNotifications: true,
    messagePreview: true,
    soundEffects: true,
    notificationSound: "default",
  });

  const [appearance, setAppearance] = useState({
    theme: "system" as "light" | "dark" | "system",
    fontSize: "medium" as "small" | "medium" | "large",
    accentColor: "#3b82f6",
    bubbleStyle: "modern" as "modern" | "classic" | "rounded",
  });

  const [privacy, setPrivacy] = useState({
    readReceipts: true,
    lastSeenVisibility: "everyone" as "everyone" | "contacts" | "nobody",
    twoFactorAuth: false,
  });

  useEffect(() => {
    if (user?.settings) {
      setNotifications({
        showNotifications: user.settings.showNotifications,
        messagePreview: user.settings.messagePreview,
        soundEffects: user.settings.soundEffects,
        notificationSound: user.settings.notificationSound || "default",
      });
      setAppearance({
        theme: user.settings.theme,
        fontSize: user.settings.fontSize,
        accentColor: user.settings.accentColor || "#3b82f6",
        bubbleStyle: user.settings.bubbleStyle || "modern",
      });
      setPrivacy({
        readReceipts: user.settings.readReceipts ?? true,
        lastSeenVisibility: user.settings.lastSeenVisibility || "everyone",
        twoFactorAuth: user.settings.twoFactorAuth ?? false,
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          settings: {
            ...notifications,
            ...appearance,
            ...privacy,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save settings");
      }

      const updatedUser = await response.json();
      dispatch(updateUser(updatedUser));
      toast.success("Settings saved successfully");
      onClose();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save settings",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const menuItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Sun },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "data", label: "Data & Storage", icon: HardDrive },
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeUp}
            transition={spring.gentle}
            className="relative w-full max-w-3xl bg-[var(--bg-elevated)] rounded-[var(--radius-3xl)] shadow-[var(--shadow-2xl)] overflow-hidden flex flex-col md:flex-row h-[640px] max-h-[90vh] border border-[var(--border-default)]"
          >
            <SettingsSidebar
              activeTab={activeTab}
              onTabChange={(tab) =>
                setActiveTab(
                  tab as "profile" | "appearance" | "notifications" | "privacy" | "data",
                )
              }
              onClose={onClose}
              menuItems={menuItems}
            />

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg)]">
              <div className="hidden md:flex items-center justify-end p-4 border-b border-[var(--border-light)]">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[var(--surface-hover)] rounded-[var(--radius-lg)] transition-all duration-200 text-[var(--fg-tertiary)] hover:text-[var(--fg)] active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                {activeTab === "profile" && (
                  <ProfileTab accentColor={appearance.accentColor} />
                )}
                {activeTab === "appearance" && (
                  <AppearanceTab
                    settings={appearance}
                    onChange={(newAppearance) =>
                      setAppearance((prev) => ({ ...prev, ...newAppearance }))
                    }
                  />
                )}
                {activeTab === "notifications" && (
                  <NotificationsTab
                    settings={{ ...notifications, accentColor: appearance.accentColor }}
                    onChange={(newNotifications) =>
                      setNotifications((prev) => ({
                        ...prev,
                        ...newNotifications,
                      }))
                    }
                  />
                )}
                {activeTab === "privacy" && (
                  <PrivacyTab
                    settings={privacy}
                    onChange={(newPrivacy) =>
                      setPrivacy((prev) => ({ ...prev, ...newPrivacy }))
                    }
                  />
                )}
                {activeTab === "data" && (
                  <DataStorageTab accentColor={appearance.accentColor} />
                )}
              </div>

              {/* Footer */}
              <div className="p-6 bg-[var(--bg)] border-t border-[var(--border-light)] flex justify-end gap-3 mt-auto">
                <button
                  onClick={onClose}
                  disabled={isSaving}
                  className="btn btn-secondary btn-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn btn-primary btn-md shadow-[var(--shadow-md)] active:scale-[0.97]"
                  style={{
                    backgroundColor: appearance.accentColor,
                    boxShadow: `0 4px 16px ${appearance.accentColor}33, inset 0 1px 0 rgba(255,255,255,0.15)`,
                  }}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
