"use client";

import Peer from "simple-peer";
import { socketService } from "../socket/socket-client";

export class WebRTCService {
  private peer: Peer.Instance | null = null;
  private stream: MediaStream | null = null;

  async getLocalStream(video: boolean = true) {
    if (this.stream) {
      // If existing stream doesn't match the requested video state, stop it and get a new one
      const hasVideo = this.stream.getVideoTracks().length > 0;
      if (hasVideo === video) return this.stream;
      
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: video,
        audio: true,
      });
      return this.stream;
    } catch (error: any) {
      console.error("Error accessing media devices:", error);
      
      // If video was requested but failed because device not found, try audio only
      if (video && (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError')) {
        console.warn("Camera not found, falling back to audio only");
        try {
          this.stream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
          });
          return this.stream;
        } catch (audioError) {
          console.error("Even audio access failed:", audioError);
          return null;
        }
      }
      
      return null;
    }
  }

  createPeer(userIdToCall: string, stream: MediaStream, currentUserId: string) {
    this.peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    this.peer.on("signal", (data) => {
      console.log("Peer signaling (initiator):", data.type);
      socketService.emit("call_user", {
        userToCall: userIdToCall,
        signalData: data,
        from: currentUserId,
        type: stream.getVideoTracks().length > 0 ? 'video' : 'audio'
      });
    });

    return this.peer;
  }

  answerPeer(incomingSignal: any, callerId: string, stream: MediaStream) {
    this.peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    this.peer.on("signal", (data) => {
      console.log("Peer signaling (responder):", data.type);
      socketService.emit("answer_call", {
        signal: data,
        to: callerId,
      });
    });

    this.peer.signal(incomingSignal);
    return this.peer;
  }

  signalPeer(signal: any) {
    if (this.peer) {
      console.log("Signaling existing peer with type:", signal.type);
      this.peer.signal(signal);
    } else {
      console.error("No peer exists to signal");
    }
  }

  destroy() {
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
}

export const webrtcService = new WebRTCService();
