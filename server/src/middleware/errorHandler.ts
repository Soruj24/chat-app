import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { HttpError } from "http-errors";
import logger from "../utils/logger";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflict") {
    super(message, 409);
  }
}

export const errorHandler = (
  err: Error | HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof createHttpError.HttpError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
  } else if (err.name === "MongoServerError" && err.message.includes("duplicate key")) {
    statusCode = 409;
    message = "Resource already exists";
  }

  const errorLog = {
    statusCode,
    message,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    timestamp: new Date().toISOString(),
    stack: NODE_ENV === "development" ? err.stack : undefined,
  };

  if (statusCode >= 500) {
    logger.error("Server error", errorLog);
  } else {
    logger.warn("Client error", errorLog);
  }

  if (res.headersSent) {
    return next(error);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message: NODE_ENV === "development" ? message : statusCode >= 500 ? "Internal server error" : message,
    ...(NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = createHttpError(404, `Route ${req.originalUrl} not found`);
  next(error);
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map((detail: any) => detail.message).join(", ");
      return next(new BadRequestError(messages));
    }
    next();
  };
};

import { NODE_ENV } from "../secret";