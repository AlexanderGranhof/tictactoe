import { Socket, Server } from "socket.io";
import LobbyHandler from "../models/lobbyHandler";
import { createLogger } from "../helpers/logger";

const log = createLogger("[handlers:lobby.ts]")

const handler = new LobbyHandler();

export default (socket: Socket, server: Server) => {
    log("Attaching lobby events.")
    socket.join("lobby");

    socket.on("create_room", (user: any, cb) => {
        const room = handler.createLobby({ hostname: user.name, hostSocketId: socket.id });
        log("got room", room)

        server.in("lobby").emit("room_created", room)

        socket.emit("created_room", room);

        cb(room);
    });

    socket.on("get_clients", cb => cb(handler.getLobbies()))
};