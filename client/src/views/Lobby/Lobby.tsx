import React, { FunctionComponent } from "react";
import socket from "../../models/socket";

const Lobby: FunctionComponent = (props) => {

    const handleLobbyCreate = () => {
        socket.emit("create_lobby", "ayy lmao")
    };

    return (
        <button onClick={handleLobbyCreate}>create lobby</button>
    )
};

export default Lobby;