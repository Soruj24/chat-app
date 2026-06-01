// // Socket server code (updated)
// import { Server } from "socket.io";
// import FriendRequest from "../models/FriendRequest";
// import Friend from "../models/Friend";
// import Message from "../models/Message";
// import User from "../models/User";
// import { translateText } from "../utils/translate";

// const connectedUsers = new Map();

// export const initSocket = (io: Server) => {
//   io.on("connection", async (socket) => {
//     console.log("🟢 User connected:", socket.id);

//     try {
//       const existingUser = await User.findOne({ socketId: socket.id });
//       if (existingUser) {
//         connectedUsers.set(socket.id, {
//           username: existingUser.username,
//           userLanguage: existingUser.userLanguage,
//         });
//         console.log("Restored user session:", existingUser.username);
//       }
//     } catch (error) {
//       console.error("Error restoring user session:", error);
//     }

//     // Middleware for authentication
//     socket.use(async (packet, next) => {
//       if (packet[0] === "join") {
//         return next();
//       }

//       let userData = connectedUsers.get(socket.id);

//       if (!userData) {
//         try {
//           const user = await User.findOne({ socketId: socket.id });
//           if (user) {
//             userData = {
//               username: user.username,
//               userLanguage: user.userLanguage
//             };
//             connectedUsers.set(socket.id, userData);
//           }
//         } catch (error) {
//           console.error("Error checking database for user:", error);
//         }
//       }

//       if (!userData) {
//         console.log("Authentication failed for event:", packet[0], "Socket:", socket.id);
//         return next(new Error("Authentication required. Please rejoin the chat."));
//       }

//       next();
//     });

//     socket.on("join", async ({ username, userLanguage }: { username: string; userLanguage?: string }) => {
//       try {
//         console.log("Join request:", { username, userLanguage, socketId: socket.id });

//         if (!username) {
//           socket.emit("join-error", { message: "Username is required" });
//           return;
//         }

//         const finalUserLanguage = userLanguage || "en";
//         connectedUsers.set(socket.id, { username, userLanguage: finalUserLanguage });

//         const updatedUser = await User.findOneAndUpdate(
//           { username },
//           { socketId: socket.id, userLanguage: finalUserLanguage },
//           { upsert: true, new: true }
//         );

//         // Get friends list
//         const friends = await Friend.find({
//           $or: [
//             { user1: username },
//             { user2: username }
//           ]
//         });

//         const friendUsernames = friends.map(f =>
//           f.user1 === username ? f.user2 : f.user1
//         );

//         // Get friend requests
//         const requests = await FriendRequest.find({
//           $or: [
//             { to: username, status: 'pending' },
//             { from: username, status: 'pending' }
//           ]
//         });

//         // Get online users
//         const onlineUsers = Array.from(connectedUsers.values()).map(u => u.username);
//         const allUsers = await User.find({});

//         socket.emit("joined", {
//           message: "Successfully joined chat",
//           username,
//           userLanguage: finalUserLanguage,
//           friends: friendUsernames,
//           friendRequests: requests,
//           users: allUsers.map((u: any) => ({
//             username: u.username,
//             userLanguage: u.userLanguage,
//             online: onlineUsers.includes(u.username)
//           }))
//         });

//         // Notify others about new user
//         socket.broadcast.emit("user-online", {
//           username,
//           userLanguage: finalUserLanguage
//         });

//         // Update all users with online status
//         io.emit("users-update", {
//           users: allUsers.map((u: any) => ({
//             username: u.username,
//             userLanguage: u.userLanguage,
//             online: onlineUsers.includes(u.username)
//           }))
//         });

//       } catch (error) {
//         console.error("Error in join:", error);
//         socket.emit("join-error", {
//           message: "Failed to join chat. Please try again."
//         });
//       }
//     });

//     socket.on("get-friend-requests", async () => {
//       try {
//         const userData = connectedUsers.get(socket.id);
//         if (!userData) return;

//         const requests = await FriendRequest.find({
//           $or: [
//             { to: userData.username, status: 'pending' },
//             { from: userData.username, status: 'pending' }
//           ]
//         });

//         socket.emit("friend-requests-update", {
//           requests: requests
//         });
//       } catch (error) {
//         console.error("Error fetching friend requests:", error);
//       }
//     });

//     socket.on("send-friend-request", async ({ to }: { to: string }) => {
//       try {
//         const senderData = connectedUsers.get(socket.id);
//         if (!senderData) {
//           socket.emit("error", {
//             message: "Authentication error. Please refresh and try again."
//           });
//           return;
//         }

//         const targetUser = await User.findOne({ username: to });
//         if (!targetUser) {
//           socket.emit("error", {
//             message: "ব্যবহারকারী পাওয়া যায়নি"
//           });
//           return;
//         }

//         // Check if request already exists
//         const existingRequest = await FriendRequest.findOne({
//           $or: [
//             { from: senderData.username, to, status: 'pending' },
//             { from: to, to: senderData.username, status: 'pending' }
//           ]
//         });

//         console.log("existingRequest",existingRequest);

//         if (existingRequest) {
//           const message = existingRequest.from === senderData.username ?
//             "আপনি ইতিমধ্যে এই ব্যবহারকারীকে রিকোয়েস্ট পাঠিয়েছেন" :
//             "এই ব্যবহারকারী ইতিমধ্যে আপনাকে রিকোয়েস্ট পাঠিয়েছেন";

//           socket.emit("error", { message });
//           return;
//         }

//         // Check if already friends
//         const existingFriend = await Friend.findOne({
//           $or: [
//             { user1: senderData.username, user2: to },
//             { user1: to, user2: senderData.username }
//           ]
//         });

//         if (existingFriend) {
//           socket.emit("error", {
//             message: "আপনি ইতিমধ্যে এই ব্যবহারকারীর সাথে বন্ধু"
//           });
//           return;
//         }

//         // Create new friend request
//         const friendRequest = await FriendRequest.create({
//           from: senderData.username,
//           to,
//           status: 'pending'
//         });

//         // Notify the receiver if online
//         const receiverSocketId = targetUser.socketId;
//         if (receiverSocketId) {
//           io.to(receiverSocketId).emit("new-notification", {
//             type: "friend-request",
//             message: `${senderData.username} আপনাকে একটি বন্ধু রিকোয়েস্ট পাঠিয়েছেন`,
//             from: senderData.username,
//             requestId: friendRequest._id
//           });

//           const receiverRequests = await FriendRequest.find({
//             $or: [
//               { to: targetUser.username, status: 'pending' },
//               { from: targetUser.username, status: 'pending' }
//             ]
//           });
//           io.to(receiverSocketId).emit("friend-requests-update", {
//             requests: receiverRequests
//           });
//         }

//         // Send updated requests to sender
//         const senderRequests = await FriendRequest.find({
//           $or: [
//             { to: senderData.username, status: 'pending' },
//             { from: senderData.username, status: 'pending' }
//           ]
//         });

//         socket.emit("friend-requests-update", {
//           requests: senderRequests
//         });

//         socket.emit("friend-request-sent", {
//           message: "বন্ধু রিকোয়েস্ট পাঠানো হয়েছে",
//           to: to
//         });

//       } catch (error) {
//         console.error("Error sending friend request:", error);
//         socket.emit("error", {
//           message: "বন্ধু রিকোয়েস্ট পাঠাতে ব্যর্থ হয়েছে"
//         });
//       }
//     });

//     socket.on("accept-friend-request", async ({ requestId }: { requestId: string }) => {
//       try {
//         const receiverData = connectedUsers.get(socket.id);
//         if (!receiverData) {
//           socket.emit("error", {
//             message: "Authentication error. Please refresh and try again."
//           });
//           return;
//         }

//         const friendRequest = await FriendRequest.findByIdAndUpdate(
//           requestId,
//           { status: 'accepted' },
//           { new: true }
//         );

//         if (!friendRequest) {
//           socket.emit("error", {
//             message: "বন্ধু রিকোয়েস্ট পাওয়া যায়নি"
//           });
//           return;
//         }

//         await Friend.create({
//           user1: friendRequest.from,
//           user2: friendRequest.to
//         });

//         // Update friends list for both users
//         const receiverFriends = await Friend.find({
//           $or: [
//             { user1: receiverData.username },
//             { user2: receiverData.username }
//           ]
//         });
//         const receiverFriendUsernames = receiverFriends.map(f =>
//           f.user1 === receiverData.username ? f.user2 : f.user1
//         );

//         const sender = await User.findOne({ username: friendRequest.from });
//         if (sender && sender.socketId) {
//           const senderFriends = await Friend.find({
//             $or: [
//               { user1: friendRequest.from },
//               { user2: friendRequest.from }
//             ]
//           });
//           const senderFriendUsernames = senderFriends.map(f =>
//             f.user1 === friendRequest.from ? f.user2 : f.user1
//           );

//           io.to(sender.socketId).emit("friends-update", {
//             friends: senderFriendUsernames
//           });

//           io.to(sender.socketId).emit("friend-request-accepted", {
//             message: `${receiverData.username} আপনার বন্ধু রিকোয়েস্ট গ্রহণ করেছে`,
//             from: receiverData.username
//           });
//         }

//         socket.emit("friends-update", {
//           friends: receiverFriendUsernames
//         });

//         socket.emit("friend-request-accepted", {
//           message: `আপনি ${friendRequest.from} এর সাথে বন্ধু হয়েছেন`,
//           from: friendRequest.from
//         });

//         // Update friend requests for both users
//         const updatedReceiverRequests = await FriendRequest.find({
//           $or: [
//             { to: receiverData.username, status: 'pending' },
//             { from: receiverData.username, status: 'pending' }
//           ]
//         });
//         socket.emit("friend-requests-update", { requests: updatedReceiverRequests });

//         if (sender && sender.socketId) {
//           const updatedSenderRequests = await FriendRequest.find({
//             $or: [
//               { to: friendRequest.from, status: 'pending' },
//               { from: friendRequest.from, status: 'pending' }
//             ]
//           });
//           io.to(sender.socketId).emit("friend-requests-update", { requests: updatedSenderRequests });
//         }

//         // Emit users update to refresh online status and friend lists for all clients
//         const onlineUsers = Array.from(connectedUsers.values()).map(u => u.username);
//         const allUsers = await User.find({});

//         io.emit("users-update", {
//           users: allUsers.map((u: any) => ({
//             username: u.username,
//             userLanguage: u.userLanguage,
//             online: onlineUsers.includes(u.username)
//           }))
//         });

//       } catch (error) {
//         console.error("Error accepting friend request:", error);
//         socket.emit("error", {
//           message: "বন্ধু রিকোয়েস্ট গ্রহণ করতে ব্যর্থ হয়েছে"
//         });
//       }
//     });

//     socket.on("reject-friend-request", async ({ requestId }: { requestId: string }) => {
//       try {
//         const receiverData = connectedUsers.get(socket.id);
//         if (!receiverData) {
//           socket.emit("error", {
//             message: "Authentication error. Please refresh and try again."
//           });
//           return;
//         }

//         const friendRequest = await FriendRequest.findByIdAndUpdate(
//           requestId,
//           { status: 'rejected' },
//           { new: true }
//         );

//         if (!friendRequest) {
//           socket.emit("error", {
//             message: "বন্ধু রিকোয়েস্ট পাওয়া যায়নি"
//           });
//           return;
//         }

//         const sender = await User.findOne({ username: friendRequest.from });
//         if (sender && sender.socketId) {
//           io.to(sender.socketId).emit("friend-request-rejected", {
//             message: `${receiverData.username} আপনার বন্ধু রিকোয়েস্ট প্রত্যাখ্যান করেছে`,
//             requestId: requestId
//           });

//           const updatedSenderRequests = await FriendRequest.find({
//             $or: [
//               { to: friendRequest.from, status: 'pending' },
//               { from: friendRequest.from, status: 'pending' }
//             ]
//           });
//           io.to(sender.socketId).emit("friend-requests-update", {
//             requests: updatedSenderRequests
//           });
//         }

//         const updatedRequests = await FriendRequest.find({
//           $or: [
//             { to: receiverData.username, status: 'pending' },
//             { from: receiverData.username, status: 'pending' }
//           ]
//         });
//         socket.emit("friend-requests-update", { requests: updatedRequests });

//         socket.emit("friend-request-rejected", {
//           message: "বন্ধু রিকোয়েস্ট প্রত্যাখ্যান করা হয়েছে",
//           from: friendRequest.from,
//           requestId: requestId
//         });

//       } catch (error) {
//         console.error("Error rejecting friend request:", error);
//         socket.emit("error", {
//           message: "বন্ধু রিকোয়েস্ট প্রত্যাখ্যান করতে ব্যর্থ হয়েছে"
//         });
//       }
//     });

//     socket.on("send-message", async ({ to, message }: { to: string; message: string }) => {
//       try {
//         let senderData = connectedUsers.get(socket.id);

//         if (!senderData) {
//           const user = await User.findOne({ socketId: socket.id });
//           if (user) {
//             senderData = {
//               username: user.username,
//               userLanguage: user.userLanguage
//             };
//             connectedUsers.set(socket.id, senderData);
//           } else {
//             socket.emit("error", {
//               message: "আপনাকে প্রথমে লগইন করতে হবে"
//             });
//             return;
//           }
//         }

//         const receiver = await User.findOne({ username: to });
//         if (!receiver) {
//           socket.emit("error", {
//             message: "ব্যবহারকারী পাওয়া যায়নি"
//           });
//           return;
//         }

//         const friendship = await Friend.findOne({
//           $or: [
//             { user1: senderData.username, user2: receiver.username },
//             { user1: receiver.username, user2: senderData.username }
//           ]
//         });

//         if (!friendship) {
//           socket.emit("error", {
//             message: "শুধুমাত্র বন্ধুদের সাথেই মেসেজ করতে পারবেন। প্রথমে বন্ধু রিকোয়েস্ট পাঠান।"
//           });
//           return;
//         }

//         let translatedMessage = message;
//         if (senderData.userLanguage !== receiver.userLanguage) {
//           try {
//             translatedMessage = await translateText(
//               message,
//               receiver.userLanguage,
//               senderData.userLanguage
//             );
//           } catch (error) {
//             console.error("Translation error:", error);
//             translatedMessage = message;
//           }
//         }

//         const newMessage = await Message.create({
//           from: senderData.username,
//           to: receiver.username,
//           message: translatedMessage,
//           originalMessage: message,
//           originalLanguage: senderData.userLanguage,
//           translatedLanguage: receiver.userLanguage
//         });

//         const receiverFormattedMessage = {
//           _id: newMessage.id.toString(),
//           from: senderData.username,
//           to: receiver.username,
//           message: translatedMessage,
//           originalMessage: message,
//           originalLanguage: senderData.userLanguage,
//           translatedLanguage: receiver.userLanguage,
//           createdAt: newMessage.createdAt.toISOString()
//         };

//         const senderFormattedMessage = {
//           _id: newMessage.id.toString(),
//           from: senderData.username,
//           to: receiver.username,
//           message: message,
//           originalMessage: message,
//           originalLanguage: senderData.userLanguage,
//           translatedLanguage: receiver.userLanguage,
//           createdAt: newMessage.createdAt.toISOString()
//         };

//         if (receiver.socketId) {
//           io.to(receiver.socketId).emit("new-message", receiverFormattedMessage);
//         }

//         socket.emit("new-message", senderFormattedMessage);

//       } catch (error) {
//         console.error("Error sending message:", error);
//         socket.emit("error", {
//           message: "মেসেজ পাঠাতে ব্যর্থ হয়েছে"
//         });
//       }
//     });

//     socket.on("fetch-messages", async ({ withUser, limit = 50, skip = 0 }: { withUser: string; limit?: number; skip?: number }) => {
//       try {
//         let senderData = connectedUsers.get(socket.id);

//         if (!senderData) {
//           const user = await User.findOne({ socketId: socket.id });
//           if (user) {
//             senderData = {
//               username: user.username,
//               userLanguage: user.userLanguage
//             };
//             connectedUsers.set(socket.id, senderData);
//           } else {
//             socket.emit("error", {
//               message: "আপনাকে প্রথমে লগইন করতে হবে"
//             });
//             return;
//           }
//         }

//         const friendship = await Friend.findOne({
//           $or: [
//             { user1: senderData.username, user2: withUser },
//             { user1: withUser, user2: senderData.username }
//           ]
//         });

//         if (!friendship) {
//           socket.emit("error", {
//             message: "শুধুমাত্র বন্ধুদের সাথে চ্যাট দেখতে পারবেন"
//           });
//           return;
//         }

//         const messages = await Message.find({
//           $or: [
//             { from: senderData.username, to: withUser },
//             { from: withUser, to: senderData.username },
//           ]
//         })
//           .sort({ createdAt: -1 })
//           .limit(limit)
//           .skip(skip);

//         const formattedMessages = messages.map(msg => ({
//           _id: msg.id.toString(),
//           from: msg.from,
//           to: msg.to,
//           message: msg.message,
//           originalMessage: msg.originalMessage,
//           originalLanguage: msg.originalLanguage,
//           createdAt: msg.createdAt.toISOString()
//         }));

//         socket.emit("messages-history", {
//           messages: formattedMessages,
//           hasMore: messages.length === limit
//         });
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//         socket.emit("error", {
//           message: "মেসেজ লোড করতে ব্যর্থ হয়েছে"
//         });
//       }
//     });

//     socket.on("typing-start", ({ to }: { to: string }) => {
//       const senderData = connectedUsers.get(socket.id);
//       if (!senderData) return;

//       socket.to(to).emit("typing-start", { user: senderData.username });
//     });

//     socket.on("typing-stop", ({ to }: { to: string }) => {
//       const senderData = connectedUsers.get(socket.id);
//       if (!senderData) return;

//       socket.to(to).emit("typing-stop", { user: senderData.username });
//     });

//     socket.on("disconnect", async () => {
//       try {
//         console.log("🔴 User disconnected:", socket.id);

//         const userData = connectedUsers.get(socket.id);
//         connectedUsers.delete(socket.id);

//         if (userData) {
//           await User.updateOne(
//             { username: userData.username },
//             { $unset: { socketId: "" } }
//           );

//           socket.broadcast.emit("user-offline", { user: userData.username });
//         }

//         const onlineUsers = Array.from(connectedUsers.values()).map(u => u.username);
//         const allUsers = await User.find({});

//         io.emit("users-update", {
//           users: allUsers.map((u: any) => ({
//             username: u.username,
//             userLanguage: u.userLanguage,
//             online: onlineUsers.includes(u.username)
//           }))
//         });

//       } catch (error) {
//         console.error("Error during disconnect:", error);
//       }
//     });
//   });
// };