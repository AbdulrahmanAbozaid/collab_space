/*
// Create HTTP server and Socket.IO server
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Object to store connected users and their names
const participants: { [socketId: string]: string } = {};

// Handle WebRTC signaling and real-time collaboration
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle new participant joining with a name
  socket.on("new-participant", (data) => {
    const { name } = data;
    participants[socket.id] = name; // Store participant's name
    console.log(`${name} (${socket.id}) has joined the session.`);
    
    // Broadcast the new participant's name to everyone else
    socket.broadcast.emit("new-participant", { name, id: socket.id });
  });

  socket.on("offer", (data) => {
    socket.to(data.to).emit("offer", { offer: data.offer, from: socket.id });
  });

  socket.on("answer", (data) => {
    socket.to(data.to).emit("answer", { answer: data.answer, from: socket.id });
  });

  socket.on("ice-candidate", (data) => {
    socket
      .to(data.to)
      .emit("ice-candidate", { candidate: data.candidate, from: socket.id });
  });

  socket.on("document-change", (delta) => {
    socket.broadcast.emit("document-change", delta);
  });

  // When a participant disconnects
  socket.on("disconnect", () => {
    const participantName = participants[socket.id];
    console.log(`${participantName || "User"} (${socket.id}) disconnected.`);
    delete participants[socket.id]; // Remove participant from the list

    // Broadcast that the participant left
    socket.broadcast.emit("participant-left", { name: participantName, id: socket.id });
  });
});*/