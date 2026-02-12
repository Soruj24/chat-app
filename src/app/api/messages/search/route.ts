import dbConnect from "@/lib/db";
import Message from "@/models/Message";
import Chat from "@/models/Chat";
import { getUserIdFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json([]);
    }

    // 1. Find all chats the user is a participant in
    const userChats = await Chat.find({
      participants: userId
    }).select("_id");

    const chatIds = userChats.map(chat => chat._id);

    // 2. Search messages in those chats
    const messages = await Message.find({
      chatId: { $in: chatIds },
      text: { $regex: query, $options: "i" }
    })
    .populate("sender", "name avatar")
    .sort({ timestamp: -1 })
    .limit(20)
    .lean();

    // Map to frontend format
    const results = messages.map(msg => ({
      chatId: msg.chatId,
      message: {
        id: msg._id,
        text: msg.text,
        timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        senderName: (msg.sender as any)?.name || "User",
        senderAvatar: (msg.sender as any)?.avatar,
        senderId: (msg.sender as any)?._id || msg.sender
      }
    }));

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Global Search Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
