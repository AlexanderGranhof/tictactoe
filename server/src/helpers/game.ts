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

export const checkWinner = (board: number[]) => {
    const player = 0;
    const opponent = 1;

    for (const pattern of winPatterns) {
        const playerWinner = pattern.every(position => board[position] === player);
        
        if (playerWinner) {
            return player;
        }

        const opponentWinner = pattern.every(position => board[position] === opponent);

        if (opponentWinner) {
            return opponent;
        }
    }

    return null;
}