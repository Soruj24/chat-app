import dbConnect from "@/lib/db";
import Chat from "@/models/Chat";
import { getUserIdFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import type { IChat } from "@/lib/types";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);
    const { id: chatId } = await params;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
      return NextResponse.json({ message: "Invalid chatId" }, { status: 400 });
    }

    const { wallpaper, themeColor, name, avatar } = await req.json();

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    // Check if user is a participant
    if (!chat.participants.map((p: string) => p.toString()).includes(userId)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const updates: Partial<IChat> = {};
    if (wallpaper !== undefined) updates.wallpaper = wallpaper;
    if (themeColor !== undefined) updates.themeColor = themeColor;
    if (name !== undefined && chat.type === "group") updates.name = name;
    if (avatar !== undefined && chat.type === "group") updates.avatar = avatar;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $set: updates },
      { new: true },
    );

    return NextResponse.json(updatedChat);
  } catch (error: unknown) {
    console.error("Update Chat Error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
