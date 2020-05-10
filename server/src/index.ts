import SocketIO from "socket.io";
import http from "http";

const server = http.createServer();
const options = {};

const io = SocketIO(server, options);

io.on("connection", console.log);

server.listen(8080);