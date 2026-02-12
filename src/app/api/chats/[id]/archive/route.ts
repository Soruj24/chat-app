import dbConnect from "@/lib/db";
import Chat from "@/models/Chat";
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
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const chat = await Chat.findById(id);
    if (!chat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    const isArchived = chat.archivedBy?.some(
      (uid: mongoose.Types.ObjectId) => uid.toString() === userId,
    );

    if (isArchived) {
      chat.archivedBy = chat.archivedBy.filter(
        (uid: mongoose.Types.ObjectId) => uid.toString() !== userId,
      );
    } else {
      if (!chat.archivedBy) chat.archivedBy = [];
      chat.archivedBy.push(new mongoose.Types.ObjectId(userId));
    }

    await chat.save();
    return NextResponse.json({ success: true, isArchived: !isArchived });
  } catch (error: unknown) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
