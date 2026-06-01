import { Server, Socket } from "socket.io";
import { userManager } from "./utils/userManager";
import Message, { IReaction } from "../models/Message";
import Chat from "../models/Chat";
import { Types } from "mongoose";

export interface ServerToClientEvents {
  "user-online": (data: { userId: string; status: string }) => void;
  "user-typing": (data: {
    chatId: string;
    userId: string;
    isTyping: boolean;
  }) => void;
  "message-read": (data: {
    chatId: string;
    messageId: string;
    readerId: string;
  }) => void;
  "new-message": (data: { chatId: string; message: any }) => void;
  "message-reaction": (data: {
    chatId: string;
    messageId: string;
    reactions: any[];
  }) => void;
  "message-deleted": (data: {
    chatId: string;
    messageId: string;
    deleteForEveryone: boolean;
  }) => void;
  "users-online": (data: { users: string[] }) => void;
  "last-seen": (data: { userId: string; lastSeen: string }) => void;
}

export interface ClientToServerEvents {
  "join-chat": (chatId: string) => void;
  "leave-chat": (chatId: string) => void;
  typing: (data: { chatId: string; isTyping: boolean }) => void;
  "read-message": (data: { chatId: string; messageId: string }) => void;
  "send-message": (data: {
    chatId: string;
    message: any;
    receiverId?: string;
  }) => void;
  "react-message": (data: {
    chatId: string;
    messageId: string;
    emoji: string;
  }) => void;
  "delete-message": (data: {
    chatId: string;
    messageId: string;
    deleteForEveryone: boolean;
  }) => void;
  "get-online-users": () => void;
}

export function setupSocketHandlers(io: Server) {
  const onlineUsers = new Map<string, { socketId: string; lastSeen: Date }>();

  io.on("connection", (socket: Socket) => {
    console.log(`🔗 New connection: ${socket.id}`);

    // User joins with their ID
    socket.on("join", async (userId: string) => {
      if (!userId) return;

      socket.join(userId);
      onlineUsers.set(userId, { socketId: socket.id, lastSeen: new Date() });
      userManager.set(socket.id, { 
        userId, 
        username: "User", 
        userLanguage: "en", 
        language: "en", 
        socketId: socket.id, 
        rememberSession: false 
      });

      // Broadcast user online status
      io.emit("user-online", { userId, status: "online" });

      // Send list of online users
      const onlineUserIds = Array.from(onlineUsers.keys());
      io.emit("users-online", { users: onlineUserIds });

      console.log(`👤 User ${userId} connected`);
    });

    // Join a chat room
    socket.on("join-chat", (chatId: string) => {
      if (chatId) {
        socket.join(chatId);
        console.log(`💬 Socket ${socket.id} joined chat ${chatId}`);
      }
    });

    // Leave a chat room
    socket.on("leave-chat", (chatId: string) => {
      if (chatId) {
        socket.leave(chatId);
        console.log(`💬 Socket ${socket.id} left chat ${chatId}`);
      }
    });

    // Typing indicator
    socket.on("typing", async ({ chatId, isTyping }) => {
      if (!chatId) return;

      // Get user info from socket
      const userData = userManager.get(socket.id);
      if (!userData) return;

      // Broadcast to chat room
      socket.to(chatId).emit("user-typing", {
        chatId,
        userId: userData.userId,
        isTyping,
      });
    });

    // Mark message as read
    socket.on("read-message", async ({ chatId, messageId }) => {
      if (!chatId || !messageId) return;

      const userData = userManager.get(socket.id);
      if (!userData) return;

      try {
        // Update message status to read
        await Message.findByIdAndUpdate(messageId, {
          $addToSet: { readBy: userData.userId },
        });

        // Also update chat's last read message
        await Chat.findByIdAndUpdate(chatId, {
          lastReadAt: new Date(),
        });

        // Broadcast read receipt
        socket.to(chatId).emit("message-read", {
          chatId,
          messageId,
          readerId: userData.userId,
        });
      } catch (error) {
        console.error("Error marking message read:", error);
      }
    });

    // Send message
    socket.on("send-message", async ({ chatId, message, receiverId }) => {
      if (!chatId || !message) return;

      const userData = userManager.get(socket.id);
      if (!userData) return;

      try {
        // Save message to database
        const newMessage = await Message.create({
          chatId: new Types.ObjectId(chatId),
          sender: new Types.ObjectId(userData.userId),
          content: message.content || message.text,
          type: message.type || "text",
          fileUrl: message.fileUrl,
        });

        // Populate sender info
        const populatedMessage = await Message.findById(
          newMessage._id,
        ).populate("sender", "username avatar");

        // Update chat's last message
        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: newMessage._id,
          updatedAt: new Date(),
        });

        // Broadcast to chat room
        io.to(chatId).emit("new-message", {
          chatId,
          message: populatedMessage,
        });

        // Also send to receiver if specified
        if (receiverId) {
          io.to(receiverId).emit("new-message", {
            chatId,
            message: populatedMessage,
          });
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    // Message reaction
    socket.on("react-message", async ({ chatId, messageId, emoji }) => {
      if (!chatId || !messageId) return;

      const userData = userManager.get(socket.id);
      if (!userData) return;

      try {
        const message = await Message.findById(messageId);
        if (!message) return;

        // Toggle reaction
        const existingReaction = message.reactions.find(
          (r: IReaction) => r.userId.toString() === userData.userId && r.emoji === emoji,
        );

        if (existingReaction) {
          message.reactions = message.reactions.filter(
            (r: IReaction) =>
              !(r.userId.toString() === userData.userId && r.emoji === emoji),
          );
        } else {
          message.reactions.push({
            userId: new Types.ObjectId(userData.userId),
            emoji,
          });
        }

        await message.save();
        const updatedMessage = await Message.findById(messageId).populate(
          "reactions.userId",
          "username avatar",
        );

        // Broadcast reaction update
        io.to(chatId).emit("message-reaction", {
          chatId,
          messageId,
          reactions: updatedMessage.reactions,
        });
      } catch (error) {
        console.error("Error reacting to message:", error);
      }
    });

    // Delete message
    socket.on(
      "delete-message",
      async ({ chatId, messageId, deleteForEveryone }) => {
        if (!chatId || !messageId) return;

        const userData = userManager.get(socket.id);
        if (!userData) return;

        try {
          if (deleteForEveryone) {
            // Delete for everyone - only sender can do this
            const message = await Message.findById(messageId);
            if (message && message.sender.toString() === userData.userId) {
              await Message.findByIdAndDelete(messageId);
              io.to(chatId).emit("message-deleted", {
                chatId,
                messageId,
                deleteForEveryone: true,
              });
            }
          } else {
            // Delete for self only
            await Message.findByIdAndUpdate(messageId, {
              $addToSet: { deletedBy: userData.userId },
            });
            io.to(chatId).emit("message-deleted", {
              chatId,
              messageId,
              deleteForEveryone: false,
            });
          }
        } catch (error) {
          console.error("Error deleting message:", error);
        }
      },
    );

    // Get online users
    socket.on("get-online-users", () => {
      const onlineUserIds = Array.from(onlineUsers.keys());
      socket.emit("users-online", { users: onlineUserIds });
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      console.log(`🔌 Connection closed: ${socket.id}`);

      const userData = userManager.get(socket.id);
      if (userData) {
        // Update last seen
        const userInfo = onlineUsers.get(userData.userId);
        if (userInfo) {
          userInfo.lastSeen = new Date();
        }

        onlineUsers.delete(userData.userId);
        userManager.delete(socket.id);

        // Broadcast offline status
        io.emit("user-online", { userId: userData.userId, status: "offline" });
        io.emit("last-seen", {
          userId: userData.userId,
          lastSeen: new Date().toISOString(),
        });

        // Update online list
        const onlineUserIds = Array.from(onlineUsers.keys());
        io.emit("users-online", { users: onlineUserIds });
      }
    });

    // Error handling
    socket.on("error", (error) => {
      console.error(`❌ Socket error for ${socket.id}:`, error);
    });
  });
}
