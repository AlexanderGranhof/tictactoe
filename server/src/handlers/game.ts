import { Socket, Server } from "socket.io";
import { createLogger } from "../helpers/logger";

const log = createLogger("[handlers:game.ts]")

export default (socket: Socket, server: Server) => {
    log("Attaching game listeners")
    socket.emit("room", "abc")
};