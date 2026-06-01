"use client";

import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "react-hot-toast";

type NotificationPermission = "granted" | "denied" | "default";

interface PushNotificationPayload {
  title: string;
  body?: string;
  icon?: string;
  tag?: string;
  data?: Record<string, unknown>;
}

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setIsSupported(true);
      setPermission(Notification.permission as NotificationPermission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      toast.error("Notifications not supported");
      return null;
    }

    try {
      const result = await window.Notification.requestPermission();
      setPermission(result as NotificationPermission);
      
      if (result === "granted") {
        toast.success("Notifications enabled!");
      } else if (result === "denied") {
        toast.error("Notifications blocked. Enable in browser settings.");
      }
      
      return result;
    } catch (error) {
      console.error("Error requesting permission:", error);
      toast.error("Failed to enable notifications");
      return null;
    }
  }, [isSupported]);

  const showLocalNotification = useCallback((payload: PushNotificationPayload) => {
    if (!isSupported || permission !== "granted") return;

    if (payload.body && typeof window !== "undefined") {
      const notification = new window.Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || "/icon.png",
        badge: "/icon.png",
        tag: payload.tag,
        data: payload.data,
        requireInteraction: true,
      });

      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        notification.close();
        
        if (payload.data?.chatId) {
          window.location.href = `/chat/${payload.data.chatId}`;
        }
      };

      setTimeout(() => notification.close(), 5000);
    }
  }, [isSupported, permission]);

  const triggerTestNotification = useCallback(() => {
    showLocalNotification({
      title: "Test Notification",
      body: "You're receiving notifications!",
      icon: "/icon.png",
      data: { type: "test" },
    });
  }, [showLocalNotification]);

  return {
    permission,
    isSupported,
    requestPermission,
    showLocalNotification,
    triggerTestNotification,
  };
}