
import socket from "./socket";

class GameState {
    socket: SocketIOClient.Socket;
    private room: string | null;

    constructor() {
        this.room = null;
        this.socket = socket;
        
        this.socket.on("connect", () => console.log("connected"));
        this.socket.once("room", (room: string) => {
            console.log(room);
            this.room = room;
        });
    }
}

export default GameState;