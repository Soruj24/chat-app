import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { v2 as cloudinary } from "cloudinary";
import { getUserIdFromRequest } from "@/lib/auth";

// Cloudinary Configurations
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64 for Cloudinary
    const fileBase64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    console.log("Starting Cloudinary upload...");
    const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
      folder: "chat_app_uploads",
      resource_type: "auto", 
    });
    console.log("Cloudinary upload successful:", uploadResponse.secure_url);

    return NextResponse.json({ 
      url: uploadResponse.secure_url,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
