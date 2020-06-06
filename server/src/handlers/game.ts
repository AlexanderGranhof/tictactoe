import { Socket, Server } from "socket.io";
import { createLogger } from "../helpers/logger";
import handler from "../models/lobbyHandler";
import * as filter from "../helpers/filter";


const log = createLogger("[handlers:game.ts]");

const leaveAllRooms = (socket: Socket, server: Server) => {
    const rooms = filter.gameRooms(socket);

    rooms.forEach(room => {
        handler.removeClient(socket, room);

        if (handler.roomIsEmpty(room)) {
            handler.removeRoom(room);
            server.in("lobby").emit("room_removed", room);
        }

        socket.broadcast.to(room).emit("partner_leave", socket.id)
        socket.leave(room);
    })
}

export default (socket: Socket, server: Server) => {
    socket.on("game_join", (room: any, cb: Function) => {
        const roomExists = handler.roomExists(room);

        if (roomExists) {
            handler.addClient(socket, room);
            socket.broadcast.to(room).emit("partner_join", socket.id)
            socket.join(room);   
        }

        cb(roomExists)
    });

    socket.on("game_leave", () => leaveAllRooms(socket, server))
    socket.on("disconnecting", () => leaveAllRooms(socket, server));
};