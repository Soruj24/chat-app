import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { updateChat } from "@/store/slices/chatSlice";
import { updateUser } from "@/store/slices/authSlice";
import { socketService } from "@/lib/socket/socket-client";

export function useChatInteractions(chatId?: string) {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const { chats } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [forwardingMessage, setForwardingMessage] = useState<any>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    message: { id: string; [key: string]: unknown };
  } | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState<any[]>([]);
  const [currentPinnedIndex, setCurrentPinnedIndex] = useState(0);
  const [starredMessageIds, setStarredMessageIds] = useState<Set<string>>(
    new Set(),
  );

  // Sync starred messages from Redux user state
  useEffect(() => {
    if (user?.starredMessages) {
      setStarredMessageIds(
        new Set(user.starredMessages.map((m: string) => m.toString())),
      );
    }
  }, [user?.starredMessages]);

  const handlePinMessage = async (message: {
    id: string;
    [key: string]: unknown;
  }) => {
    if (!token || !chatId) return;
    try {
      const response = await fetch(`/api/messages/${message.id}/pin`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const currentChat = chats.find((c) => c.id === chatId);
        if (currentChat) {
          const newPinnedMessages = data.isPinned
            ? [...(currentChat.pinnedMessageIds || []), message.id]
            : (currentChat.pinnedMessageIds || []).filter(
                (id: string) => id.toString() !== message.id,
              );

          dispatch(
            updateChat({
              chatId,
              updates: { pinnedMessageIds: newPinnedMessages },
            }),
          );

          // Emit socket event for real-time sync
          socketService.emit("message_pin", {
            chatId,
            messageId: message.id,
            isPinned: data.isPinned,
          });
        }
      }
    } catch (error) {
      console.error("Failed to pin message:", error);
    }
  };

  const handleStarMessage = async (message: {
    id: string;
    [key: string]: unknown;
  }) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/messages/${message.id}/star`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const currentStarred = user?.starredMessages || [];
        const newStarred = data.isStarred
          ? [...currentStarred, message.id]
          : currentStarred.filter((id: string) => id.toString() !== message.id);

        dispatch(updateUser({ starredMessages: newStarred }));
      }
    } catch (error) {
      console.error("Failed to star message:", error);
    }
  };

  const handleReaction = async (
    message: { id: string; [key: string]: unknown },
    emoji: string,
  ) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/messages/react`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messageId: message.id,
          emoji,
        }),
      });
      if (response.ok) {
        // Socket update will handle the UI if it's working
      }
    } catch (error) {
      console.error("Failed to react to message:", error);
    }
  };

  const handleDeleteMessage = async (
    messageId: string,
    callback?: () => void,
  ) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        if (callback) callback();

        // Emit socket event for real-time sync
        if (chatId) {
          socketService.emit("message_delete", {
            chatId,
            messageId,
          });
        }
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  return {
    showEmojiPicker,
    setShowEmojiPicker,
    replyingTo,
    setReplyingTo,
    forwardingMessage,
    setForwardingMessage,
    contextMenu,
    setContextMenu,
    lightboxUrl,
    setLightboxUrl,
    showInfo,
    setShowInfo,
    isSearchOpen,
    setIsSearchOpen,
    pinnedMessages,
    setPinnedMessages,
    currentPinnedIndex,
    setCurrentPinnedIndex,
    starredMessageIds,
    handlePinMessage,
    handleStarMessage,
    handleReaction,
    handleDeleteMessage,
  };
}
