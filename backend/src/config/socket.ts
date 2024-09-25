import { Server as SocketIOServer, Socket } from "socket.io";

export default function setupSocket(io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    console.log(`Socket.IO connection: ${socket.id}`);

    socket.on("join-room", (roomId: string, userId: string) => {
      try {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("new-peer", userId);
        console.log(`User ${userId} joined room ${roomId}`);
      } catch (error) {
        console.error("Error in join-room event:", error);
      }

      socket.on("disconnect", () => {
        try {
          socket.leave(roomId);
          socket.broadcast.to(roomId).emit("peer-disconnected", userId);
        } catch (error) {
          console.error("Error in disconnect event:", error);
        }
      });
    });

    socket.on("join-chat", (roomId: string, username: string) => {
      try {
        if (!username) {
          throw new Error("User not authenticated");
        }
        socket.join(roomId);
        if (username) console.log(`${username} joined chat room ${roomId}`);

        // Notify others in the chat room
        socket.broadcast.to(roomId).emit("user-joined-chat", username);
      } catch (error) {
        console.error("Error in join-chat event:", error);
      }

      // Event to handle sending a chat message
      socket.on(
        "send-chat-message",
        (roomId: string, message: string, timestamp: string) => {
          if (!username) {
            return;
          }
          try {
            const chatMessage = {
              username: username,
              message,
              timestamp,
            };
            socket.broadcast
              .to(roomId)
              .emit("receive-chat-message", chatMessage); // Broadcast message to all users
            console.log(
              `Message sent by ${
                username
              } in chat room ${roomId}: ${message}`
            );
          } catch (error) {
            console.error("Error in send-chat-message event:", error);
          }
        }
      );

      socket.on("disconnect", () => {
        try {
          socket.leave(roomId);
          socket.broadcast.to(roomId).emit("user-left-chat", username);
        } catch (error) {
          console.error("Error in chat disconnect event:", error);
        }
      });
    });
  });
}
