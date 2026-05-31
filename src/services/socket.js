import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "") ||
  "http://localhost:5001";

let socket = null;

export function connectSocket(userId) {
  if (socket?.connected) {
    socket.emit("join", userId);
    return socket;
  }

  socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });

  socket.on("connect", () => {
    socket.emit("join", userId);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}
