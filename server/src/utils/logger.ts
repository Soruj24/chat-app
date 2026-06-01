import { createLogger, format, transports, Logger } from "winston";
import { NODE_ENV } from "../secret";
import path from "path";
import fs from "fs";

const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0 && meta.stack) {
      msg += `\n${meta.stack}`;
    }
    return msg;
  })
);

const logger: Logger = createLogger({
  level: NODE_ENV === "production" ? "info" : "debug",
  format: logFormat,
  defaultMeta: { service: "chat-app" },
  transports: [
    new transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new transports.File({
      filename: path.join(logDir, "combined.log"),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

if (NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: consoleFormat,
    })
  );
}

export default logger;

export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};