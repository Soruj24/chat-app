"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Sun, Shield, User } from "lucide-react";
import { useState } from "react";
import { SettingsSidebar } from "../settings/SettingsSidebar";
import { ProfileTab } from "../settings/ProfileTab";
import { AppearanceTab } from "../settings/AppearanceTab";
import { NotificationsTab } from "../settings/NotificationsTab";
import { PrivacyTab } from "../settings/PrivacyTab";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "appearance" | "notifications" | "privacy">("profile");

  const menuItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Sun },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] max-h-[90vh]"
          >
            <SettingsSidebar 
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onClose={onClose}
              menuItems={menuItems}
            />

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900">
              <div className="hidden md:flex items-center justify-end p-4 border-b border-gray-50 dark:border-gray-800">
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                {activeTab === "profile" && <ProfileTab />}
                {activeTab === "appearance" && <AppearanceTab />}
                {activeTab === "notifications" && <NotificationsTab />}
                {activeTab === "privacy" && <PrivacyTab />}
              </div>

              {/* Footer */}
              <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-50 dark:border-gray-800 flex justify-end gap-3 mt-auto">
                <button 
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
