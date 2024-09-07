// services/webrtc.ts
import { Server as IOServer, Socket } from 'socket.io';

interface WebRTCSignalingMessage {
  type: 'offer' | 'answer' | 'candidate';
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
}

interface PeerConnectionMap {
  [socketId: string]: RTCPeerConnection;
}

export class WebRTCService {
  private io: IOServer;
  private peerConnections: PeerConnectionMap = {};

  constructor(io: IOServer) {
    this.io = io;
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on('join-room', (roomId: string) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
      });

      socket.on('webrtc-signaling', (data: WebRTCSignalingMessage, roomId: string) => {
        console.log(`Received signaling message from ${socket.id}`, data);

        // Relay the signaling message to the other peer
        socket.to(roomId).emit('webrtc-signaling', data);
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        delete this.peerConnections[socket.id];
      });
    });
  }

  public createPeerConnection(socketId: string): RTCPeerConnection {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }, // Google STUN server
      ],
    });

    this.peerConnections[socketId] = peerConnection;
    return peerConnection;
  }

  public handleIceCandidate(socketId: string, candidate: RTCIceCandidateInit) {
    const peerConnection = this.peerConnections[socketId];
    if (peerConnection) {
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }
}

export default WebRTCService;
