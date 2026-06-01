"use client";

import { socketService } from "../socket/socket-client";

export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private stream: MediaStream | null = null;
  public onStream: ((stream: MediaStream) => void) | null = null;

  async getLocalStream(video: boolean = true) {
    if (this.stream) {
      const hasVideo = this.stream.getVideoTracks().length > 0;
      if (hasVideo === video) return this.stream;

      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some((device) => device.kind === "videoinput");
      const hasMic = devices.some((device) => device.kind === "audioinput");

      if (!hasMic && !hasCamera) {
        console.warn("No audio or video devices found");
        return null;
      }

      const constraints = {
        video: video && hasCamera,
        audio: hasMic,
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.stream;
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.name !== "NotFoundError" &&
        error.name !== "DevicesNotFoundError"
      ) {
        console.error("Error accessing media devices:", error);
      }

      if (video) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const hasMic = devices.some((device) => device.kind === "audioinput");

          if (hasMic) {
            this.stream = await navigator.mediaDevices.getUserMedia({
              video: false,
              audio: true,
            });
            return this.stream;
          }
        } catch (audioError) {}
      }

      return null;
    }
  }

  private setupPeerConnection(stream: MediaStream) {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" },
      ],
    });

    stream.getTracks().forEach((track) => {
      if (this.stream && this.peerConnection) {
        this.peerConnection.addTrack(track, this.stream);
      }
    });

    this.peerConnection.ontrack = (event) => {
      if (this.onStream && event.streams && event.streams[0]) {
        this.onStream(event.streams[0]);
      }
    };

    return this.peerConnection;
  }

  async createPeer(
    userIdToCall: string,
    stream: MediaStream,
    currentUserId: string,
  ) {
    const pc = this.setupPeerConnection(stream);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketService.emit("call_user", {
          userToCall: userIdToCall,
          signalData: { type: "candidate", candidate: event.candidate },
          from: currentUserId,
          type: stream.getVideoTracks().length > 0 ? "video" : "audio",
        });
      }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socketService.emit("call_user", {
      userToCall: userIdToCall,
      signalData: offer,
      from: currentUserId,
      type: stream.getVideoTracks().length > 0 ? "video" : "audio",
    });

    return {
      on: (event: string, callback: any) => {
        if (event === "stream") this.onStream = callback;
      },
    };
  }

  async answerPeer(
    incomingSignal: any,
    callerId: string,
    stream: MediaStream,
  ) {
    const pc = this.setupPeerConnection(stream);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketService.emit("answer_call", {
          signal: { type: "candidate", candidate: event.candidate },
          to: callerId,
        });
      }
    };

    if (incomingSignal.type === "offer") {
      await pc.setRemoteDescription(new RTCSessionDescription(incomingSignal));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socketService.emit("answer_call", {
        signal: answer,
        to: callerId,
      });
    }

    return {
      on: (event: string, callback: any) => {
        if (event === "stream") this.onStream = callback;
      },
    };
  }

  async signalPeer(signal: any) {
    if (!this.peerConnection) return;

    try {
      if (signal.type === "offer" || signal.type === "answer") {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(signal));
      } else if (signal.type === "candidate") {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(signal.candidate));
      }
    } catch (err) {
      console.error("Error signaling peer:", err);
    }
  }

  destroy() {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.onStream = null;
  }
}

export const webrtcService = new WebRTCService();
