import dbConnect from "@/lib/db";
import Chat from "@/models/Chat";
import Message from "@/models/Message";
import { getUserIdFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);
    const { id: messageId } = await params;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 },
      );
    }

    const chat = await Chat.findById(message.chatId);
    if (!chat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    const msgObjectId = new mongoose.Types.ObjectId(messageId);
    const isPinned = chat.pinnedMessages?.some(
      (id: mongoose.Types.ObjectId) => id.toString() === messageId,
    );

    if (isPinned) {
      chat.pinnedMessages = chat.pinnedMessages.filter(
        (id: mongoose.Types.ObjectId) => id.toString() !== messageId,
      );
    } else {
      if (!chat.pinnedMessages) chat.pinnedMessages = [];
      chat.pinnedMessages.push(msgObjectId);
    }

    await chat.save();
    return NextResponse.json({ success: true, isPinned: !isPinned });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
}
