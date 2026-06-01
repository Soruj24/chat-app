import { Router } from "express";
import { Schema, Types } from "mongoose";
import { isLoggedIn } from "../middleware/auth";
import Chat from "../models/Chat";
import Message from "../models/Message";

const messageRouter = Router();

// Get messages for a chat
messageRouter.get("/chat/:chatId", isLoggedIn, async (req, res, next) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .populate("sender", "username avatar")
      .sort({ createdAt: 1 });
    res.json({ messages });
  } catch (err) {
    next(err);
  }
});

// Search messages
messageRouter.get("/search", isLoggedIn, async (req, res, next) => {
  try {
    const { q, chatId, limit = 50 } = req.query;
    const userId = (req as any).user?._id;

    if (!q || typeof q !== "string") {
      res.status(400).json({ error: "Search query is required" });
      return;
    }

    let query: any = {
      content: { $regex: q, $options: "i" },
    };

    if (chatId && typeof chatId === "string") {
      const chat = await Chat.findById(chatId);
      if (!chat || !chat.participants.some((p: Types.ObjectId) => p.toString() === userId)) {
        res.status(403).json({ error: "Access denied to this chat" });
        return;
      }
      query.chatId = new Types.ObjectId(chatId);
    } else {
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

// Create message
messageRouter.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const { chatId, content, type, fileUrl, replyTo } = req.body;
    const senderId = (req as any).user?._id;

    const message = await Message.create({
      chatId: new Types.ObjectId(chatId),
      sender: new Types.ObjectId(senderId),
      content,
      type: type || "text",
      fileUrl,
      replyTo,
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
      updatedAt: new Date(),
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "username avatar")
      .populate("replyTo");

    res.status(201).json({ message: populatedMessage });
  } catch (err) {
    next(err);
  }
});

// Update message (edit)
messageRouter.put("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const { content } = req.body;
    const userId = (req as any).user?._id;
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      res.status(404).json({ error: "Message not found" });
      return;
    }
    
    const isSender = message.sender.toString() === userId.toString();
    if (!isSender) {
      res.status(403).json({ error: "Only the sender can edit this message" });
      return;
    }
    
    message.content = content;
    message.text = content;
    await message.save();
    
    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "username avatar");
    
    res.json({ message: populatedMessage });
  } catch (err) {
    next(err);
  }
});

// Delete message for everyone (Telegram-style delete for everyone)
messageRouter.delete("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const { deleteForEveryone } = req.query;
    const userId = (req as any).user?._id;
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      res.status(404).json({ error: "Message not found" });
      return;
    }
    
    if (deleteForEveryone === "true") {
      const isSender = message.sender.toString() === userId.toString();
      if (!isSender) {
        res.status(403).json({ error: "Only the sender can delete this message for everyone" });
        return;
      }
      message.isDeletedForEveryone = true;
      message.content = "";
      message.mediaUrl = "";
      await message.save();
      res.json({ message: "Message deleted for everyone", deletedForEveryone: true });
    } else {
      message.deletedBy.push(new Types.ObjectId(userId));
      await message.save();
      res.json({ message: "Message deleted for you", deletedForMe: true });
    }
  } catch (err) {
    next(err);
  }
});

// Pin message
messageRouter.post("/:id/pin", isLoggedIn, async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      res.status(404).json({ error: "Message not found" });
      return;
    }
    message.isPinned = !message.isPinned;
    await message.save();
    res.json({ message });
  } catch (err) {
    next(err);
  }
});

// Star message
messageRouter.post("/:id/star", isLoggedIn, async (req, res, next) => {
  try {
    const userId = (req as any).user?._id;
    const message = await Message.findById(req.params.id);
    if (!message) {
      res.status(404).json({ error: "Message not found" });
      return;
    }
    const starIndex = message.starredBy.findIndex(
      (id: Schema.Types.ObjectId) => id.toString() === userId,
    );
    if (starIndex > -1) {
      message.starredBy.splice(starIndex, 1);
    } else {
      message.starredBy.push(new Types.ObjectId(userId));
    }
    await message.save();
    res.json({ message });
  } catch (err) {
    next(err);
  }
});

// React to message
messageRouter.post("/react", isLoggedIn, async (req, res, next) => {
  try {
    const { messageId, emoji, userId } = req.body;
    const message = await Message.findById(messageId);
    if (!message) {
      res.status(404).json({ error: "Message not found" });
      return;
    }
    const existingReaction = message.reactions.find(
      (r: { userId: Schema.Types.ObjectId; emoji: string }) =>
        r.userId.toString() === userId && r.emoji === emoji,
    );
    if (existingReaction) {
      message.reactions = message.reactions.filter(
        (r: { userId: Schema.Types.ObjectId; emoji: string }) =>
          !(r.userId.toString() === userId && r.emoji === emoji),
      );
    } else {
      message.reactions.push({ userId: new Types.ObjectId(userId), emoji });
    }
    await message.save();
    res.json({ message });
  } catch (err) {
    next(err);
  }
});

export default messageRouter;