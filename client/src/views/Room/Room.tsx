import React, { FunctionComponent, useEffect, useState } from "react";
import socket from "../../models/socket";
import { RouteComponentProps } from "react-router-dom";
import Grid from "../../components/Grid/Grid";
import LoadingIcon from "../../components/LoadingIcon/LoadingIcon";
import "./Room.scss";
import { CSSTransition } from "react-transition-group";

const LoadingTextWithIcon = (props: {in: boolean}) => {
    console.log("loading", props)
    return (
        <CSSTransition
            in={props.in}
            unmountOnExit
            classNames="fade"
            timeout={300}
        >
            <div className="loading-container">
                <LoadingIcon />
                <h1>waiting for opponent...</h1>
            </div>
        </CSSTransition>
    )
};

const FadeGrid = (props: { state: any, in: boolean }) => {
    console.log("grid", props)

    return (
        <CSSTransition
            in={props.in}
            unmountOnExit
            classNames="fade"
            timeout={300}
        >
            <Grid {...props} />
        </CSSTransition>
    )
}

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

    const showLoading = !(gameState.board && gameState.secondMovePlayer);

    return (
        <main className="page">
            <LoadingTextWithIcon in={showLoading} />
            <FadeGrid in={!showLoading} state={gameState} />
        </main>
    )
};

export default Room;