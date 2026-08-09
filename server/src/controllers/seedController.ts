import { Request, Response, NextFunction } from "express";
import generateMockData from "../config/data";
import User from "../models/schemas/User";
import Chat from "../models/Chat";
import Message from "../models/Message";

export const seedAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { users, chats, messages } = await generateMockData();

    await User.deleteMany({});
    await Chat.deleteMany({});
    await Message.deleteMany({});

    const createdUsers = (await User.insertMany(users as any)) as any[];
    const createdChats = (await Chat.insertMany(chats as any)) as any[];
    const createdMessages = (await Message.insertMany(messages as any)) as any[];

    // Update each chat with the lastMessage reference
    for (const chat of createdChats) {
      const chatMessages = createdMessages.filter(
        (m: any) => m.chatId.toString() === chat._id.toString()
      );
      if (chatMessages.length > 0) {
        const lastMsg = chatMessages[chatMessages.length - 1];
        await Chat.findByIdAndUpdate(chat._id, { lastMessage: lastMsg._id });
      }
    }

    res.status(201).json({
      success: true,
      message: "Seed data added successfully",
      stats: {
        users: createdUsers.length,
        chats: createdChats.length,
        messages: createdMessages.length,
      },
    });
  } catch (error: any) {
    next(error);
  }
};

export const getSeedStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userCount = await User.countDocuments();
    const chatCount = await Chat.countDocuments();
    const messageCount = await Message.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        users: userCount,
        chats: chatCount,
        messages: messageCount,
      },
    });
  } catch (error: any) {
    next(error);
  }
};
