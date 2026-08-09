import mongoose from "mongoose";
import { mongoUri } from "./secret";
import generateMockData from "./config/data";
import User from "./models/schemas/User";
import Chat from "./models/Chat";
import Message from "./models/Message";
import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

async function seed() {
  console.log("🌱 Seeding database...");
  console.log(`Connecting to: ${mongoUri.split("@")[1]?.split("/")[0] || mongoUri}`);

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
    } as any);
    console.log("✅ Connected to MongoDB\n");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  }

  try {
    const { users, chats, messages } = await generateMockData();

    await User.deleteMany({});
    await Chat.deleteMany({});
    await Message.deleteMany({});
    console.log("\n🧹 Cleared existing data");

    const createdUsers = (await User.insertMany(users as any)) as any[];
    console.log(`✅ Inserted ${createdUsers.length} users`);

    const createdChats = (await Chat.insertMany(chats as any)) as any[];
    console.log(`✅ Inserted ${createdChats.length} chats`);

    const createdMessages = (await Message.insertMany(messages as any)) as any[];
    console.log(`✅ Inserted ${createdMessages.length} messages`);

    // Update each chat with the lastMessage reference
    for (const chat of createdChats) {
      const chatMessages = createdMessages.filter(
        (m: any) => m.chatId.toString() === chat._id.toString()
      );
      if (chatMessages.length > 0) {
        const lastMsg = chatMessages[chatMessages.length - 1];
        await Chat.findByIdAndUpdate(chat._id, { lastMessage: lastMsg._id });
      }
    }
    console.log("✅ Updated chat lastMessage references");

    console.log("\n🎉 Seeding complete!");
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Chats: ${createdChats.length}`);
    console.log(`   Messages: ${createdMessages.length}`);

    console.log("\n📋 Login credentials:");
    console.log(`   Super Admin: superadmin@example.com / superadmin123`);
    console.log(`   Admin:       admin@example.com / admin123`);
    console.log(`   Moderator:   moderator@example.com / moderator123`);
    console.log(`   Regular:     <any_user_email> / password123`);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("\n👋 Disconnected from MongoDB");
  }
}

seed();