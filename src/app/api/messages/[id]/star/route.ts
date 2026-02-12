import dbConnect from "@/lib/db";
import User from "@/models/User";
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

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const msgObjectId = new mongoose.Types.ObjectId(messageId);
    const isStarred = user.starredMessages?.some(
      (id: mongoose.Types.ObjectId) => id.toString() === messageId,
    );

    if (isStarred) {
      user.starredMessages = user.starredMessages.filter(
        (id: mongoose.Types.ObjectId) => id.toString() !== messageId,
      );
    } else {
      if (!user.starredMessages) user.starredMessages = [];
      user.starredMessages.push(msgObjectId);
    }

    await user.save();
    return NextResponse.json({ success: true, isStarred: !isStarred });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
}
