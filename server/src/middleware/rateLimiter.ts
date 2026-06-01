import { RateLimitRequestHandler } from "express-rate-limit";
import { rateLimit as rateLimitMiddleware } from "express-rate-limit";

const isProduction = process.env.NODE_ENV === "production";

const defaultOptions = {
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 100 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests from this IP, please try again later.",
  },
  skip: (req: any) => {
    return req.path === "/api/health";
  },
};

export const createRateLimitHandler = (options?: Partial<typeof defaultOptions>): RateLimitRequestHandler => {
  return rateLimitMiddleware({ ...defaultOptions, ...options }) as unknown as RateLimitRequestHandler;
};

export const generalLimiter = createRateLimitHandler();

export const authLimiter = createRateLimitHandler({
  windowMs: 60 * 60 * 1000,
  max: isProduction ? 20 : 100,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many authentication attempts, please try again after an hour.",
  },
});

export const createEndpointLimiter = (max: number, windowMs: number = 60 * 1000) => {
  return createRateLimitHandler({
    max,
    windowMs,
    message: {
      success: false,
      statusCode: 429,
      message: "Rate limit exceeded for this endpoint.",
    },
  });
};

export default {
  general: generalLimiter,
  auth: authLimiter,
  create: createEndpointLimiter,
};