import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Story from "@/models/Story";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get stories from the last 24 hours
    const stories = await Story.find({
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    const formattedStories = stories.map(story => ({
      id: story._id.toString(),
      userId: story.userId.toString(),
      userName: story.userName,
      userAvatar: story.userAvatar,
      mediaUrl: story.mediaUrl,
      type: story.type,
      timestamp: story.createdAt.toISOString(),
      isRead: story.isRead
    }));

    return NextResponse.json(formattedStories);
  } catch (error) {
    console.error("Failed to fetch stories:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { mediaUrl, type, userName, userAvatar } = body;

    const newStory = await Story.create({
      userId,
      userName,
      userAvatar,
      mediaUrl,
      type: type || 'image',
    });

    return NextResponse.json({
      id: newStory._id.toString(),
      userId: newStory.userId.toString(),
      userName: newStory.userName,
      userAvatar: newStory.userAvatar,
      mediaUrl: newStory.mediaUrl,
      type: newStory.type,
      timestamp: newStory.createdAt.toISOString(),
      isRead: newStory.isRead
    });
  } catch (error) {
    console.error("Failed to create story:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
