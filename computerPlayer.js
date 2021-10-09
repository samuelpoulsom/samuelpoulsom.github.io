let Board = class {
    constructor() {
        this.grid = [100, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        this.moves = [];

        this.player1Marker = "X";
        this.player2Marker = "0";
    }

    isWinner(playerNumber) {
        switch (playerNumber) {
            case this.grid[1] === playerNumber && this.grid[2] === playerNumber && this.grid[3]:
                return [true,1,2,3];
            case this.grid[4] === playerNumber && this.grid[5] === playerNumber && this.grid[6]:
                return [true,4,5,6];
            case this.grid[7] === playerNumber && this.grid[8] === playerNumber && this.grid[9]:
                return [true,7,8,9];
            case this.grid[1] === playerNumber && this.grid[4] === playerNumber && this.grid[7]:
                return [true,1,4,7];
            case this.grid[2] === playerNumber && this.grid[5] === playerNumber && this.grid[8]:
                return [true,2,5,8];
            case this.grid[3] === playerNumber && this.grid[6] === playerNumber && this.grid[9]:
                return [true,3,6,9];
            case this.grid[1] === playerNumber && this.grid[5] === playerNumber && this.grid[9]:
                return [true,1,5,9];
            case this.grid[7] === playerNumber && this.grid[5] === playerNumber && this.grid[3]:
                return [true,7,5,9];
            default:
                return [false,null,null,null];
        };
    }

    isDraw() {
        return !(this.grid.includes(0));
    }
    
    makeMove(position, playerNumber) {
        this.moves.push(position);
        this.grid[position] = playerNumber;
    }

    undoMove() {
        this.grid[this.moves[-1]] = 0;
        delete this.moves[-1];
    }

    getPossibleMoves() {
        let possible = [];
        for (let i=1; i<10; i++) {
            if (this.grid[i] == 0) {
                possible.push(i)
            }
        }
        return possible;
    }

    minimax(maximisingPlayer) {
        if (this.isWinner(2)[0] === true) {
            return 10;
        } else if (this.isWinner(1)[0] === true) {
            return -10;
        } else if (this.isDraw()) {
            return 0
        }
    
        if (maximisingPlayer) {
            let highest = -Infinity;
            this.getPossibleMoves().forEach(child => {
                this.grid[child] = 2;
                let score = this.minimax(false);
                this.grid[child] = 0;
                highest = Math.max(highest, score)
            });
            return highest;
        }
    
        else if (!maximisingPlayer) {
            let lowest = Infinity;
            for (let child=1; child<10; child++) {
                if (this.grid[child] == 0) {
                    this.grid[child] = 1;
                    let score = this.minimax(true);
                    this.grid[child] = 0;
                    lowest = Math.min(lowest, score)
                }
            }
            return lowest
        }
    }

    getBestMove() {
        let bestScore = -Infinity;
        let bestPositions = [];
        console.log(this.getPossibleMoves())
        this.getPossibleMoves().forEach(move => {
            this.grid[move] = 2;
            let score = this.minimax(false);
            this.grid[move] = 0;
            if (score > bestScore) {
                bestScore = score;
                bestPositions = [move];
            } else if (score == bestScore) {
                bestPositions.push(move);
            }
        });
        console.log(bestPositions)
        return bestPositions[Math.floor(Math.random() * bestPositions.length)];
    }
}

// let board = new Board();

// let bestMove = board.getBestMove();
// console.log(bestMove)