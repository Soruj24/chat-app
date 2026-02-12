"use client";

import { useState, useRef, useEffect } from "react";
import { Chat, Message } from "@/lib/types";
import { socketService } from "@/lib/socket/socket-client";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  markAsRead,
  setActiveChat,
  updateChat,
} from "@/store/slices/chatSlice";
import { RootState } from "@/store/store";

export function useChatState(
  chat: Chat | undefined,
  setLocalMessages: (fn: (prev: Message[]) => Message[]) => void,
  setReplyingTo: (msg: Message | null) => void,
  replyingTo: Message | null,
) {
  const [inputValue, setInputValue] = useState("");
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [chatWallpaper, setChatWallpaper] = useState<string | undefined>(
    chat?.wallpaper,
  );
  const dispatch = useDispatch();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!chat?.id || !user?.id) return;
    const currentChatId = chat.id;

    // Mark as read and set as active chat when entering
    dispatch(markAsRead(currentChatId));
    dispatch(setActiveChat(currentChatId));

    socketService.connect();

    // Join user room and specific chat room
    socketService.emit("join", user.id);
    socketService.emit("join_chat", currentChatId);

    const handleReceiveMessage = (message: Message) => {
      // If the message belongs to this chat and it's not from me
      if (message.senderId !== user.id) {
        setLocalMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, { ...message, isMe: false }];
        });
        dispatch(
          addMessage({
            chatId: currentChatId,
            message: { ...message, isMe: false },
          }),
        );

        // Handle unread count and scrolling
        if (scrollContainerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } =
            scrollContainerRef.current;
          const isAtBottom = scrollHeight - scrollTop - clientHeight < 150; // threshold

          if (isAtBottom) {
            setTimeout(scrollToBottom, 100);
          } else {
            setUnreadCount((prev) => prev + 1);
          }
        }
      }
    };

    const handleTyping = ({
      chatId: typingChatId,
      userId: typingUserId,
      isTyping: typingStatus,
    }: {
      chatId: string;
      userId: string;
      isTyping: boolean;
    }) => {
      if (typingChatId === currentChatId && typingUserId !== user.id) {
        setIsTyping(typingStatus);
        setIsOnline(true);

        if (typingStatus) {
          // If it's a private chat, we know the name
          if (chat.type === "private") {
            setTypingUser(chat.name || "Someone");
          } else {
            // In a group, try to find the user name from members
            const member = chat.members?.find(
              (m: { id?: string; _id?: string }) =>
                (m.id || m._id || m).toString() === typingUserId,
            );
            setTypingUser(member?.name || "Someone");
          }
        }
      }
    };

    socketService.on("receive_message", handleReceiveMessage);
    socketService.on("user_typing", handleTyping);

    const handleMessageReaction = ({
      messageId,
      reactions,
      userId: reactionUserId,
    }: {
      messageId: string;
      reactions: { emoji: string; userId?: string }[];
      userId: string;
    }) => {
      setLocalMessages((prev) =>
        prev.map((m) => {
          if (m.id === messageId) {
            const formattedReactions = reactions.reduce(
              (
                acc: { emoji: string; count: number; me: boolean }[],
                curr: { emoji: string; userId?: string },
              ) => {
                const existing = acc.find((r) => r.emoji === curr.emoji);
                if (existing) {
                  existing.count++;
                  if (curr.userId?.toString() === user?.id) existing.me = true;
                } else {
                  acc.push({
                    emoji: curr.emoji,
                    count: 1,
                    me: curr.userId?.toString() === user?.id,
                  });
                }
                return acc;
              },
              [],
            );
            return { ...m, reactions: formattedReactions };
          }
          return m;
        }),
      );
    };

    socketService.on("message_reaction", handleMessageReaction);

    const handleMessagePin = ({
      messageId,
      isPinned,
    }: {
      messageId: string;
      isPinned: boolean;
    }) => {
      // Update chat in Redux
      const newPinnedMessages = isPinned
        ? [...(chat.pinnedMessageIds || []), messageId]
        : (chat.pinnedMessageIds || []).filter(
            (id: string) => id.toString() !== messageId,
          );

      dispatch(
        updateChat({
          chatId: currentChatId,
          updates: { pinnedMessageIds: newPinnedMessages },
        }),
      );
    };

    const handleMessageDelete = ({ messageId }: { messageId: string }) => {
      setLocalMessages((prev) => prev.filter((m) => m.id !== messageId));
    };

    socketService.on("message_pin", handleMessagePin);
    socketService.on("message_delete", handleMessageDelete);

    socketService.on(
      "user_status_update",
      ({ userId: statusUserId, status }) => {
        if (
          (chat.type === "private" || chat.type === "individual") &&
          Array.isArray(chat.members) &&
          chat.members.some(
            (m: { id?: string; _id?: string }) =>
              (m.id || m._id || m).toString() === statusUserId,
          ) &&
          statusUserId !== user.id
        ) {
          setIsOnline(status === "online");
        }
      },
    );

    return () => {
      socketService.emit("leave_chat", currentChatId);
      socketService.off("receive_message", handleReceiveMessage);
      socketService.off("user_typing", handleTyping);
      socketService.off("message_reaction");
      socketService.off("message_pin");
      socketService.off("message_delete");
      socketService.off("user_status_update");
      dispatch(setActiveChat(null));
    };
  }, [chat?.id, user?.id]);

  useEffect(() => {
    if (!chat?.id || !user?.id) return;
    const currentChatId = chat.id;

    if (inputValue.trim()) {
      socketService.emit("typing", {
        chatId: currentChatId,
        userId: user.id,
        isTyping: true,
      });
    } else {
      socketService.emit("typing", {
        chatId: currentChatId,
        userId: user.id,
        isTyping: false,
      });
    }

    const timer = setTimeout(() => {
      socketService.emit("typing", {
        chatId: currentChatId,
        userId: user.id,
        isTyping: false,
      });
    }, 3000);

    return () => {
      clearTimeout(timer);
      socketService.emit("typing", {
        chatId: currentChatId,
        userId: user.id,
        isTyping: false,
      });
    };
  }, [inputValue, chat?.id, user?.id]);

  const handleSendMessage = async () => {
    const chatId = chat?.id;
    if (inputValue.trim() && token && chatId) {
      const tempId = Date.now().toString();
      const newMessage: Message = {
        id: tempId,
        senderId: user?.id || "me",
        text: inputValue.trim(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: "Today",
        status: "sending",
        isMe: true,
        senderName: user?.name,
        type: "text",
        replyTo: replyingTo
          ? {
              id: replyingTo.id,
              text: replyingTo.text,
              senderName: replyingTo.senderName || chat?.name || "User",
            }
          : undefined,
      };

      // Optimistic update
      setLocalMessages((prev) => [...prev, newMessage]);
      setInputValue("");
      socketService.emit("typing", {
        chatId: chatId,
        userId: user?.id || "me",
        isTyping: false,
      });
      setReplyingTo(null);
      setTimeout(scrollToBottom, 100);

      try {
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            chatId,
            text: newMessage.text,
            type: "text",
            replyTo: replyingTo ? replyingTo.id : undefined,
          }),
        });

        if (response.ok) {
          const savedMsg = await response.json();

          // Update local state with real ID and status
          setLocalMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempId
                ? { ...msg, id: savedMsg._id, status: "sent" }
                : msg,
            ),
          );

          const finalMessage: Message = {
            ...newMessage,
            id: savedMsg._id,
            status: "sent",
          };

          // Emit to socket server for real-time delivery
          const receiverId =
            chat &&
            (chat.type === "private" || chat.type === "individual") &&
            Array.isArray(chat.members)
              ? chat.members.find(
                  (m) => (m.id || m.id || m).toString() !== (user?.id || "me"),
                )?.id ||
                chat.members.find(
                  (m) => (m.id || m.id || m).toString() !== (user?.id || "me"),
                )?.id
              : undefined;

          console.log("Emitting send_message:", {
            chatId,
            receiverId,
            messageId: finalMessage.id,
          });

          socketService.emit("send_message", {
            chatId,
            message: finalMessage,
            receiverId,
          });

          dispatch(addMessage({ chatId, message: finalMessage }));
        } else {
          setLocalMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempId ? { ...msg, status: "error" } : msg,
            ),
          );
        }
      } catch (error) {
        console.error("Failed to send message:", error);
        setLocalMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId ? { ...msg, status: "error" } : msg,
          ),
        );
      }
    }
  };

  const handleScroll = (
    isPaginationLoading: boolean,
    isLoading: boolean,
    loadMoreMessages: () => void,
  ) => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollToBottom(!isAtBottom);
    if (isAtBottom) setUnreadCount(0);
    if (scrollTop < 50 && !isPaginationLoading && !isLoading) {
      loadMoreMessages();
    }
  };

  return {
    inputValue,
    setInputValue,
    showScrollToBottom,
    setShowScrollToBottom,
    unreadCount,
    setUnreadCount,
    isOnline,
    setIsOnline,
    isTyping,
    typingUser,
    chatWallpaper,
    setChatWallpaper,
    messagesEndRef,
    scrollContainerRef,
    scrollToBottom,
    handleSendMessage,
    handleScroll,
  };
}
