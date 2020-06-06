const winPatterns = [
    // Horizontal
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // Vertical
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // Diagonal
    [0, 4, 8],
    [2, 4, 6]
];

export class Board {
    static checkWinner(board: number[]): null | 0 | 1 {
        for (const pattern of winPatterns) {
            const playerWinner = pattern.every(position => board[position] === Game.PLAYER);
            
            if (playerWinner) {
                return Game.PLAYER;
            }

            const opponentWinner = pattern.every(position => board[position] === Game.OPPONENT);

            if (opponentWinner) {
                return Game.OPPONENT;
            }
        }

        return null;
    }
}

export type Player = 0;
export type Opponent = 1;
export type Empty = -1;
export type PlayerOrOpponent = Player | Opponent;

class Game {
    // currentTurn: PlayerOrOpponent | null;
    // firstMove: PlayerOrOpponent | null;
    // board: Board;

    static PLAYER: Player = 0;
    static OPPONENT: Opponent = 1;
    static EMPTY: Empty = -1;

    // constructor() {
    //     this.currentTurn = null;
    //     this.firstMove = null;
    //     this.board = new Board();
    // }

    // private hasBeenInitialized() {
    //     return this.currentTurn === null || this.firstMove === null;
    // }

    // setStartingPlayer(player: 0 | 1) {
    //     if (player < 0 || player > 1) {
    //         return console.warn(`player must be 0 or 1, got ${player}`);
    //     }

    //     this.currentTurn = player;
    //     this.firstMove = player;
    // }

    // nextPlayer() {
    //     if (this.hasBeenInitialized()) {
    //         return console.warn("game has not been initialized");
    //     }

    //     this.currentTurn = this.currentTurn === Game.PLAYER ? Game.OPPONENT : Game.PLAYER;
    // }

    // setMove(index: number): void {
    //     if (this.hasBeenInitialized()) {
    //         return console.warn("game has not been initialized");
    //     }

    //     // The if statement above will verify that this is not null
    //     let currentTurn = this.currentTurn as PlayerOrOpponent;

    //     this.board.setPosition(index, currentTurn);

    //     this.nextPlayer();
    // }
}

export default Game;