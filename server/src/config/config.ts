import dotenv from "dotenv";
import path from "path";

const envFiles = {
  development: ".env.development",
  production: ".env.production",
  test: ".env.test",
};

const currentEnv = process.env.NODE_ENV || "development";
const envFile = envFiles[currentEnv as keyof typeof envFiles] || ".env";

dotenv.config({
  path: path.join(process.cwd(), envFile),
  override: false,
});

dotenv.config();

export interface Config {
  nodeEnv: string;
  port: number;
  clientUrl: string;
  mongoUri: string;
  jwtSecret: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  jwtAccessExpiry: string;
  jwtRefreshExpiry: string;
  smtpUser: string;
  smtpPass: string;
  smtpHost: string;
  smtpPort: number;
  cloudinaryCloudName: string;
  cloudinaryApiKey: string;
  cloudinaryApiSecret: string;
  stripeSecretKey?: string;
  stripePublishableKey?: string;
  redisHost?: string;
  redisPort?: number;
  redisPassword?: string;
  rateLimitWindow: number;
  rateLimitMax: number;
  corsOrigins: string[];
}

export const config: Config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "5000", 10),
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  mongoUri: process.env.MONGODB_URI || process.env.MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || "",
  jwtAccessExpiry: process.env.JWT_ACCESS_EXPIRY || "1h",
  jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || "7d",
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
  smtpPort: parseInt(process.env.SMTP_PORT || "587", 10),
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined,
  redisPassword: process.env.REDIS_PASSWORD,
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || "900000", 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  corsOrigins: (process.env.CORS_ORIGINS || process.env.CLIENT_URL || "http://localhost:3000").split(","),
};

export const isProduction = config.nodeEnv === "production";
export const isDevelopment = config.nodeEnv === "development";
export const isTest = config.nodeEnv === "test";

export const requiredEnvVars = ["mongoUri", "jwtSecret", "jwtAccessSecret", "jwtRefreshSecret"];
export const missingEnvVars = requiredEnvVars.filter((key) => !config[key as keyof Config]);

if (missingEnvVars.length > 0 && isProduction) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}

if (isDevelopment) {
  console.log("🔧 Running in Development mode");
  console.log(`📦 MongoDB: ${config.mongoUri.split("@")[1]?.split("/")[0] || "local"}`);
}