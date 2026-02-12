import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (this.socket?.connected) return;

    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
    console.log("Connecting to socket server at:", SOCKET_URL);
    
    this.socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ["polling", "websocket"], // Start with polling to avoid immediate WS failure
      withCredentials: true,
    });

    this.socket.on("connect", () => {
      console.log("Connected to socket server with ID:", this.socket?.id);
      
      // Re-join user room on reconnection if userId is known
      const userId = (this.socket as any).userId;
      if (userId) {
        console.log("Re-joining room for user:", userId);
        this.socket?.emit("join", userId);
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error detail:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
        type: (error as any).type,
        description: (error as any).description
      });
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected from socket server. Reason:", reason);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (data: any) => void) {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.off(event);
    }
  }

  emit(event: string, data: any) {
    // Keep track of userId for reconnection
    if (event === 'join' && typeof data === 'string' && this.socket) {
      (this.socket as any).userId = data;
    }

    if (!this.socket?.connected) {
      console.warn(`Socket not connected, trying to reconnect before emitting ${event}`);
      this.connect();
      
      // Use a one-time listener for 'connect' to emit the event once reconnected
      this.socket?.once("connect", () => {
        console.log(`Successfully reconnected, now emitting ${event}`);
        this.socket?.emit(event, data);
      });
      return;
    }
    
    this.socket.emit(event, data);
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();
