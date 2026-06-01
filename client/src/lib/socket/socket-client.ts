import { io, Socket } from "socket.io-client";

interface SocketWithUserId extends Socket {
  userId?: string;
}

class SocketService {
  private socket: SocketWithUserId | null = null;

  connect() {
    if (this.socket?.connected) return;

    const SOCKET_URL =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    console.log("🔌 Connecting to socket server at:", SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      timeout: 15000,
      transports: ["websocket", "polling"],
      withCredentials: true,
      forceNew: true,
    }) as SocketWithUserId;

    this.socket.on("connect", () => {
      console.log("✅ Socket connected! ID:", this.socket?.id);
      this.setupConnection();
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected. Reason:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("🚫 Socket connection error:", error);
    });

    this.socket.on("new-message", (data) => {
      console.log("📨 Received new-message:", data);
    });
  }

  private setupConnection() {
    const userId = this.socket?.userId;
    if (userId) {
      console.log("Re-joining room for user:", userId);
      this.socket?.emit("join", userId);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: string, callback: (...args: any[]) => void) {
    // Map server event names to client event names
    const eventMap: Record<string, string> = {
      "new-message": "new_message_notification",
      "message-reaction": "message_reaction_update",
      "message-deleted": "message_deleted",
      "user-typing": "user_typing",
      "message-read": "message_read",
    };
    
    const clientEvent = eventMap[event] || event;
    this.socket?.on(clientEvent as any, callback);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  off(event: string, callback?: (...args: any[]) => void) {
    if (callback) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.socket?.off(event as any, callback);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.socket?.off(event as any);
    }
  }

  emit(event: string, data: unknown) {
    // Map client event names to server event names
    const eventMap: Record<string, string> = {
      "send_message": "send-message",
      "join_chat": "join-chat",
      "leave_chat": "leave-chat",
      "react_message": "react-message",
      "delete_message": "delete-message",
    };
    
    const serverEvent = eventMap[event] || event;

    if (event === "join" && typeof data === "string" && this.socket) {
      this.socket.userId = data;
    }

    if (!this.socket?.connected) {
      console.warn(
        `Socket not connected, trying to reconnect before emitting ${event}`,
      );
      this.connect();

      this.socket?.once("connect", () => {
        console.log(`Successfully reconnected, now emitting ${event}`);
        this.socket?.emit(serverEvent as any, data);
      });
      return;
    }

    console.log(`Emitting ${serverEvent}:`, data);
    this.socket?.emit(serverEvent as any, data);
  }

  getSocket() {
    return this.socket;
  }

  // Convenience methods for chat features
  joinChat(chatId: string) {
    this.emit("join-chat", chatId);
  }

  leaveChat(chatId: string) {
    this.emit("leave-chat", chatId);
  }

  sendTyping(chatId: string, isTyping: boolean) {
    this.emit("typing", { chatId, isTyping });
  }

  sendMessage(chatId: string, message: any, receiverId?: string) {
    this.emit("send-message", { chatId, message, receiverId });
  }

  markAsRead(chatId: string, messageId: string) {
    this.emit("read-message", { chatId, messageId });
  }

  reactToMessage(chatId: string, messageId: string, emoji: string) {
    this.emit("react-message", { chatId, messageId, emoji });
  }

  deleteMessage(chatId: string, messageId: string, deleteForEveryone: boolean) {
    this.emit("delete-message", { chatId, messageId, deleteForEveryone });
  }
}

export const socketService = new SocketService();