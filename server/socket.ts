import { Server, Socket } from "socket.io";

const PORT: number = Number(process.env.PORT) || 3005;

const io = new Server(PORT, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

interface MessageData {
  ticketId: string;
  message: string;
  userName?: string;
}

interface StatusData {
  ticketId: string;
  status: string;
}

interface TypingData {
  ticketId: string;
  userName: string;
}

io.on("connection", (socket: Socket) => {
  console.log("[Socket Server] Client connected:", socket.id);

  socket.on("join:ticket", (ticketId: string) => {
    socket.join(`ticket:${ticketId}`);
    console.log(
      `[Socket Server] Socket ${socket.id} joined room ticket:${ticketId}`,
    );
  });

  socket.on("leave:ticket", (ticketId: string) => {
    socket.leave(`ticket:${ticketId}`);
    console.log(
      `[Socket Server] Socket ${socket.id} left room ticket:${ticketId}`,
    );
  });

  socket.on("send:message", (data: MessageData) => {
    console.log(
      `[Socket Server] Message from ${socket.id} to room ticket:${data.ticketId}:`,
      data.message,
    );

    socket.to(`ticket:${data.ticketId}`).emit("new:message", data);
  });

  socket.on("status:changed", (data: StatusData) => {
    console.log(
      `[Socket Server] Status changed for ticket:${data.ticketId} to ${data.status}`,
    );

    socket.to(`ticket:${data.ticketId}`).emit("status:updated", data);
  });

  socket.on("typing", (data: TypingData) => {
    socket.to(`ticket:${data.ticketId}`).emit("user:typing", {
      userName: data.userName,
    });
  });

  socket.on("disconnect", (reason: string) => {
    console.log(
      "[Socket Server] Client disconnected:",
      socket.id,
      "reason:",
      reason,
    );
  });
});

console.log(`Socket.IO server running on port ${PORT}`);
