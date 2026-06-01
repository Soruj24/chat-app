import { Router } from "express";
import { Types } from "mongoose";
import { isLoggedIn } from "../middleware/auth";
import Chat from "../models/Chat";

const chatRouter = Router();

chatRouter.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const userId = (req as any).user?._id;
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "username avatar")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });
    res.json({ chats });
  } catch (err) {
    next(err);
  }
});

chatRouter.get("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate("participants", "username avatar")
      .populate("lastMessage");
    if (!chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }
    res.json({ chat });
  } catch (err) {
    next(err);
  }
});

chatRouter.post("/", isLoggedIn, async (req, res, next) => {
  try {
    let { participantIds, type, name, avatar } = req.body;
    const userId = new Types.ObjectId((req as any).user?._id);

    // Handle both participantId (singular) and participantIds (array)
    if (!participantIds) {
      participantIds = req.body.participantId ? [req.body.participantId] : [];
    }

    if (!Array.isArray(participantIds)) {
      participantIds = [participantIds];
    }

    if (participantIds.length === 0) {
      res.status(400).json({ error: "participantIds is required" });
      return;
    }

    let chat;
    if (type === "channel") {
      chat = await Chat.create({
        participants: [userId],
        type: "channel",
        name,
        avatar,
        admin: userId,
        isPublic: req.body.isPublic || false,
        description: req.body.description,
      });
    } else if (type === "group") {
      chat = await Chat.create({
        participants: [...participantIds, userId],
        type: "group",
        name,
        avatar,
        admin: userId,
      });
    } else {
      const otherParticipantId = participantIds[0];
      if (!otherParticipantId) {
        res.status(400).json({ error: "Other participant ID is required" });
        return;
      }
      const existingChat = await Chat.findOne({
        participants: { $all: [userId, new Types.ObjectId(otherParticipantId)] },
        type: "private",
      });
      if (existingChat) {
        const populatedChat = await Chat.findById(existingChat._id)
          .populate("participants", "username avatar")
          .populate("lastMessage");
        res.json(populatedChat);
        return;
      }
      chat = await Chat.create({
        participants: [userId, new Types.ObjectId(otherParticipantId)],
        type: "private",
      });
    }

    const populatedChat = await Chat.findById(chat._id)
      .populate("participants", "username avatar")
      .populate("lastMessage");
    res.status(201).json(populatedChat);
  } catch (err) {
    next(err);
  }
});

chatRouter.put("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const { name, avatar, themeColor, wallpaper } = req.body;
    const chat = await Chat.findByIdAndUpdate(
      req.params.id,
      { name, avatar, themeColor, wallpaper },
      { new: true },
    ).populate("participants", "username avatar");
    res.json({ chat });
  } catch (err) {
    next(err);
  }
});

chatRouter.delete("/:id", isLoggedIn, async (req, res, next) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.json({ message: "Chat deleted" });
  } catch (err) {
    next(err);
  }
});

chatRouter.post("/:id/pin", isLoggedIn, async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }
    const userId = new Types.ObjectId((req as any).user?._id);
    const isPinned = !chat.pinnedBy.some(
      (id: Types.ObjectId) => id.toString() === userId.toString(),
    );
    if (isPinned) {
      chat.pinnedBy.push(userId);
    } else {
      chat.pinnedBy = chat.pinnedBy.filter(
        (id: Types.ObjectId) => id.toString() !== userId.toString(),
      );
    }
    await chat.save();
    res.json({ isPinned });
  } catch (err) {
    next(err);
  }
});

chatRouter.post("/:id/archive", isLoggedIn, async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }
    const userId = new Types.ObjectId((req as any).user?._id);
    const isArchived = !chat.archivedBy.some(
      (id: Types.ObjectId) => id.toString() === userId.toString(),
    );
    if (isArchived) {
      chat.archivedBy.push(userId);
    } else {
      chat.archivedBy = chat.archivedBy.filter(
        (id: Types.ObjectId) => id.toString() !== userId.toString(),
      );
    }
    await chat.save();
    res.json({ isArchived });
  } catch (err) {
    next(err);
  }
});

// Group management routes
chatRouter.post("/:id/add-members", isLoggedIn, async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }

    const userId = (req as any).user?._id;
    if (chat.admin?.toString() !== userId) {
      res.status(403).json({ error: "Only admin can add members" });
      return;
    }

    const { userIds } = req.body;
    if (!Array.isArray(userIds)) {
      res.status(400).json({ error: "userIds must be an array" });
      return;
    }

    const newMembers = userIds.map((id: string) => new Types.ObjectId(id));
    newMembers.forEach((memberId: Types.ObjectId) => {
      if (!chat.participants.some((p: Types.ObjectId) => p.toString() === memberId.toString())) {
        chat.participants.push(memberId);
      }
    });

    await chat.save();
    const updatedChat = await Chat.findById(chat._id)
      .populate("participants", "username avatar");

    res.json({ chat: updatedChat });
  } catch (err) {
    next(err);
  }
});

chatRouter.post("/:id/remove-member", isLoggedIn, async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }

    const userId = (req as any).user?._id;
    const { memberId } = req.body;

    // Only admin can remove members, or user can remove themselves
    if (chat.admin?.toString() !== userId && memberId !== userId) {
      res.status(403).json({ error: "Not authorized" });
      return;
    }

    chat.participants = chat.participants.filter(
      (p: Types.ObjectId) => p.toString() !== memberId
    );

    await chat.save();
    const updatedChat = await Chat.findById(chat._id)
      .populate("participants", "username avatar");

    res.json({ chat: updatedChat });
  } catch (err) {
    next(err);
  }
});

chatRouter.post("/:id/make-admin", isLoggedIn, async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }

    const userId = (req as any).user?._id;
    if (chat.admin?.toString() !== userId) {
      res.status(403).json({ error: "Only admin can make someone admin" });
      return;
    }

    const { memberId } = req.body;
    chat.admin = new Types.ObjectId(memberId);
    await chat.save();

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

chatRouter.post("/:id/leave", isLoggedIn, (req, res, next) => {
  (async () => {
    try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const userId = (req as any).user?._id;

    if (chat.type === "group") {
      chat.participants = chat.participants.filter(
        (p: Types.ObjectId) => p.toString() !== userId
      );

      // If admin leaves, assign new admin
      if (chat.admin?.toString() === userId && chat.participants.length > 0) {
        chat.admin = chat.participants[0];
      }

      if (chat.participants.length === 0) {
        await Chat.findByIdAndDelete(chat._id);
        return res.json({ success: true, chatDeleted: true });
      }

      await chat.save();
    } else {
      await Chat.findByIdAndDelete(chat._id);
    }

    return res.json({ success: true });
    } catch (err) {
      next(err);
    }
  })();
});

chatRouter.post("/:id/mute", isLoggedIn, async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }
    const userId = new Types.ObjectId((req as any).user?._id);
    const isMuted = !chat.mutedBy.some(
      (id: Types.ObjectId) => id.toString() === userId.toString(),
    );
    if (isMuted) {
      chat.mutedBy.push(userId);
    } else {
      chat.mutedBy = chat.mutedBy.filter(
        (id: Types.ObjectId) => id.toString() !== userId.toString(),
      );
    }
    await chat.save();
    res.json({ isMuted });
  } catch (err) {
    next(err);
  }
});

export default chatRouter;
