"use client";

import { Bell, BellOff } from "lucide-react";
import { useState, useEffect } from "react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { motion, AnimatePresence } from "framer-motion";

export function NotificationBell() {
  const { permission, isSupported, requestPermission, triggerTestNotification } = usePushNotifications();
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    if (permission === "default" && isSupported) {
      const hasAskedBefore = localStorage.getItem("notificationPrompted");
      if (!hasAskedBefore) {
        setTimeout(() => setShowRequestModal(true), 5000);
      }
    }
  }, [permission, isSupported]);

  const handleEnable = async () => {
    localStorage.setItem("notificationPrompted", "true");
    await requestPermission();
    setShowRequestModal(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("notificationPrompted", "true");
    setShowRequestModal(false);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={permission === "granted" ? triggerTestNotification : () => setShowRequestModal(true)}
        className="relative p-2 rounded-full hover:bg-[#f5f5f5] dark:hover:bg-[#18222d] transition-colors"
      >
        {permission === "granted" ? (
          <Bell className="w-5 h-5 text-[#28a8e8]" />
        ) : (
          <BellOff className="w-5 h-5 text-[#8e8e93]" />
        )}
        {permission === "granted" && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#34c759] rounded-full" />
        )}
      </motion.button>

      <AnimatePresence>
        {showRequestModal && permission === "default" && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-14 w-72 bg-[#ffffff] dark:bg-[#18222d] rounded-2xl shadow-2xl border border-[#e6e8ec] dark:border-[#2b3142] p-4 z-50"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#effdde] rounded-xl shrink-0">
                <Bell className="w-5 h-5 text-[#34c759]" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#000000] dark:text-[#ffffff] mb-1">
                  Stay Connected
                </h3>
                <p className="text-sm text-[#8e8e93] mb-3">
                  Get notified when you receive new messages.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleEnable}
                    className="flex-1 bg-[#28a8e8] hover:bg-[#1a99e0] text-white font-bold py-2 rounded-xl transition-colors text-sm"
                  >
                    Enable
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-3 py-2 bg-[#f5f5f5] dark:bg-[#242f3d] text-[#8e8e93] font-medium rounded-xl transition-colors text-sm"
                  >
                    Later
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1 text-[#8e8e93] hover:text-[#000000] dark:hover:text-[#ffffff]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function NotificationSettings() {
  const { permission, isSupported, requestPermission } = usePushNotifications();

  if (!isSupported) {
    return (
      <div className="p-4 bg-[#f5f5f5] dark:bg-[#18222d] rounded-xl">
        <p className="text-sm text-[#8e8e93] text-center">
          Push notifications are not supported in this browser.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 bg-[#f5f5f5] dark:bg-[#18222d] rounded-xl">
      <div className="flex items-center gap-3">
        {permission === "granted" ? (
          <Bell className="w-5 h-5 text-[#34c759]" />
        ) : (
          <BellOff className="w-5 h-5 text-[#8e8e93]" />
        )}
        <div>
          <p className="font-medium text-[#000000] dark:text-[#ffffff]">
            Push Notifications
          </p>
          <p className="text-xs text-[#8e8e93]">
            {permission === "granted" 
              ? "Enabled" 
              : permission === "denied"
              ? "Blocked by settings"
              : "Disabled"
            }
          </p>
        </div>
      </div>
      {permission === "default" && (
        <button
          onClick={requestPermission}
          className="text-sm text-[#28a8e8] font-medium"
        >
          Enable
        </button>
      )}
      {permission === "denied" && (
        <button
          onClick={() => window.open("chrome://settings/content/notifications")}
          className="text-sm text-[#28a8e8] font-medium"
        >
          Unblock
        </button>
      )}
    </div>
  );
}