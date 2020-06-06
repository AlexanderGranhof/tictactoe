import React, { FunctionComponent, useEffect, useState } from "react";
import socket from "../../models/socket";
import { RouteComponentProps } from "react-router-dom";
import Grid from "../../components/Grid/Grid";

const Room: FunctionComponent<RouteComponentProps> = props => {
    const { match, history } = props;
    const { id } = match.params as any;
    const [ gameState, setGameState ] = useState<any>({});

    const onViewLeave = () => {
        socket.off("game_state");
        socket.off("opponent_join");
        socket.off("move_error")
        socket.emit("game_leave");
    };

    useEffect(() => {
        socket.emit("game_join", id, (roomData: any) => {
            const { valid, state } = roomData;

            if (!valid) {
                return history.push("/lobbies")
            }

            setGameState(state);
        });

        socket.on("game_state", (state: any) => setGameState(state))

        socket.on("move_error", (msg: string) => alert(msg));

        socket.once("opponent_join", (state: any) => {
            setGameState(state)
        })

        return onViewLeave;
    }, [setGameState]);

    console.log(gameState, socket.id)

    return (
        <main className="page">
            { gameState.board && <Grid state={gameState} /> }
        </main>
    )
};

export default Room;