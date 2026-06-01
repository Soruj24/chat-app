import http from "http";
import { Server } from "socket.io";

import { connectDatabase } from "./config/db";
import app from "./app";
import { PORT } from "./secret";
import { setupSocketHandlers } from "./socket/handlers";

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Setup socket handlers
setupSocketHandlers(io);

connectDatabase()
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);