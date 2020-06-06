import React, { FunctionComponent, useEffect } from "react";
import socket from "../../models/socket";
import { RouteComponentProps } from "react-router-dom";

const Room: FunctionComponent<RouteComponentProps> = props => {
    const { match, history } = props;
    const { id } = match.params as any;

    const onViewLeave = () => {
        socket.emit("game_leave")
    };

    useEffect(() => {
        socket.emit("game_join", id, (validRoom: boolean) => {
            if (!validRoom) {
                history.push("/lobbies")
            }
        })

        return onViewLeave;
    }, []);

    return (
        <main className="page">
            <h1>Room</h1>
        </main>
    )
};

export default Room;