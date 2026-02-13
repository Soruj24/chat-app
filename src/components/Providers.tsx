"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { CallModal } from "./chat/CallModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter, usePathname } from "next/navigation";
import { setUser, logout } from "@/store/slices/authSlice";
import { receiveCall, endCall } from "@/store/slices/callSlice";
import { addMessage, setTypingStatus } from "@/store/slices/chatSlice";
import { socketService } from "@/lib/socket/socket-client";
import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";

// Polyfill for simple-peer in Next.js
if (typeof window !== "undefined" && !window.process) {
  (window as unknown as { process?: { env: Record<string, string> } }).process =
    { env: {} };
}
if (typeof window !== "undefined" && !window.global) {
  (window as unknown as { global?: typeof window }).global = window;
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = useState(true);
  const { activeChatId } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    const checkAuth = async () => {
      if (token && !user) {
        try {
          const res = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            dispatch(setUser(data.user));
          } else {
            // Token is invalid or expired
            dispatch(logout());
          }
        } catch (err) {
          console.error("Auth check failed:", err);
        }
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [token, user, dispatch]);

  useEffect(() => {
    if (user?.id) {
      socketService.connect();
      socketService.emit("join", user.id);

      // Listen for incoming calls
      socketService.on("incoming_call", ({ from, type, signal }) => {
        // Fetch user info for the caller
        fetch(`/api/users/${from}`)
          .then((res) => res.json())
          .then((data) => {
            dispatch(
              receiveCall({
                user: {
                  id: from,
                  name: data.name || "Unknown User",
                  avatar:
                    data.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${from}`,
                },
                type: type,
              }),
            );
            // Store signal for later use when answering
            (
              window as unknown as {
                incomingSignal?: RTCSessionDescriptionInit;
              }
            ).incomingSignal = signal;
          });
      });

      socketService.on("call_ended", () => {
        dispatch(endCall());
        // Clean up any local resources if needed
      });

      // Listen for new message notifications
      socketService.on("new_message_notification", ({ chatId, message }) => {
        // Add message to Redux store
        dispatch(addMessage({ chatId, message }));

        // Show toast notification only if not the active chat
        if (activeChatId !== chatId) {
          // Handle notifications and sounds based on user settings
          if (user?.settings?.showNotifications) {
            if (Notification.permission === "granted") {
              new Notification(message.senderName || "New Message", {
                body: user.settings.messagePreview ? (message.text || "New attachment") : "You have a new message",
                icon: "/favicon.ico"
              });
            } else if (Notification.permission !== "denied") {
              Notification.requestPermission();
            }
          }

          if (user?.settings?.soundEffects) {
            const audio = new Audio("/sounds/notification.mp3");
            audio.play().catch(e => console.log("Audio play blocked by browser"));
          }

          toast.custom(
            (t) => (
              <div
                className={`${
                  t.visible ? "animate-enter" : "animate-leave"
                } max-w-md w-full bg-white dark:bg-gray-900 shadow-lg rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-gray-100 dark:border-gray-800`}
              >
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-10 w-10 relative">
                        <Image
                          className="h-10 w-10 rounded-full object-cover"
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.senderId}`}
                          alt=""
                          width={40}
                          height={40}
                        />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        New Message
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {message.text ||
                          (message.type === "image"
                            ? "📷 Photo"
                            : "🎤 Voice message")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                  >
                    Close
                  </button>
                </div>
              </div>
            ),
            {
              duration: 4000,
              position: "top-right",
            },
          );
        }
      });

      // Listen for typing indicator
      socketService.on("typing", ({ chatId, userId, isTyping }) => {
        // Only show typing for others
        if (userId !== user.id) {
          dispatch(setTypingStatus({ chatId, isTyping }));
        }
      });

      return () => {
        socketService.off("incoming_call");
        socketService.off("call_ended");
        socketService.off("new_message_notification");
        socketService.off("typing");
      };
    }
  }, [user?.id, activeChatId, dispatch]);

  useEffect(() => {
    if (!isChecking) {
      if (!token && pathname !== "/auth") {
        router.replace("/auth");
      } else if (token && pathname === "/auth") {
        router.replace("/");
      }
    }
  }, [token, pathname, router, isChecking]);

  
  if (isChecking) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
            Checking system...
          </p>
        </div>
      </div>
    );
  }

  const isAuthPage = pathname === "/auth";

  // Protect routes: If not authenticated and not on auth page, don't render children
  if (!token && !isAuthPage) {
    return null;
  }

  // Prevent authenticated users from seeing auth page
  if (token && isAuthPage) {
    return null;
  }

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthGuard>
        {children}
        <CallModal />
        <Toaster />
      </AuthGuard>
    </Provider>
  );
}
