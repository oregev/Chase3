/* 
    Chase3 game
    --------------
    The 3rd generation memory game chase.
    
    * every time a variable name contains Elem this means
    it is an HTML Element.
*/


document.fullscreenEnabled =
	document.fullscreenEnabled ||
	document.mozFullScreenEnabled ||
	document.documentElement.webkitRequestFullScreen;

addEventListener("click", function() {
    var el = document.documentElement,
      rfs = el.requestFullscreen
        || el.webkitRequestFullScreen
        || el.mozRequestFullScreen
        || el.msRequestFullscreen 
    ;
    rfs.call(el);
});
// Sounds initialization // MAYBE LOAD ARRAY OF SOUNDS TO USE IN THE GAME ???
const compSound = new Audio('sounds/padSound1.mp3');
const playSound = new Audio('sounds/frog.mp3');
const gameMusic = new Audio('sounds/gameMusic2.mp3');
const winMusic = new Audio('sounds/winMusic2.mp3');
const loseMusic = new Audio('sounds/loseMusic2.mp3');

// layout initialization
const startScr = document.getElementById("start-scr");
const choserScr = document.getElementById("choser-scr");
const gameScr = document.getElementById("game-scr");
const readyScr = document.getElementById("ready-scr");
const readyMsg = document.getElementById("ready-msg");
const winScr = document.getElementById("win-scr");
const loseScr = document.getElementById("lose-scr");
const replayElem = document.getElementById("replayElem");
const levelElem = document.getElementById("levelElem");
const gameArea = document.getElementById("game-area");
const compMoveColor = "coral";
const playMoveColor = "darkgoldenrod"

let boardSize, board, sequence, turn, playerTurn, userAnswer; // action

(function initialization() { // runs automatic as the page loads
    boardSize = 0;
    board = document.createElement("DIV");
    board.setAttribute("id", "board");
    gameReset();
})();

function gameReset() { // runs every new game
    sequence = [];
    turn = 1;
    playerTurn = false;
    userAnswer = [];
};


/* creates the pads on the board */
const createBoard = (gridWidth, numOfPads) => {
    const gridColumnWidth = ("1fr ").repeat(gridWidth); // creates the grid-template-column
    board.style.gridTemplateColumns = gridColumnWidth;

    for(let i = 0; i < numOfPads; i++) { // creates the pads
        let element = document.createElement("BUTTON");
        element.setAttribute("id", "pad" + (i));
        element.setAttribute("class", "padBtn");
        element.setAttribute("value", i);
        element.setAttribute("onclick", "checkAnswer(id)");
        element.setAttribute("disabled", "false");
        
        board.appendChild(element);
    }
    gameArea.appendChild(board);

}

/* creates the sequence according to the current turn */
const createSequence = (max = 1) => {
    sequence  = [];
    let min = 0;
    for(let i = 0; i < turn; i++) {
        sequence.push(Math.floor(Math.random() * max) + min);
    }
}

/* removes the start screen and showes the chose screen */
const removeStartScr = () => { 
    gameMusic.play();
    startScr.style.display="none";
    choserScr.style.display="flex";
}

const refresh = () => {
    window.location.reload();
}

const removeScr = (element) => { 
    element.style.display="none";
}

/* toggle the win and lose screens */
const flickScreen = async(screen) => { 
    gameScr.style.display="none";
    screen.style.display="flex";
    await(sleep(3));
    screen.style.display="none";
    gameScr.style.display="flex";
}

const toggleMenu = (element, toClose) => {
    if(element.style.display === "none") {
        element.style.display="block";
        if(toClose != undefined) {
            toClose.style.display="none";
        }
    } else {
        element.style.display="none";
    }
}

/* delays the game in varias positions */
const sleep = (sec) => { 
    const ms = sec * 1000;
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* changes the color of the pad */
const flickPad = async(padName) => {
    const originalColor = padName.style.backgroundColor;
    const moveColor = playerTurn ? playMoveColor : compMoveColor
    if(!playerTurn) {
        compSound.play();
    }   
    padName.style.backgroundColor = moveColor;
    await(sleep(0.2));
    padName.style.backgroundColor = originalColor;
}

/* flicks the borad for correct answer */
const flickBoard = async() => {
    const originalColor = board.style.backgroundColor;
    const correctColor = "lightgreen";
    board.style.backgroundColor = correctColor;
    await(sleep(0.2));
    board.style.backgroundColor = originalColor;
}

const checkAnswer = async(padName) => {
    playSound.play();
    const pad = document.getElementById(padName);
    flickPad(pad);
    userAnswer.push(parseInt(pad.value));
    partOfSeq = sequence.slice(0, userAnswer.length);

    if(JSON.stringify(userAnswer) === JSON.stringify(partOfSeq)) {
        flickBoard();
        if(userAnswer.length === sequence.length) {
            await(sleep(1));
            turn += 1;
            levelElem.innerHTML = ("LEVEL: " + turn);
            flickScreen(winScr);
            gameMusic.pause();
            winMusic.play();
            await(sleep(3));
            runGame();
        }
    }  
    else {
        flickScreen(loseScr);
        gameMusic.pause();
        loseMusic.play();
        await(sleep(0.8));
        gameReset();
        await(sleep(0.8));
        runGame();
    }
}

const playerMove = async() => {
    userAnswer = [];
    readyScr.style.display = "flex";
    await(sleep(1));
    readyScr.style.display = "none";
    playerTurn = true;
    replayElem.disabled = false;
    padsDisableEnable(false);
}

const padsDisableEnable = (status) => {
    let pads = document.getElementsByClassName('padBtn');
    for(let i = 0; i < pads.length; i++) {
        pads[i].disabled =  status;        
    }    
}

const compMove = async() => {
    padsDisableEnable(true);
    
    replayElem.disabled = true;

    readyMsg.innerHTML = "WATCH<BR>AND<BR>LEARN";
    readyScr.style.display = "flex";
    await(sleep(2));
    gameMusic.play();
    readyScr.style.display = "none";
    readyMsg.innerHTML = "NOW<BR>CHASE";
    await(sleep(1));
    playerTurn = false;
    for(let i = 0; i < sequence.length; i++) {
        const padName = "pad" + (sequence[i]);
        flickPad(document.getElementById(padName));
        await(sleep(1));
    }
    playerMove();
    
}

const replayCompTurn = () => {
    compMove();
}

const runGame = async() => {
    createSequence(boardSize);
    compMove();
}

const createWorld = () => {
    choserScr.style.display="none";
    gameScr.style.display="flex";
    let gridWidth = 0;
    const selector = document.getElementsByClassName("selector");
    for(let i = 0; i < selector.length; i++) {
        if(selector[i].checked) {
            gridWidth = parseInt(selector[i].value);
        }
    }
    switch(gridWidth) {
        case 2: {
            boardSize = 4; break;
        } 
        case 3: {
            boardSize = 9; break;
        } 
        case 4: {
            boardSize = 16; break;
        } 
        default: {
            window.location.reload();
        }
    }
    createBoard(gridWidth, boardSize);
    runGame();
}