import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
export const api = {
  bodyParser: false,
};
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getUserIdFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    console.log("Upload request received");
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      console.log("Upload failed: Unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.log("Upload failed: No file in form data");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log(`Uploading file: ${file.name}, size: ${file.size}, type: ${file.type}`);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const ext = path.extname(file.name) || (file.type.startsWith('image/') ? '.jpg' : '.mp4');
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Ensure upload directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Directory might already exist
    }

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;
    console.log(`File uploaded successfully: ${fileUrl}`);

    return NextResponse.json({ 
      url: fileUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });
  } catch (error) {
    console.error("Upload error details:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
