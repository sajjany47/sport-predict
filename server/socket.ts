import express from "express";
import http from "http";
import { Server } from "socket.io";

const PORT: number = Number(process.env.PORT) || 3005;

const app = express();

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.post("/credits-updated", (req, res) => {
  const { userId, credits } = req.body;

  console.log(`Sending updated credits to user ${userId}: ${credits}`);

  io.to(`user:${userId}`).emit("credits:updated", {
    credits,
  });

  return res.json({
    success: true,
  });
});

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  // =========================
  // Ticket Chat
  // =========================

  socket.on("join:ticket", (ticketId: string) => {
    console.log(`${socket.id} joined ticket:${ticketId}`);
    socket.join(`ticket:${ticketId}`);
  });

  socket.on("leave:ticket", (ticketId: string) => {
    socket.leave(`ticket:${ticketId}`);
  });

  socket.on("send:message", (data) => {
    socket.to(`ticket:${data.ticketId}`).emit("new:message", data);
  });

  // =========================
  // User Room
  // =========================

  socket.on("join:user", (userId: string) => {
    socket.join(`user:${userId}`);
    console.log(`${socket.id} joined user:${userId}`);
  });

  socket.on("credits:updated", (data: { userId: string; credits: number }) => {
    console.log(
      `Credits Updated => User: ${data.userId} Credits: ${data.credits}`,
    );

    io.to(`user:${data.userId}`).emit("credits:updated", {
      credits: data.credits,
    });
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`Socket.IO Server running on ${PORT}`);
});
