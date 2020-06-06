require("source-map-support").install();

import SocketIO from "socket.io";
import http from "http";
import { createLogger } from "./helpers/logger";

import GameHandler from "./handlers/game";
import LobbyHandler from "./handlers/lobby";

const httpServer = http.createServer();
const options = {};
const log = createLogger("[main:index.ts]")

const server = SocketIO(httpServer, options);

server.on("connection", socket => {
    log("Got socket connection", socket.id)
    GameHandler(socket, server);
    LobbyHandler(socket, server);
});

server.listen(8080);
log("Server is listening")