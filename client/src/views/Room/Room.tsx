import React, { FunctionComponent, useEffect, useState, CSSProperties, useContext } from "react";
import socket from "../../models/socket";
import { RouteComponentProps } from "react-router-dom";
import Grid from "../../components/Grid/Grid";
import LoadingIcon from "../../components/LoadingIcon/LoadingIcon";
import { userContext } from "../../context/user";
import "./Room.scss";
import { CSSTransition } from "react-transition-group";
import CopyText, { CopyTextProps } from "../../components/CopyText/CopyText";
import { message } from "antd";
import Alert from "../../components/Alert/Alert";

const CopyTextWithProps = (props: CopyTextProps) => {
    const CopyStyleProps: CSSProperties = {
        position: "absolute",
        left: "50%", 
        transform: "translateX(-50%)",
        top: "50%",
        margin: 0
    };

    return (
        <CopyText
            style={{ ...CopyStyleProps }}
            onCopy={() => message.success(`Copied the link to this room!`)}
            hint="copy this link to your friends to join"
            {...props}
        />
    )
}

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

const FadeGrid = (props: { state: any, in: boolean, onGameOver: (winner: boolean) => void }) => {
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
    const [ room, setRoom ] = useState<any>({});
    const [ alertNotification, setAlertNotification ] = useState({ show: false, message: "", className: "" });
    const [ userState, setUserState ] = useContext(userContext);

    console.log(userState, gameState);

    const onViewLeave = () => {
        socket.off("game_state");
        socket.off("opponent_join");
        socket.off("move_error")
        socket.emit("game_leave");
    };

    useEffect(() => {
        socket.emit("game_join", {room: id, name: userState.name}, (roomData: any) => {
            const { valid, state, room } = roomData;

            if (!valid) {
                return history.push("/lobbies")
            }

            setRoom(room);
            setGameState(state);
        });

        socket.on("game_state", (state: any) => setGameState(state))

        socket.on("move_error", (msg: string) => alert(msg));

        socket.once("opponent_join", ({ state, room }: any) => {
            console.log(room);
            setRoom(room);
            setGameState(state)
        })

        return onViewLeave;
    }, [setGameState]);

    const showLoading = !(gameState.board && gameState.secondMovePlayer);

    const handleGameOver = (isWinner: boolean) => {
        console.log("got gameover", isWinner);

        const opponentName = room.sockets.find((client: any) => client.id !== socket.id).name || "your opponent";

        const winMessage = `You won against ${opponentName}!`
        const lossMessage = `You lost against ${opponentName}.`

        setAlertNotification({ message: isWinner ? winMessage : lossMessage, show: true, className: isWinner ? "green" : "red" })
    };


    return (
        <main className="page">
            <Alert onClose={() => history.push("/lobbies")} className={alertNotification.className} show={alertNotification.show} message={alertNotification.message} />
            <LoadingTextWithIcon in={showLoading} />
                { showLoading && <CopyTextWithProps text={window.location.href} /> }
            <FadeGrid onGameOver={handleGameOver} in={!showLoading} state={gameState} />
        </main>
    )
};

export default Room;