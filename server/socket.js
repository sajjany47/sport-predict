import { Server } from "socket.io";

const PORT = process.env.PORT || 3005;

const io = new Server(PORT, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("[Socket Server] Client connected:", socket.id);

  socket.on("join:ticket", (ticketId) => {
    socket.join(`ticket:${ticketId}`);
    console.log(
      `[Socket Server] Socket ${socket.id} joined room ticket:${ticketId}`,
    );
  });

  socket.on("leave:ticket", (ticketId) => {
    socket.leave(`ticket:${ticketId}`);
    console.log(
      `[Socket Server] Socket ${socket.id} left room ticket:${ticketId}`,
    );
  });

  socket.on("send:message", (data) => {
    console.log(
      `[Socket Server] Message from ${socket.id} to room ticket:${data.ticketId}:`,
      data.message,
    );
    // Broadcast to everyone else in the room
    socket.to(`ticket:${data.ticketId}`).emit("new:message", data);
  });

  socket.on("status:changed", (data) => {
    console.log(
      `[Socket Server] Status changed for ticket:${data.ticketId} to ${data.status}`,
    );
    socket.to(`ticket:${data.ticketId}`).emit("status:updated", data);
  });

  socket.on("typing", (data) => {
    socket
      .to(`ticket:${data.ticketId}`)
      .emit("user:typing", { userName: data.userName });
  });

  socket.on("disconnect", (reason) => {
    console.log(
      "[Socket Server] Client disconnected:",
      socket.id,
      "reason:",
      reason,
    );
  });
});

console.log(`Socket.IO server running on port ${PORT}`);
