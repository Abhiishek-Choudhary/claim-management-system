import { io } from "socket.io-client";

// Change this to your backend WebSocket URL if in production
const socket = io("https://e8323325-9fea-40d9-a0fc-5aba07e1a323-00-1uedzks77cj6m.sisko.replit.dev", {
  autoConnect: false, // Only connect when needed
});

export default socket;
