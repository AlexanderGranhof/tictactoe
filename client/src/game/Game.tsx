class Board {
    PLAYER: 0 = 0;
    OPPONENT: 1 = 1;
    EMPTY: -1 = -1;

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
            const playerWinner = pattern.every(position => this.positions[position] === this.PLAYER);
            
            if (playerWinner) {
                return this.PLAYER;
            }

            const opponentWinner = pattern.every(position => this.positions[position] === this.OPPONENT);

            if (opponentWinner) {
                return this.OPPONENT;
            }
        }

        return null;
    }

    setPosition(index: number, player: 0 | 1) {
        if (![this.PLAYER, this.OPPONENT].includes(player)) {
            throw new Error(`player must either be 0 or 1, got ${player}`)
        }

        if (index < 0 || index > 8) {
            throw new Error(`index must be between 0 and 8, got ${index}`);
        }

        if (this.positions[index] !== this.EMPTY) {
            throw new Error(`illegal move. moving ${player} to position ${index} with board ${this.positions}`)
        }

        this.positions[index] = player;
    }
}

class Game {
    currentTurn: 0 | 1 | null;
    firstMove: 0 | 1 | null;
    board: Board;

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
            throw new Error(`player must be 0 or 1, got ${player}`);
        }

        this.currentTurn = player;
    }

    nextPlayer() {
        if (this.hasBeenInitialized()) {
            throw new Error("game has not been initialized");
        }

        this.currentTurn = this.currentTurn === this.board.PLAYER ? this.board.OPPONENT : this.board.PLAYER;
    }

    setMove(index: number, player: 0 | 1) {
        if (this.hasBeenInitialized()) {
            throw new Error("game has not been initialized");
        }

        this.board.setPosition(index, player);

        const winner = this.checkWinner();

        if (winner === null) {
            return;
        }

        alert(`Winner: ${winner === this.board.PLAYER ? "You" : "Opponent"}`)
    }
}

export default Game;