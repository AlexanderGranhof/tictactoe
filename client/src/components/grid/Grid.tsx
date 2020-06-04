import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import Game, { Board, Player, Opponent, Empty } from "../../game/Game";
import GameState from "../../models/game";
import "./Grid.scss";

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

const a: Array<Player | Opponent | Empty> = [-1, -1, -1, -1, -1, -1, -1, -1, -1]

const Grid = () => {
    const [ game, setGame ]: [Game | undefined, Dispatch<SetStateAction<Game | undefined>>] = useState();
    const [ grid, setGrid ]: [ Array<Empty | Player | Opponent>, Dispatch<SetStateAction<Array<Empty | Player | Opponent>>> ] = useState([-1, -1, -1, -1, -1, -1, -1, -1, -1] as Array<Empty | Player | Opponent>);

    const [ state, setState ]: [undefined | GameState, Dispatch<SetStateAction<GameState | undefined>>] = useState();

    // [GameState | undefined, Dispatch<SetStateAction<GameState | undefined>>]
    // [GameState | undefined, SetStateAction<GameState | undefined>]
    useEffect(() => {
        const game = new Game();
        const gamestate = new GameState();
        game.setStartingPlayer(Game.PLAYER);

        setGame(game);
        setState(gamestate);
    }, []);

    const handleSquareClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!game) return;

        const { currentTarget } = event;

        if (game.currentTurn !== Game.PLAYER) {
            return console.warn("not your turn yet")
        }

        const position = parseInt(currentTarget.dataset.position || "");

        if (isNaN(position)) {
            throw new Error("attribute 'data-position' was not found on clicked element");
        }

        game.setMove(position);
        setGrid(game.board.positions);
    };


    return (
        <main className="page">
            <div className="grid">
                {
                    grid.map((postion, index) => (
                        <div data-position={index} onClick={handleSquareClick} key={index} className="square">{getSquareIcon(postion)}</div>
                    ))
                    
                }
            </div>
        </main>
    )
};

export default Grid;