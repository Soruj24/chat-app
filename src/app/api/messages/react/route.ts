import dbConnect from "@/lib/db";
import Message, { IReaction } from "@/models/Message";
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

    const { messageId, emoji } = await req.json();

    if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) {
      return NextResponse.json({ message: "Invalid messageId" }, { status: 400 });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return NextResponse.json({ message: "Message not found" }, { status: 404 });
    }

    if (!message.reactions) {
      message.reactions = [];
    }

    // Check if user already reacted with this emoji
    const existingReactionIndex = message.reactions.findIndex(
      (r: IReaction) => r.userId.toString() === userId && r.emoji === emoji
    );

    if (existingReactionIndex > -1) {
      // Remove reaction if already exists (toggle behavior)
      message.reactions.splice(existingReactionIndex, 1);
    } else {
      // Add new reaction
      message.reactions.push({
        userId: new mongoose.Types.ObjectId(userId),
        emoji
      });
    }

    await message.save();

    return NextResponse.json(message);
  } catch (error: unknown) {
    console.error("API Message React Error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
