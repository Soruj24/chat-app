import { Server } from "socket.io";
import http from "http";

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(",") 
      : ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3002", "http://127.0.0.1:3002", "https://chat-app-nine-neon-38.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["polling", "websocket"], // Start with polling for better compatibility
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000
});

const users = new Map(); // userId -> socketId

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId); // Join a room named after the userId
    users.set(userId, socket.id);
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  // Calling logic
  socket.on("call_user", ({ userToCall, signalData, from, type }) => {
    console.log(`Call request from ${from} to ${userToCall}`);
    socket.to(userToCall).emit("incoming_call", {
      signal: signalData,
      from,
      type
    });
  });

  socket.on("answer_call", ({ signal, to }) => {
    console.log(`Call answered by ${socket.id}, sending signal back to ${to}`);
    socket.to(to).emit("call_accepted", signal);
  });

  socket.on("end_call", ({ to }) => {
    console.log(`Call ended by ${socket.id}, notifying ${to}`);
    socket.to(to).emit("call_ended");
  });

  socket.on("send_message", ({ chatId, message, receiverId }) => {
    console.log(`Message from ${message.senderId} to ${receiverId || 'group'} in chat ${chatId}`);
    
    // 1. Broadcast to the chat room (for users currently on the chat page)
    // Using socket.to(chatId) sends to everyone in the room EXCEPT the sender
    socket.to(chatId).emit("receive_message", message);

    // 2. Also send to the specific receiver room (for sidebar updates/notifications)
    if (receiverId) {
      io.to(receiverId).emit("new_message_notification", { chatId, message });
    } else {
      // If it's a group chat, send to all participants except sender
      // In a real app, you'd get participants from DB, but for now we can rely on rooms
      socket.to(chatId).emit("new_message_notification", { chatId, message });
    }
  });

  // Join chat room
  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined chat room ${chatId}`);
    
    // Broadcast status update to room
    // Find userId for this socket
    let userId;
    for (const [id, sid] of users.entries()) {
      if (sid === socket.id) {
        userId = id;
        break;
      }
    }
    if (userId) {
      socket.to(chatId).emit("user_status_update", { userId, status: "online" });
    }
  });

  socket.on("typing", ({ chatId, userId, isTyping }) => {
    socket.to(chatId).emit("user_typing", { chatId, userId, isTyping });
  });

  socket.on("message_reaction", ({ chatId, messageId, reactions, userId }) => {
    console.log(`Reaction from ${userId} to message ${messageId} in chat ${chatId}`);
    socket.to(chatId).emit("message_reaction", { messageId, reactions, userId });
  });

  socket.on("message_pin", ({ chatId, messageId, isPinned }) => {
    console.log(`Pin update in chat ${chatId}: message ${messageId} isPinned=${isPinned}`);
    socket.to(chatId).emit("message_pin", { messageId, isPinned });
  });

  socket.on("message_delete", ({ chatId, messageId }) => {
    console.log(`Delete message ${messageId} in chat ${chatId}`);
    socket.to(chatId).emit("message_delete", { messageId });
  });

  socket.on("new_chat", ({ chat, participants }) => {
    console.log(`New chat created: ${chat.id || chat._id} with ${participants?.length} participants`);
    if (participants && Array.isArray(participants)) {
      participants.forEach(userId => {
        // Send to each participant's room
        io.to(userId).emit("new_chat_created", chat);
      });
    }
  });

  socket.on("leave_chat", (chatId) => {
    socket.leave(chatId);
    console.log(`Socket ${socket.id} left chat room ${chatId}`);
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        users.delete(userId);
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
