import { Router } from "express";
import { isLoggedIn } from "../middleware/auth";
import Message from "../models/Message";
import Chat from "../models/Chat";
import { Types } from "mongoose";

const messageRouter = Router();

// Search messages with filters
messageRouter.get("/search", isLoggedIn, async (req, res, next) => {
  try {
    const { q, chatId, limit = 50, fromDate, toDate, mediaType } = req.query;
    const userId = (req as any).user?._id;

    let query: any = {};

    // Text search
    if (q && typeof q === "string") {
      query.content = { $regex: q, $options: "i" };
    }

    // Date filters
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) {
        query.createdAt.$gte = new Date(fromDate as string);
      }
      if (toDate) {
        query.createdAt.$lte = new Date(toDate as string);
      }
    }

    // Media type filter
    if (mediaType && typeof mediaType === "string") {
      query.type = mediaType;
    }

    // If chatId provided, search only in that chat
    if (chatId && typeof chatId === "string") {
      const chat = await Chat.findById(chatId);
      if (!chat || !chat.participants.some((p: Types.ObjectId) => p.toString() === userId)) {
        res.status(403).json({ error: "Access denied to this chat" });
        return;
      }
      query.chatId = new Types.ObjectId(chatId);
    } else {
      // Otherwise, search in all user's chats
      const userChats = await Chat.find({ participants: userId }).select("_id");
      const chatIds = userChats.map(c => c._id);
      query.chatId = { $in: chatIds };
    }

    const messages = await Message.find(query)
      .populate("sender", "username avatar")
      .populate("chatId", "name type")
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ messages });
  } catch (err) {
    next(err);
  }
});

// Get media messages for a chat
messageRouter.get("/media/:chatId", isLoggedIn, async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { type, limit = 50 } = req.query;
    const userId = (req as any).user?._id;

    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.some((p: Types.ObjectId) => p.toString() === userId)) {
      res.status(403).json({ error: "Access denied to this chat" });
      return;
    }

    const query: any = {
      chatId: new Types.ObjectId(chatId),
      type: { $in: ["image", "video", "file", "voice"] }
    };

    if (type) {
      query.type = type;
    }

    const messages = await Message.find(query)
      .populate("sender", "username avatar")
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ messages });
  } catch (err) {
    next(err);
  }
});

// Get message by ID
messageRouter.get("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate("sender", "username avatar")
      .populate("chatId");

    if (!message) {
      res.status(404).json({ error: "Message not found" });
      return;
    }

    res.json(message);
  } catch (err) {
    next(err);
  }
});

// Mark message as read
messageRouter.post("/:id/read", isLoggedIn, async (req, res, next) => {
  try {
    const userId = (req as any).user?._id;
    const message = await Message.findById(req.params.id);

    if (!message) {
      res.status(404).json({ error: "Message not found" });
      return;
    }

    // Check if user is in the chat
    const chat = await Chat.findById(message.chatId);
    if (!chat || !chat.participants.some((p: Types.ObjectId) => p.toString() === userId)) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    // Add user to readBy if not already there
    if (!message.readBy.some((id: Types.ObjectId) => id.toString() === userId)) {
      message.readBy.push(new Types.ObjectId(userId));
      await message.save();
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default messageRouter;