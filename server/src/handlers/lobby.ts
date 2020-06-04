import { Socket } from "socket.io";
import LobbyHandler from "../models/lobbyHandler";
import { createLogger } from "../helpers/logger";
import chalk from "chalk";

const log = createLogger("[HANDLERS:LOBBY]")

const handler = new LobbyHandler();

export default (socket: Socket) => {
    log("attaching lobby stuff")
    socket.join("lobby");

    socket.on("create_room", (data: any) => {
        const room = handler.createLobby({ hostName: data.name, hostSocketId: socket.id });
        log("got room", room)

        socket.broadcast.to("lobby").emit("room_created", room)

        socket.emit("created_room", room);
    });

    socket.on("get_clients", cb => cb(handler.getLobbies()))
};