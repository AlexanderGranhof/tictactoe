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

        let state: any = null;

        if (roomExists) {
            handler.addClient(socket, room);
            state = handler.getRoomState(room);
            server.in("lobby").emit("get_rooms", handler.getRooms())
            socket.broadcast.to(room).emit("opponent_join", state)
            
            return socket.join(room, () => cb({ valid: roomExists, state }));
        }

        cb({ valid: roomExists, state })
    });

    socket.on("move", index => {
        const room = filter.gameRooms(socket).pop();

        if (!room) {
            throw new Error(`unable to find room of socket ${socket.id}, ${JSON.stringify(socket.rooms)}`)
        }

        const state = handler.getRoomState(room);

        if (state.secondMovePlayer === "") {
            return socket.emit("move_error", "you must wait until an opponent joins")
        }

        try {
            state.makeMove(index, socket.id);
    
            server.in(room).emit("game_state", state)
        } catch (error) {
            socket.emit("move_error", error.message)
        }
    })

    socket.on("game_leave", () => leaveAllRooms(socket, server))
    socket.on("disconnecting", () => leaveAllRooms(socket, server));
};