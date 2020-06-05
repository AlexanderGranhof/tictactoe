import { Socket, Server } from "socket.io";

export default (socket: Socket, server: Server) => {
    console.log("sending room")
    socket.emit("room", "abc")
};