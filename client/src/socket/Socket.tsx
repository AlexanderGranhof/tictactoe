import io from "socket.io-client";

class Socket {
    socket: SocketIOClient.Socket;

    constructor() {
        console.warn("CREATING NEW CONNECTION");
        this.socket = io("http://localhost:8080");

        this.socket.on("connect", () => console.log("[socket] connected"));
    }
}

export default new Socket()