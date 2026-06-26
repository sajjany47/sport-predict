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

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("join:ticket", (ticketId) => {
    console.log(`${socket.id} joined ticket:${ticketId}`);
    socket.join(`ticket:${ticketId}`);
  });

  socket.on("send:message", (data) => {
    console.log("Broadcasting:", data);

    socket.to(`ticket:${data.ticketId}`).emit("new:message", data);
  });
});

console.log(`Socket.IO server running on port ${PORT}`);
