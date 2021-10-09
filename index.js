// TicTacToe - By Samuel Poulsom
// Player is always X while computer is always 0


// Main class for board
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

// Create new board for all functions to use
let board = new Board();

// Plays the position for the computer
function computerPlays(board) {
    let bestMove = board.getBestMove();
    console.log(bestMove);
    board.grid[bestMove] = "0";
}

// Updates the webpage
function updatePage(board) {
    for (let i=0; i < 10; i++) {
        if (board.grid[i+1] === 1) {
            boxes[i].innerHTML = "X"
        } else if (board.grid[i+1] === 2) {
            boxes[i].innerHTML = "0"
        }
    }
}

// Function that clears all the cells
function clearAll(board) {
    for (let i = 0; i < boxes.length; i++) {
        const element = boxes[i];
        element.textContent = "";
        element.bgColor = "white";
        board.grid[i+1] = 0;
    }
}

// Function for the end of the game
function endGame(message) {
    // We grab the final game-over page so we can set it to not hidden
    var finalPage = $("#final-page-cover");
    finalPage.css("visibility", "visible");

    var finalText = document.getElementById("winner-text");
    finalText.textContent = message;
}

////////////////////////////////////////////////////////////////////////////

// We grab all the box elements using JQuery
var boxes = $("td");

// Upon load, we set all HTML contents of the boxes to be blank
clearAll(board);

// For the restart button on the final screen
$("button").eq(0).click(function() {
    clearAll(board);
    // We grab the final game-over page so we can set it to not hidden
    var finalPage = $("#final-page-cover");
    finalPage.css("visibility", "hidden");
});

// For the view game button on the final screen
$("button").eq(1).click(function() {
    // Set all the grid spaces as a value so that the user cannot interact with them
    for (var i=1; i<10; i++) {
        if (board.grid[i] === 0) {
            board.grid[i] = 100;
        }
    }
    
    // We grab the final game-over page so we can set it to hidden
    var finalPage = $("#final-page-cover");
    finalPage.css("visibility", "hidden");
});

// For the restart button on the main screen
$("button").eq(2).click(function() {
    clearAll(board);
})

// We need a listener for every position
for (let i = 0; i < 10; i++) {
    $(".box").eq(i).click(function() {
        var clickedPosition = i + 1;  // Grid and boxes are not in sync
        if (board.grid[clickedPosition] === 0) {  // The one they clicked was blank
            $(this).css("color", "white")

            board.makeMove(clickedPosition, 1)
            updatePage(board)
            
            var winner1 = board.isWinner(1);
            
            if (winner1[0] === true) {
                // boxes[winner1[1]-1].bgColor = "green";
                // boxes[winner1[2]-1].bgColor = "green";
                // boxes[winner1[3]-1].bgColor = "green";

                endGame("You Won!")
            
            } else if (board.isDraw() === true) {
                endGame("Draw!")
            
            } else {  // If it was not a draw or a win for the player, we let the computer have its turn
                let bestMove = board.getBestMove();
                board.makeMove(bestMove, 2);

                updatePage(board);
                
                var winner2 = board.isWinner(2);
                
                // Look at the grid again but now for the computer
                if (winner2[0] === true) {
                    // boxes[winner2[1]+1].bgColor = "red";
                    // boxes[winner2[2]+1].bgColor = "red";
                    // boxes[winner2[3]+1].bgColor = "red";

                    endGame("You Lose!")
                } else if (board.isDraw() === true) {
                    endGame("Draw!")
                }
            }
        }
    })
    $(".box").eq(i).mouseover(function() {
        var hoveredPosition = i + 1;
        if (board.grid[hoveredPosition] === 0) {
            $(this).css("color", "rgba(255, 255, 255, 0.4)");
            $(this).css("cursor", "pointer");
            boxes[hoveredPosition - 1].textContent = "X";    
        }   
    })
    $(".box").eq(i).mouseout(function() {
        var hoveredPosition = i + 1;
        if (board.grid[hoveredPosition] === 0) {
            $(this).css("color", "white");
            $(this).css("cursor", "auto");
            boxes[hoveredPosition - 1].textContent = " ";    
        }
    })
}