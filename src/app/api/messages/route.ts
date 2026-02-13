import dbConnect from "@/lib/db";
import Message from "@/models/Message";
import Chat from "@/models/Chat";
import { getUserIdFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { chatId, text, type, mediaUrl, fileName, fileSize, duration, location, contact, replyTo, isForwarded } = await req.json();

    if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
      return NextResponse.json({ message: "Invalid chatId" }, { status: 400 });
    }

    const message = await Message.create({
      chatId: new mongoose.Types.ObjectId(chatId),
      sender: new mongoose.Types.ObjectId(userId),
      text,
      type: type || 'text',
      mediaUrl,
      fileName,
      fileSize,
      duration,
      location,
      contact,
      replyTo: replyTo && mongoose.Types.ObjectId.isValid(replyTo) 
        ? new mongoose.Types.ObjectId(replyTo) 
        : undefined,
      isForwarded: !!isForwarded,
      timestamp: new Date(),
      status: 'sent'
    });

    // Update last message in Chat
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id
    });

    return NextResponse.json(message);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("API Message Error:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
}
