import React, { useState, useEffect, Dispatch, SetStateAction, FunctionComponent } from "react";
import Game, { Board, Player, Opponent, Empty } from "../../game/Game";
import socket from "../../models/socket";
import "./Grid.scss";
import { CSSTransition } from "react-transition-group";

const getSquareIcon = (position: -1 | 0 | 1) => {
    switch(position) {
        case 0: {
            return "o"
        }

        case 1: {
            return "x"
        }

        default: {
            return ""
        }
    } 
}

interface GridProps {
    state: any
}

const Grid: FunctionComponent<GridProps> = props => {
    const [ game, setGame ]: [Game | undefined, Dispatch<SetStateAction<Game | undefined>>] = useState();
    const [ grid, setGrid ]: [ Array<Empty | Player | Opponent>, Dispatch<SetStateAction<Array<Empty | Player | Opponent>>> ] = useState([-1, -1, -1, -1, -1, -1, -1, -1, -1] as Array<Empty | Player | Opponent>);

    const { state } = props;

    // [GameState | undefined, Dispatch<SetStateAction<GameState | undefined>>]
    // [GameState | undefined, SetStateAction<GameState | undefined>]
    useEffect(() => {
        // const game = new Game();
        // game.setStartingPlayer(isStartingPlayer ? Game.PLAYER : Game.OPPONENT);

        setGame(game);
    }, []);

    const checkAndAlertWinner = () => {
        const winner = Board.checkWinner(state.board);

        if (winner === null) {
            return
        }

        if (winner === state.playerValues[socket.id]) {
            return alert("You won!")
        }

        return alert("You lost!")
    }

    const handleSquareClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const isOurTurn = state.currentTurn === socket.id;

        const { currentTarget } = event;

        if (!isOurTurn) {
            return console.warn("not your turn yet")
        }

        const position = parseInt(currentTarget.dataset.position || "");

        if (isNaN(position)) {
            throw new Error("attribute 'data-position' was not found on clicked element");
        }

        socket.emit("move", position);
    };


    return (
        <main className="page">
            <div className="grid">
                {
                    state.board && state.board.map((postion: any, index: any) => (
                        <div data-position={index} onClick={handleSquareClick} key={index} className="square">
                            <CSSTransition
                                appear={true}
                                in={getSquareIcon(postion) !== ""}
                                timeout={300}
                                onEntered={checkAndAlertWinner}
                                classNames="game-icon"
                            >
                                <span className="game-icon">
                                    { getSquareIcon(postion) }
                                </span>
                            </CSSTransition>
                        </div>
                    ))
                    
                }
            </div>
        </main>
    )
};

export default Grid;