// const { Server } = require("socket.io");
import { Server } from "socket.io";

const io = new Server(3005, {
  cors: {
    origin: "http://localhost:3004",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join:ticket", (ticketId) => {
    socket.join(`ticket:${ticketId}`);
    console.log(`Socket ${socket.id} joined room ticket:${ticketId}`);
  });

  socket.on("leave:ticket", (ticketId) => {
    socket.leave(`ticket:${ticketId}`);
    console.log(`Socket ${socket.id} left room ticket:${ticketId}`);
  });

  socket.on("send:message", (data) => {
    io.to(`ticket:${data.ticketId}`).emit("new:message", data);
  });

  socket.on("status:changed", (data) => {
    io.to(`ticket:${data.ticketId}`).emit("status:updated", data);
  });

  socket.on("typing", (data) => {
    socket
      .to(`ticket:${data.ticketId}`)
      .emit("user:typing", { userName: data.userName });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

console.log("Socket.IO server running on port 3005");
