import dbConnect from "@/lib/db";
import Message from "@/models/Message";
import { getUserIdFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid chatId" }, { status: 400 });
    }

    const messages = await Message.find({ 
      chatId: new mongoose.Types.ObjectId(id) 
    })
    .populate("sender", "name avatar")
    .populate({
      path: "replyTo",
      populate: { path: "sender", select: "name" }
    })
    .sort({ timestamp: 1 })
    .lean(); // Use lean for better performance

    console.log(`Fetched ${messages.length} messages for chat ${id}`);

    return NextResponse.json(messages);
  } catch (error: unknown) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
