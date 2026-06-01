import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const createChatSchema = z.object({
  type: z.enum(["private", "group", "channel"]).default("private"),
  participantIds: z.array(z.string()).optional(),
  name: z.string().min(1).max(100).optional(),
  avatar: z.string().url().optional(),
  isPublic: z.boolean().optional(),
  description: z.string().max(500).optional(),
});

export const updateChatSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatar: z.string().url().optional(),
  themeColor: z.string().optional(),
  wallpaper: z.string().url().optional(),
});

export const chatIdSchema = z.object({
  id: z.string(),
});

export const sendMessageSchema = z.object({
  chatId: z.string(),
  content: z.string().min(1).max(5000),
  type: z.enum(["text", "image", "file", "audio"]).default("text"),
  fileUrl: z.string().url().optional(),
  replyTo: z.string().optional(),
});

export const updateMessageSchema = z.object({
  content: z.string().min(1).max(5000),
});

export const reactMessageSchema = z.object({
  messageId: z.string(),
  emoji: z.string().min(1).max(10),
  userId: z.string(),
});

export const registerSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_.-]+$/, "Invalid username format"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

type ValidationTarget = "body" | "query" | "params";

export const validate = (schema: z.ZodSchema, target: ValidationTarget = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[target];
      schema.parse(data);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: messages,
        });
      }
      next(error);
    }
  };
};

export const validateBody = (schema: z.ZodSchema) => validate(schema, "body");
export const validateParams = (schema: z.ZodSchema) => validate(schema, "params");
export const validateQuery = (schema: z.ZodSchema) => validate(schema, "query");