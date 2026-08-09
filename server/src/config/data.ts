import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import {
  Gender,
  UserRole,
  UserStatus,
  Permission,
} from "../models/interfaces/IUser";

// Reserved usernames that should be avoided
const RESERVED_USERNAMES = [
  "admin",
  "administrator",
  "root",
  "system",
  "null",
  "undefined",
  "api",
  "www",
  "support",
  "help",
  "contact",
  "test",
  "moderator",
  "guest",
  "anonymous",
  "user",
  "users",
  "settings",
  "config",
];

// Unsplash Image Helper Functions
const getUnsplashAvatar = (): string => {
  return `https://images.unsplash.com/photo-${faker.helpers.arrayElement([
    "1472099645785-5658abf4ff4e",
    "1494790108755-2616c60b6635",
    "1507003211169-0a1dd7228f2d",
    "1517841905240-472988babdf9",
    "1573496359142-b8d87734a5a2",
    "1560250097-0b93528c311a",
  ])}?w=150&h=150&fit=crop&crop=face`;
};

// Custom phone number generator that always returns valid numbers
const generateValidPhoneNumber = (): string => {
  const bangladeshNumbers = [
    "+8801312345678",
    "+8801412345678",
    "+8801512345678",
    "+8801612345678",
    "+8801712345678",
    "+8801812345678",
    "+8801912345678",
    "+8801321234567",
    "+8801421234567",
    "+8801521234567",
    "+8801621234567",
    "+8801721234567",
    "+8801821234567",
    "+8801921234567",
  ];

  return faker.helpers.arrayElement(bangladeshNumbers);
};

// Custom username generator that avoids reserved usernames
const generateValidUsername = (): string => {
  let username: string;
  let attempts = 0;

  do {
    // Generate a username
    username = faker.internet
      .username()
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, "")
      .substring(0, 30); // Ensure it doesn't exceed max length

    // Add some random characters if it's a reserved username
    if (RESERVED_USERNAMES.includes(username)) {
      username = username + faker.string.numeric(2);
    }

    attempts++;

    // Prevent infinite loop
    if (attempts > 10) {
      username = `user_${faker.string.alphanumeric(8)}`;
      break;
    }
  } while (RESERVED_USERNAMES.includes(username));

  return username;
};

// Password Helper
const generateHashedPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// USER GENERATION
const generateMockUsers = async (): Promise<any[]> => {
  const users: any[] = [];
  const usedUsernames = new Set<string>();
  const usedEmails = new Set<string>();

  // Generate admin users first
  const adminUser = {
    _id: new mongoose.Types.ObjectId(),
    username: "admin_user",
    email: "admin@example.com",
    password: await generateHashedPassword("admin123"),
    firstName: "System",
    lastName: "Administrator",
    displayName: "System Administrator",
    avatar: {
      url: getUnsplashAvatar(),
      publicId: `avatar-admin-${faker.string.uuid()}`,
    },
    role: UserRole.ADMIN,
    permissions: [
      Permission.USERS_VIEW,
      Permission.USERS_CREATE,
      Permission.USERS_EDIT,
      Permission.ANALYTICS_VIEW,
    ],
    status: UserStatus.ACTIVE,
    isVerified: true,
    emailVerified: true,
    isActive: true,
    phone: generateValidPhoneNumber(),
    phoneVerified: true,
    gender: Gender.MALE,
    dateOfBirth: new Date("1985-01-01"),
    userLanguage: "en",
    timezone: "UTC",
    registrationIP: faker.internet.ipv4(),
    detectedCountry: "BD",
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true,
        marketing: false,
        security: true,
        social: true,
        system: true,
      },
      privacy: {
        profileVisibility: "public",
        showEmail: false,
        showPhone: false,
        showOnlineStatus: true,
        showLastSeen: true,
        allowFriendRequests: true,
        allowDirectMessages: true,
        searchable: true,
      },
      security: {
        requireTwoFactorForPasswordChange: true,
        requireTwoFactorForEmailChange: true,
        sessionTimeout: 60,
        allowMultipleSessions: true,
        suspiciousActivityAlerts: true,
      },
      language: "en",
      currency: "USD",
      timezone: "UTC",
      dateFormat: "YYYY-MM-DD",
      timeFormat: "24",
    },
    addresses: [
      {
        type: "home",
        street: "123 Admin Street",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        zipCode: "1200",
        isDefault: true,
      },
    ],
    loginCount: faker.number.int({ min: 50, max: 200 }),
    lastLoginAt: new Date(),
    accountCreatedAt: new Date(),
    metadata: {
      userAgent: faker.internet.userAgent(),
      initialCountry: "BD",
      signupFlow: "direct",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  users.push(adminUser);
  usedUsernames.add("admin_user");
  usedEmails.add("admin@example.com");

  // Generate super admin
  const superAdminUser = {
    _id: new mongoose.Types.ObjectId(),
    username: "super_admin",
    email: "superadmin@example.com",
    password: await generateHashedPassword("superadmin123"),
    firstName: "Super",
    lastName: "Admin",
    displayName: "Super Admin",
    avatar: {
      url: getUnsplashAvatar(),
      publicId: `avatar-superadmin-${faker.string.uuid()}`,
    },
    role: UserRole.SUPER_ADMIN,
    permissions: Object.values(Permission),
    status: UserStatus.ACTIVE,
    isVerified: true,
    emailVerified: true,
    isActive: true,
    phone: generateValidPhoneNumber(),
    phoneVerified: true,
    gender: Gender.MALE,
    dateOfBirth: new Date("1980-01-01"),
    userLanguage: "en",
    timezone: "UTC",
    registrationIP: faker.internet.ipv4(),
    detectedCountry: "BD",
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true,
        marketing: false,
        security: true,
        social: true,
        system: true,
      },
      privacy: {
        profileVisibility: "private",
        showEmail: false,
        showPhone: false,
        showOnlineStatus: true,
        showLastSeen: false,
        allowFriendRequests: false,
        allowDirectMessages: false,
        searchable: false,
      },
      security: {
        requireTwoFactorForPasswordChange: true,
        requireTwoFactorForEmailChange: true,
        sessionTimeout: 30,
        allowMultipleSessions: false,
        suspiciousActivityAlerts: true,
      },
      language: "en",
      currency: "USD",
      timezone: "UTC",
      dateFormat: "YYYY-MM-DD",
      timeFormat: "24",
    },
    addresses: [
      {
        type: "work",
        street: "456 Super Admin Ave",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        zipCode: "1200",
        isDefault: true,
      },
    ],
    loginCount: faker.number.int({ min: 100, max: 300 }),
    lastLoginAt: new Date(),
    accountCreatedAt: new Date(),
    metadata: {
      userAgent: faker.internet.userAgent(),
      initialCountry: "BD",
      signupFlow: "direct",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  users.push(superAdminUser);
  usedUsernames.add("super_admin");
  usedEmails.add("superadmin@example.com");

  // Generate moderator
  const moderatorUser = {
    _id: new mongoose.Types.ObjectId(),
    username: "moderator_user",
    email: "moderator@example.com",
    password: await generateHashedPassword("moderator123"),
    firstName: "System",
    lastName: "Moderator",
    displayName: "System Moderator",
    avatar: {
      url: getUnsplashAvatar(),
      publicId: `avatar-moderator-${faker.string.uuid()}`,
    },
    role: UserRole.MODERATOR,
    permissions: [
      Permission.USERS_VIEW,
      Permission.CONTENT_VIEW,
      Permission.CONTENT_CREATE,
      Permission.CONTENT_EDIT,
      Permission.TICKETS_VIEW,
      Permission.TICKETS_EDIT,
    ],
    status: UserStatus.ACTIVE,
    isVerified: true,
    emailVerified: true,
    isActive: true,
    phone: generateValidPhoneNumber(),
    phoneVerified: true,
    gender: Gender.FEMALE,
    dateOfBirth: new Date("1990-01-01"),
    userLanguage: "en",
    timezone: "UTC",
    registrationIP: faker.internet.ipv4(),
    detectedCountry: "BD",
    preferences: {
      notifications: {
        email: true,
        sms: true,
        push: true,
        marketing: false,
        security: true,
        social: true,
        system: true,
      },
      privacy: {
        profileVisibility: "public",
        showEmail: false,
        showPhone: false,
        showOnlineStatus: true,
        showLastSeen: true,
        allowFriendRequests: true,
        allowDirectMessages: true,
        searchable: true,
      },
      security: {
        requireTwoFactorForPasswordChange: true,
        requireTwoFactorForEmailChange: false,
        sessionTimeout: 60,
        allowMultipleSessions: true,
        suspiciousActivityAlerts: true,
      },
      language: "en",
      currency: "USD",
      timezone: "UTC",
      dateFormat: "YYYY-MM-DD",
      timeFormat: "24",
    },
    addresses: [
      {
        type: "work",
        street: "789 Mod Plaza",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        zipCode: "1200",
        isDefault: true,
      },
    ],
    loginCount: faker.number.int({ min: 20, max: 100 }),
    lastLoginAt: new Date(),
    accountCreatedAt: new Date(),
    metadata: {
      userAgent: faker.internet.userAgent(),
      initialCountry: "BD",
      signupFlow: "direct",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  users.push(moderatorUser);
  usedUsernames.add("moderator_user");
  usedEmails.add("moderator@example.com");

  // Generate regular users
  const NUM_USERS = 50;
  for (let i = 0; i < NUM_USERS - 3; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    // Generate unique username
    let username: string;
    let attempts = 0;

    do {
      username = generateValidUsername();
      attempts++;

      // If we can't generate a unique username after several attempts, create a custom one
      if (attempts > 5) {
        username = `user_${firstName.toLowerCase()}_${faker.string.numeric(4)}`;
      }
    } while (usedUsernames.has(username) && attempts < 10);

    usedUsernames.add(username);

    // Generate unique email
    let email: string;
    attempts = 0;

    do {
      email = faker.internet.email({ firstName, lastName }).toLowerCase();
      attempts++;

      if (attempts > 5) {
        email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${faker.string.numeric(
          3,
        )}@example.com`;
      }
    } while (usedEmails.has(email) && attempts < 10);

    usedEmails.add(email);

    users.push({
      _id: new mongoose.Types.ObjectId(),
      username: username,
      email: email,
      password: await generateHashedPassword("password123"),
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      avatar: {
        url: getUnsplashAvatar(),
        publicId: `avatar-${faker.string.uuid()}`,
      },
      role: faker.helpers.arrayElement([UserRole.USER, UserRole.PREMIUM]),
      permissions: [],
      status: UserStatus.ACTIVE,
      isVerified: faker.datatype.boolean(0.8),
      emailVerified: faker.datatype.boolean(0.8),
      isActive: true,
      phone: generateValidPhoneNumber(),
      phoneVerified: faker.datatype.boolean(0.6),
      gender: faker.helpers.arrayElement(Object.values(Gender)),
      dateOfBirth: faker.date.birthdate({ min: 18, max: 70, mode: "age" }),
      bio: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : undefined,
      userLanguage: faker.helpers.arrayElement(["en", "bn", "hi", "ur"]),
      timezone: faker.helpers.arrayElement([
        "UTC",
        "America/New_York",
        "Europe/London",
        "Asia/Dhaka",
      ]),
      registrationIP: faker.internet.ipv4(),
      detectedCountry: faker.location.countryCode("alpha-2"),
      preferences: {
        notifications: {
          email: faker.datatype.boolean(0.8),
          sms: faker.datatype.boolean(0.3),
          push: faker.datatype.boolean(0.7),
          marketing: faker.datatype.boolean(0.2),
          security: faker.datatype.boolean(0.9),
          social: faker.datatype.boolean(0.6),
          system: faker.datatype.boolean(0.5),
        },
        privacy: {
          profileVisibility: faker.helpers.arrayElement([
            "public",
            "friends",
            "private",
          ]),
          showEmail: false,
          showPhone: false,
          showOnlineStatus: faker.datatype.boolean(0.7),
          showLastSeen: faker.datatype.boolean(0.6),
          allowFriendRequests: faker.datatype.boolean(0.8),
          allowDirectMessages: faker.datatype.boolean(0.7),
          searchable: faker.datatype.boolean(0.9),
        },
        security: {
          requireTwoFactorForPasswordChange: faker.datatype.boolean(0.3),
          requireTwoFactorForEmailChange: faker.datatype.boolean(0.2),
          sessionTimeout: faker.helpers.arrayElement([30, 60, 120, 180]),
          allowMultipleSessions: faker.datatype.boolean(0.8),
          suspiciousActivityAlerts: faker.datatype.boolean(0.7),
        },
        language: faker.helpers.arrayElement(["en", "bn", "hi", "ur"]),
        currency: faker.helpers.arrayElement(["USD", "EUR", "GBP", "BDT"]),
        timezone: faker.helpers.arrayElement([
          "UTC",
          "America/New_York",
          "Europe/London",
          "Asia/Dhaka",
        ]),
        dateFormat: "YYYY-MM-DD",
        timeFormat: faker.helpers.arrayElement(["12", "24"]),
      },
      addresses: [
        {
          type: faker.helpers.arrayElement(["home", "work", "billing"]),
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          country: faker.location.country(),
          zipCode: faker.location.zipCode(),
          isDefault: true,
        },
      ],
      loginCount: faker.number.int({ min: 0, max: 50 }),
      lastLoginAt: faker.date.recent(),
      accountCreatedAt: faker.date.past({ years: 2 }),
      metadata: {
        userAgent: faker.internet.userAgent(),
        initialCountry: faker.location.countryCode("alpha-2"),
        signupFlow: faker.helpers.arrayElement(["direct", "social", "invite"]),
      },
      createdAt: faker.date.past({ years: 2 }),
      updatedAt: faker.date.recent(),
    });
  }

  return users;
};

// CHAT GENERATION
const generateMockChats = (users: any[]): any[] => {
  const chats: any[] = [];
  const usedPairs = new Set<string>();

  // Private chats between regular users
  const regularUsers = users.filter(
    (u) => u.role === UserRole.USER || u.role === UserRole.PREMIUM
  );
  const NUM_PRIVATE_CHATS = 30;

  for (let i = 0; i < NUM_PRIVATE_CHATS && i < regularUsers.length - 1; i++) {
    const user1 = regularUsers[i];
    const user2 = regularUsers[(i + 1) % regularUsers.length];
    const pairKey = [user1._id.toString(), user2._id.toString()]
      .sort()
      .join(":");
    if (usedPairs.has(pairKey)) continue;
    usedPairs.add(pairKey);

    chats.push({
      _id: new mongoose.Types.ObjectId(),
      participants: [user1._id, user2._id],
      type: "private",
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent(),
    });
  }

  // Some extra private chats with admins
  for (const admin of users.filter((u) => u.role === UserRole.ADMIN || u.role === UserRole.SUPER_ADMIN)) {
    for (let i = 0; i < 3; i++) {
      const otherUser = faker.helpers.arrayElement(regularUsers);
      const pairKey = [admin._id.toString(), otherUser._id.toString()]
        .sort()
        .join(":");
      if (usedPairs.has(pairKey)) continue;
      usedPairs.add(pairKey);
      chats.push({
        _id: new mongoose.Types.ObjectId(),
        participants: [admin._id, otherUser._id],
        type: "private",
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent(),
      });
    }
  }

  // Group chats
  const NUM_GROUPS = 5;
  const groupNames = [
    "Tech Talk",
    "Gaming Squad",
    "Book Club",
    "Travel Buddies",
    "Music Lovers",
  ];

  for (let i = 0; i < NUM_GROUPS; i++) {
    const memberCount = faker.number.int({ min: 3, max: 8 });
    const members = faker.helpers.arrayElements(regularUsers, memberCount);
    const admin = faker.helpers.arrayElement(members);

    chats.push({
      _id: new mongoose.Types.ObjectId(),
      participants: members.map((m) => m._id),
      type: "group",
      name: groupNames[i] || faker.word.words(2),
      admin: admin._id,
      description: faker.lorem.sentence(),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent(),
    });
  }

  return chats;
};

// MESSAGE GENERATION
const generateMockMessages = (chats: any[], users: any[]): any[] => {
  const messages: any[] = [];
  const messageTexts = [
    "Hey! How are you?",
    "Good morning! Hope you're doing well.",
    "Did you see the latest update?",
    "I'll send you the files shortly.",
    "Can we meet tomorrow?",
    "Thanks for your help!",
    "That's a great idea!",
    "Let me check and get back to you.",
    "I'm running a bit late.",
    "Sure, sounds good!",
    "Could you please review this?",
    "Awesome, thank you!",
    "See you there!",
    "I agree with you.",
    "Let's discuss this in the meeting.",
    "Please find the attached document.",
    "👍",
    "😊",
    "🎉",
    "Great work!",
    "I'll be there in 10 minutes.",
    "Can you share the link?",
    "Perfect, thanks!",
    "No worries, take your time.",
    "Happy birthday! 🎂",
    "Welcome to the team!",
    "The project deadline is next week.",
    "I've completed the task.",
    "Please review the pull request.",
    "That makes sense.",
    "Let me know if you need anything.",
    "Just following up on this.",
    "I appreciate your feedback.",
    "Have a great weekend!",
    "Looking forward to it.",
    "That's hilarious! 😂",
    "Absolutely! Count me in.",
    "I'll check and confirm.",
    "On my way!",
    "Good night!",
  ];

  for (const chat of chats) {
    const numMessages = faker.number.int({ min: 5, max: 20 });
    const participants = chat.participants;
    let lastMessage: any = null;

    for (let i = 0; i < numMessages; i++) {
      const sender = faker.helpers.arrayElement(participants);
      const text = faker.helpers.arrayElement(messageTexts);
      const createdAt = faker.date.recent({ days: 30 });
      const statuses = ["sent", "delivered", "read"] as const;

      const message: any = {
        _id: new mongoose.Types.ObjectId(),
        sender,
        chatId: chat._id,
        content: text,
        text,
        type: "text" as const,
        status: faker.helpers.arrayElement(statuses),
        reactions: [],
        readBy: [],
        deletedBy: [],
        isDeletedForEveryone: false,
        createdAt,
        updatedAt: createdAt,
      };

      // Some messages have reactions
      if (faker.datatype.boolean(0.3)) {
        const reactors = faker.helpers.arrayElements(
          participants,
          faker.number.int({ min: 1, max: 3 })
        );
        message.reactions = reactors.map((r: any) => ({
          userId: r._id || r,
          emoji: faker.helpers.arrayElement(["👍", "❤️", "😂", "🎉", "😊"]),
        }));
        message.readBy = reactors.map((r: any) => r._id || r);
      }

      // Some messages are read by all participants
      if (faker.datatype.boolean(0.4)) {
        message.readBy = participants.map((p: any) => p._id || p);
        message.status = "read";
      }

      // Some messages reply to previous ones
      if (lastMessage && faker.datatype.boolean(0.2)) {
        message.replyTo = lastMessage._id;
      }

      // Some messages are forwarded
      if (faker.datatype.boolean(0.1)) {
        message.isForwarded = true;
      }

      messages.push(message);
      lastMessage = message;
    }
  }

  return messages;
};

// MAIN GENERATION FUNCTION
const generateMockData = async () => {
  try {
    console.log("🚀 Starting data seeding process...");

    const users = await generateMockUsers();
    console.log(`✅ Generated ${users.length} users`);

    const chats = generateMockChats(users);
    console.log(`✅ Generated ${chats.length} chats`);

    const messages = generateMockMessages(chats, users);
    console.log(`✅ Generated ${messages.length} messages`);

    return {
      users,
      chats,
      messages,
    };
  } catch (error) {
    console.error("❌ Data generation failed:", error);
    throw error;
  }
};

export default generateMockData;
