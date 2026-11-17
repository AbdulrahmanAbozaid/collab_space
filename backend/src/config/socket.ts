import { Server as SocketIOServer, Socket } from "socket.io"; // socket.io v4

const CHAT_PREFIX = "chat_";
const MAX_MESSAGE_LENGTH = 2000;

type VoiceState = { roomId: string; peerId: string };

function leaveVoice(socket: Socket) {
  const voice = socket.data.voice as VoiceState | undefined;
  if (!voice) return;
  socket.leave(voice.roomId);
  socket.to(voice.roomId).emit("peer-disconnected", voice.peerId);
  socket.data.voice = undefined;
}

export default function setupSocket(io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    console.log(`Socket.IO connection: ${socket.id}`);

    // ---------- Voice / video ----------
    socket.on(
      "join-room",
      (roomId: string, peerId: string, username: string) => {
        if (typeof roomId !== "string" || typeof peerId !== "string") return;
        leaveVoice(socket); // never be in two voice rooms at once
        socket.join(roomId);
        socket.data.voice = { roomId, peerId } as VoiceState;
        // Existing members will call the newcomer
        socket
          .to(roomId)
          .emit("new-peer", { peerId, username: username || "Guest" });
      },
    );

    socket.on("leave-room", () => leaveVoice(socket));

    // ---------- Chat ----------
    // All listeners are registered ONCE here (not inside join-chat),
    // so messages can no longer be broadcast multiple times.
    socket.on("join-chat", (roomId: string, username: string) => {
      if (
        !username ||
        typeof roomId !== "string" ||
        !roomId.startsWith(CHAT_PREFIX)
      )
        return;
      socket.data.username = username;
      if (socket.rooms.has(roomId)) return; // idempotent
      socket.join(roomId);
      socket.to(roomId).emit("user-joined-chat", username);
    });

    socket.on("leave-chat", (roomId: string) => {
      if (!socket.rooms.has(roomId)) return;
      socket.leave(roomId);
      socket.to(roomId).emit("user-left-chat", socket.data.username);
    });

    socket.on("send-chat-message", (roomId: string, message: string) => {
      const username = socket.data.username as string | undefined;
      if (!username || !socket.rooms.has(roomId)) return;
      const text = String(message ?? "")
        .trim()
        .slice(0, MAX_MESSAGE_LENGTH);
      if (!text) return;
      // Sent to everyone in the room INCLUDING the sender -> no optimistic update / dedupe needed
      io.to(roomId).emit("receive-chat-message", {
        username,
        message: text,
        timestamp: Date.now(),
      });
    });

    // ---------- Disconnect ----------
    // "disconnecting" fires while socket.rooms is still populated
    socket.on("disconnecting", () => {
      leaveVoice(socket);
      for (const room of socket.rooms) {
        if (room.startsWith(CHAT_PREFIX)) {
          socket.to(room).emit("user-left-chat", socket.data.username);
        }
      }
    });
  });
}
