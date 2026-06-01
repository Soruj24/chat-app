import { useState, useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Message } from "@/lib/types";
import { formatFileSize, getFileNameFromUrl } from "@/lib/utils";

interface RawMessage {
  _id?: string;
  id?: string;
  sender?: string | { _id?: string; id?: string; name?: string; username?: string; avatar?: string };
  text?: string;
  content?: string;
  timestamp?: string;
  createdAt?: string;
  status?: "sent" | "delivered" | "read" | "sending" | "error";
  type?: "text" | "image" | "video" | "file" | "voice" | "location" | "contact";
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  location?: Message["location"];
  contact?: Message["contact"];
  isForwarded?: boolean;
  reactions?: Array<{
    userId?: string;
    emoji: string;
  }>;
  replyTo?: {
    _id?: string;
    id?: string;
    text?: string;
    content?: string;
    sender?: {
      name?: string;
      username?: string;
    };
  };
}

export function useChatMessages(chatId: string) {
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchIndex, setSearchIndex] = useState(0);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const { token, user } = useSelector((state: RootState) => state.auth);

  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const fetchMessages = async () => {
      // guard against invalid values such as undefined string
      if (!chatId || chatId === "undefined" || chatId === "null" || !token) return;
      setIsLoading(true);
      setLocalMessages([]); // Clear messages when switching chats
      try {
        const response = await fetch(`http://localhost:5000/api/messages/chat/${chatId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const responseData = await response.json();
          // Handle various response formats
          let rawMessages: RawMessage[] = [];
          if (responseData) {
            if (Array.isArray(responseData)) {
              rawMessages = responseData as RawMessage[];
            } else if (responseData.messages && Array.isArray(responseData.messages)) {
              rawMessages = responseData.messages as RawMessage[];
            } else if (responseData.payload?.messages && Array.isArray(responseData.payload.messages)) {
              rawMessages = responseData.payload.messages as RawMessage[];
            }
          }
          console.log("Data after extraction:", rawMessages);

          if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
            console.log("No messages or invalid data");
            setLocalMessages([]);
            setIsLoading(false);
            return;
          }

          console.log("First message raw:", JSON.stringify(rawMessages[0], null, 2));

          // Format messages for UI
          const formattedMessages = rawMessages.map((msg: RawMessage) => {
            // Handle sender field (could be object with _id, or string ID, or nested with id)
            let senderId: string | undefined;
            let senderName: string | undefined;
            let senderAvatar: string | undefined;
            
            if (msg.sender) {
              if (typeof msg.sender === 'object') {
                senderId = msg.sender._id?.toString() || msg.sender.id?.toString();
                // Server populates with username
                senderName = msg.sender.username || msg.sender.name;
                senderAvatar = msg.sender.avatar;
              } else {
                senderId = msg.sender.toString();
              }
            }
            
            // Handle content/text field
            const text = msg.content || msg.text || '';
            
            // Handle timestamp
            const timestamp = msg.timestamp || msg.createdAt || new Date().toISOString();
            
            return {
              id: msg._id || msg.id || '',
              senderId: senderId || '',
              senderName: senderName || '',
              senderAvatar,
              text: text || '',
              timestamp: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              date: formatDate(new Date(timestamp)),
              status: msg.status || 'sent',
              isMe: senderId === user?.id,
              type: msg.type || 'text',
              mediaUrl: msg.mediaUrl,
              fileName: msg.fileName || (msg.type === 'file' || msg.type === 'image' ? getFileNameFromUrl(msg.mediaUrl) : undefined),
              fileSize: msg.fileSize ? formatFileSize(msg.fileSize) : undefined,
              location: msg.location,
              contact: msg.contact,
              isForwarded: msg.isForwarded,
              reactions: msg.reactions?.reduce((acc: NonNullable<Message["reactions"]>, curr) => {
                const existing = acc.find(r => r.emoji === curr.emoji);
                if (existing) {
                  existing.count++;
                  if (curr.userId?.toString() === user?.id) existing.me = true;
                } else {
                  acc.push({
                    emoji: curr.emoji,
                    count: 1,
                    me: curr.userId?.toString() === user?.id
                  });
                }
                return acc;
              }, []) || [],
              replyTo: msg.replyTo ? {
                id: msg.replyTo._id || msg.replyTo.id || '',
                text: msg.replyTo.text || msg.replyTo.content || '',
                senderName: msg.replyTo.sender?.name || msg.replyTo.sender?.username || "User"
              } : undefined
            };
          });
          console.log("Formatted messages for UI:", formattedMessages);
          setLocalMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [chatId, token, user?.id]);

  function formatDate(date: Date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
  }

  const filteredMessages = useMemo(() => {
    return searchQuery.trim()
      ? localMessages.filter((msg) =>
          msg.text?.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : localMessages;
  }, [localMessages, searchQuery]);

  const groupedMessages = useMemo(() => {
    return localMessages.reduce((groups: Record<string, Message[]>, msg) => {
      const date = msg.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
      return groups;
    }, {});
  }, [localMessages]);

  const scrollToMessage = (messageId: string) => {
    const element = messageRefs.current[messageId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedMessageId(messageId);
      setTimeout(() => setHighlightedMessageId(null), 2000);
    }
  };

  const navigateSearch = (direction: "up" | "down") => {
    if (filteredMessages.length === 0) return;
    let nextIndex = searchIndex;
    if (direction === "up") {
      nextIndex = searchIndex > 0 ? searchIndex - 1 : filteredMessages.length - 1;
    } else {
      nextIndex = searchIndex < filteredMessages.length - 1 ? searchIndex + 1 : 0;
    }
    setSearchIndex(nextIndex);
    scrollToMessage(filteredMessages[nextIndex].id);
  };

  const loadMoreMessages = () => {
    setIsPaginationLoading(true);
    setTimeout(() => {
      setIsPaginationLoading(false);
    }, 1500);
  };

  return {
    localMessages,
    setLocalMessages,
    filteredMessages,
    groupedMessages,
    isLoading,
    isPaginationLoading,
    searchQuery,
    setSearchQuery,
    searchIndex,
    setSearchIndex,
    highlightedMessageId,
    messageRefs,
    scrollToMessage,
    navigateSearch,
    loadMoreMessages,
  };
}
