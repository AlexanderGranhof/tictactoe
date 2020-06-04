import { Socket } from "socket.io";

export default (socket: Socket) => {
    console.log("sending room")
    socket.emit("room", "abc")
};