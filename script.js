// for restarting the game.
let restart = document.getElementById("restart");
restart.addEventListener('click', restartGame);

// variable to declare winning message.
let winningSymbol = document.querySelector('#winner');

// returns an array of X's and O's wrt frag index IDs.
const typeCheck = () => {
    return game.board.filter(type => typeof type == "string");
}

let playerO1;
let playerX1;

// Checks if typeCheck returns an array that's totally filled with X's and O's, 
// i.e., whether all the 9 divs are filled or not and returns a boolean value accordingly.
const tieCheck = () => {
    if(typeCheck().length == 9) {
        return true;
    }
    else return false;
}

// Resets everthing and is called upon restart event listener.
function restartGame() {
    game = Game();
    DisplayBoard(game);
    frags.forEach(frag => frag.addEventListener('click', addId));
    winningSymbol.textContent = '';
    playerO1.classList.remove('inactive');
    playerX1.classList.remove('inactive');
}

// Game Factory.
const Game = () => {
    const board = new Array(9).fill(null);
    const turn = "O";
    return { turn, board };
};

// variable assignment.
let game = Game();
console.log(game);
// Changes X to O and vice versa.
const NextTurn = (TURN) => {
    if (TURN == 'X') {
        TURN = 'O';
    }
    else TURN = 'X';
    return TURN;
}

let futureTurn;

// takes X/O and puts it in game.board according at the correct index, i.e., ID of the frag clicked. 
const MakeMove = (i, BOARD, futureTurn) => {
    if (endGame()) {
        return;
    }
    BOARD[i] = futureTurn;
    return BOARD;
}

// Displaying to the frontEnd.
const DisplayBoard = (BOARD) => {
    swappity(game);
    let combos = winningCombinations();
    for (let i = 0; i < BOARD.board.length; i++) {
        let frags = document.querySelector(`.frags[id='${i}']`);
        frags.textContent = BOARD.board[i];
        
        frags.classList.remove("frag-winner");
        gameBoard.classList.remove("draw");
        
        let fragColor = game.board[i] == 'X' ? "frag-X" : "frag-O";
        frags.innerHTML = `<span class="${fragColor}">${game.board[i] ? game.board[i] : ""}</span>`;
        
        if (combos && combos.includes(i)) {
            frags.classList.add("frag-winner");
            frags.classList.remove(`${fragColor}`);
            if(winner() == 'X'){
                winningSymbol.textContent = 'X wins';
            }
            else winningSymbol.textContent = 'O wins';
        }
        if (tieCheck() && !combos) {
            winningSymbol.innerHTML = `It's a draw`;
            let gameBoard = document.querySelector("#gameBoard");
            gameBoard.classList.add("draw");
            playerX1 = document.querySelector('.player-x');
            playerO1 = document.querySelector('.player-o');
            playerX1.classList.remove('active');
            playerO1.classList.remove('active');
            playerX1.classList.add('inactive');
            playerO1.classList.add('inactive');
        }
    }
}

// Highlights the blue PLayer X title.
DisplayBoard(game); 

// Mapping X and O in the proper frag div and updating the game board. --------------
let frags = document.querySelectorAll(".frags");
frags.forEach(frag => frag.addEventListener("click", addId));

function addId(e) {
    fragClick(parseInt(e.target.id));
}

function fragClick(i) {
    frags[i].removeEventListener('click', addId);
    let presentTurn = game.turn;
    futureTurn = NextTurn(presentTurn);
    MakeMove(i, game.board, futureTurn);
    DisplayBoard(game);
    game.turn = futureTurn;
}
// ---------------------------------------------------------------------------------

// Function to check if there are any win patterns on the display.
function winningCombinations() {
    const combinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (const combination of combinations) {
        const [a, b, c] = combination;

        if (game.board[a] && (game.board[a] === game.board[b] && game.board[a] === game.board[c])) {
            frags.forEach(frag => frag.removeEventListener('click', addId));
            return combination;
        }
    };
    return null;
};

// Function to check if the game has ended.
function endGame() {
    let winningCombination = winningCombinations();
    if (winningCombination) {
        return true;
    }
    else {
        return false;
    }
}

// Function to swap the title highlights on the frontEnd.
function swappity(game) {
    let playerX = document.querySelector('.player-x');
    let playerO = document.querySelector('.player-o');
    
    if (game.turn == 'O') {
        playerX.classList.add('active');
        playerO.classList.remove('active');
    }
    else {
        playerO.classList.add('active');
        playerX.classList.remove('active');
    }
}

// Function to determine a winner on the basis of last updated value in game.turn.
// Here the return value and if condition contradict each other because 
// we've used a nextTurn function directly to update the value of O to X as the first value 
// that gets displayed on the screen and saved to the game.board ARRAY.
const winner = () => {
    if (game.turn == 'X') {
        return 'O';
    }
    else return 'X';
}