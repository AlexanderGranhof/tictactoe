require("source-map-support").install();

import SocketIO from "socket.io";
import http from "http";

import GameHandler from "./handlers/game";
import LobbyHandler from "./handlers/lobby";

const httpServer = http.createServer();
const options = {};

const server = SocketIO(httpServer, options);

server.on("connection", socket => {
    console.log("Got connection", socket.id)
    GameHandler(socket, server);
    LobbyHandler(socket, server);
});

server.listen(8080);