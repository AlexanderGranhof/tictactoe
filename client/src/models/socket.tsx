import io from "socket.io-client";

const socket = io("http://localhost:8080");

socket.on("connect", () => console.warn('[SOCKET]', "making new socket connection"));

export default socket;