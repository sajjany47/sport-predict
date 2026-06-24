import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io("http://localhost:3005", {
      autoConnect: false,
      transports: ["websocket", "polling"],
    });
  }
  return socket;
};

export const connectToTicket = (ticketId: string) => {
  const s = getSocket();
  if (s.connected) {
    s.emit("join:ticket", ticketId);
  } else {
    s.connect();
    s.once("connect", () => {
      s.emit("join:ticket", ticketId);
    });
  }
};

export const disconnectFromTicket = (ticketId: string) => {
  const s = getSocket();
  s.emit("leave:ticket", ticketId);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
