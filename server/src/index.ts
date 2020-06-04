require("source-map-support").install();

import SocketIO from "socket.io";
import http from "http";

import GameHandler from "./handlers/game";
import LobbyHandler from "./handlers/lobby";

const server = http.createServer();
const options = {};

const io = SocketIO(server, options);

io.on("connection", socket => {
    console.log("Got connection", socket.id)
    GameHandler(socket);
    LobbyHandler(socket);
});

server.listen(8080);