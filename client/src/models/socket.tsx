import io from "socket.io-client";

const socket = io();

socket.on("connect", () => console.warn('[SOCKET]', "making new socket connection"));

export default socket;