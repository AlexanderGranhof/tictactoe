export class Board {
    winPatterns = [
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

    positions: Array<-1 | 0 | 1>

    constructor() {
        this.positions = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
    }

    checkWinner(): null | 0 | 1 {
        for (const pattern of this.winPatterns) {
            const playerWinner = pattern.every(position => this.positions[position] === Game.PLAYER);
            
            if (playerWinner) {
                return Game.PLAYER;
            }

            const opponentWinner = pattern.every(position => this.positions[position] === Game.OPPONENT);

            if (opponentWinner) {
                return Game.OPPONENT;
            }
        }

        return null;
    }

    setPosition(index: number, player: 0 | 1) {
        if (![Game.PLAYER, Game.OPPONENT].includes(player)) {
            return console.warn(`player must either be 0 or 1, got ${player}`)
        }

        if (index < 0 || index > 8) {
            return console.warn(`index must be between 0 and 8, got ${index}`);
        }

        if (this.positions[index] !== Game.EMPTY) {
            return console.warn(`illegal move. moving ${player} to position ${index} with board ${this.positions}`)
        }

        this.positions[index] = player;
    }
}

export type Player = 0;
export type Opponent = 1;
export type Empty = -1;
export type PlayerOrOpponent = Player | Opponent;

class Game {
    currentTurn: PlayerOrOpponent | null;
    firstMove: PlayerOrOpponent | null;
    board: Board;

    static PLAYER: Player = 0;
    static OPPONENT: Opponent = 1;
    static EMPTY: Empty = -1;

    constructor() {
        this.currentTurn = null;
        this.firstMove = null;
        this.board = new Board();
    }

    private hasBeenInitialized() {
        return this.currentTurn === null || this.firstMove === null;
    }

    checkWinner() {
        return this.board.checkWinner();
    }

    setStartingPlayer(player: 0 | 1) {
        if (player < 0 || player > 1) {
            return console.warn(`player must be 0 or 1, got ${player}`);
        }

        this.currentTurn = player;
        this.firstMove = player;
    }

    nextPlayer() {
        if (this.hasBeenInitialized()) {
            return console.warn("game has not been initialized");
        }

        this.currentTurn = this.currentTurn === Game.PLAYER ? Game.OPPONENT : Game.PLAYER;
    }

    setMove(index: number): void {
        if (this.hasBeenInitialized()) {
            return console.warn("game has not been initialized");
        }

        // The if statement above will verify that this is not null
        let currentTurn = this.currentTurn as PlayerOrOpponent;

        this.board.setPosition(index, currentTurn);

        this.nextPlayer();
    }
}

export default Game;