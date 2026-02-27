import dbConnect from "@/lib/db";
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

    const chats = await Chat.find({
      participants: userId
    })
    .populate("participants", "name username avatar email")
    .populate("lastMessage")
    .sort({ updatedAt: -1 });

    const chatsWithStatus = chats.map(chat => {
      const chatObj = chat.toObject();
      return {
        ...chatObj,
        id: chatObj._id.toString(),
        isPinned: chat.pinnedBy?.some((id: mongoose.Types.ObjectId) => id.toString() === userId),
        isArchived: chat.archivedBy?.some((id: mongoose.Types.ObjectId) => id.toString() === userId),
        isMuted: chat.mutedBy?.some((id: mongoose.Types.ObjectId) => id.toString() === userId),
      };
    });

    return NextResponse.json(chatsWithStatus);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: "Unknown error" }, { status: 500 });
    }
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { participantId, participantIds, type, name, description, avatar } = await req.json();

    if (type === 'private') {
      // Check if private chat already exists
      let chat = await Chat.findOne({
        type: 'private',
        participants: { $all: [userId, participantId], $size: 2 }
      });

      if (chat) {
        const populatedChat = await Chat.findById(chat._id).populate("participants", "name username avatar email");
        const obj = populatedChat.toObject();
        return NextResponse.json({ ...obj, id: obj._id.toString() });
      }

      chat = await Chat.create({
        type: 'private',
        participants: [userId, participantId]
      });

      const populatedChat = await Chat.findById(chat._id).populate("participants", "name username avatar email");
      const obj = populatedChat.toObject();
      return NextResponse.json({ ...obj, id: obj._id.toString() });
    } else {
      // Create group chat
      const participants = participantIds || [participantId];
      if (!participants.includes(userId)) {
        participants.push(userId);
      }

      const chat = await Chat.create({
        type: 'group',
        participants,
        name,
        description,
        avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
        admin: userId
      });

      const populatedChat = await Chat.findById(chat._id).populate("participants", "name username avatar email");
      const obj = populatedChat.toObject();
      return NextResponse.json({ ...obj, id: obj._id.toString() });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: "Unknown error" }, { status: 500 });
    }
  }
}
