import io from "socket.io-client";

class Socket {
    socket: SocketIOClient.Socket;

    constructor() {
        console.warn("CREATING NEW CONNECTION");
        this.socket = io("http://localhost:8080", { autoConnect: false });

        this.socket.on("connect", () => console.log("[socket] connected"));
    }

    connect() {
        this.socket.connect();
    }
}

export default new Socket()