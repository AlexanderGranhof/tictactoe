import { Socket } from "socket.io";

export const gameRooms = (socket: Socket) => {
    const ignoredRooms = ["lobby"];
    return Object.keys(socket.rooms).slice(1).filter(room => !ignoredRooms.includes(room))
}