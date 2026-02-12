import dbConnect from "@/lib/db";
import Message from "@/models/Message";
import Chat from "@/models/Chat";
import { getUserIdFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);
    const { id: messageId } = await params;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return NextResponse.json({ message: "Message not found" }, { status: 404 });
    }

    // Only sender can delete their message (or chat admin)
    if (message.sender.toString() !== userId) {
      // Check if user is admin of the chat
      const chat = await Chat.findById(message.chatId);
      if (chat?.admin?.toString() !== userId) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    }

    await Message.findByIdAndDelete(messageId);

    // If it was the last message, update the chat
    const chat = await Chat.findById(message.chatId);
    if (chat && chat.lastMessage?.toString() === messageId) {
      const lastMsg = await Message.findOne({ chatId: chat._id }).sort({ timestamp: -1 });
      chat.lastMessage = lastMsg ? lastMsg._id : undefined;
      await chat.save();
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
}
