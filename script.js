/* 
    Chase3 game
    --------------
    The 3rd generation memory
    game chase.
*/

addEventListener("click", function() {
    var el = document.documentElement,
      rfs = el.requestFullscreen
        || el.webkitRequestFullScreen
        || el.mozRequestFullScreen
        || el.msRequestFullscreen 
    ;

    rfs.call(el);
});

let playSound, compSound, gameMusic; // audio 
let startScr, choserScr, gameScr, readyScr, readyMsg, winScr, loseScr, menu, about;
let gameArea, board, compMoveColor, playMoveColor; // layout
let sequence, turn, playerTurn, userAnswer; // action

(function initialization() {
    // Sounds initialization // MAYBE LOAD ARRAY OF SOUNDS TO USE IN THE GAME ???
    compSound = new Audio('sounds/padSound1.mp3');
    playSound = new Audio('sounds/frog.mp3');
    gameMusic = new Audio('sounds/gameMusic2.mp3');
    winMusic = new Audio('sounds/winMusic2.mp3');
    loseMusic = new Audio('sounds/loseMusic2.mp3');

    // layout initialization
    body = document.getElementById("body");
    startScr = document.getElementById("start-scr");
    menu = document.getElementById("menu");
    about = document.getElementById("about");
    choserScr = document.getElementById("choser-scr");
    gameScr = document.getElementById("game-scr");
    readyScr = document.getElementById("ready-scr");
    readyMsg = document.getElementById("ready-msg");
    winScr = document.getElementById("win-scr");
    level = document.getElementById("level");
    loseScr = document.getElementById("lose-scr");
    boardSize = 0;
    gameArea = document.getElementById("game-area");
    board = document.createElement("DIV");
    board.setAttribute("id", "board");
    compMoveColor = " rgb(83, 71, 255)" ;
    playMoveColor = "pink";

    // openFullscreen(body); 
    init();
})();
function init() { 
    sequence = [];
    turn = 1;
    playerTurn = false;
    userAnswer = [];
};


/* creates the pads on the board */
const createBoard = (gridWidth, numOfPads) => {
    let gridColumnWidth = ("1fr ").repeat(gridWidth); // creates the grid-template-column
    board.style.gridTemplateColumns=gridColumnWidth;

    for(let i = 0; i < numOfPads; i++) { // creates the pads
        let element = document.createElement("BUTTON");
        element.setAttribute("id", "pad" + (i));
        element.setAttribute("class", "padBtn");
        element.setAttribute("value", i);
        element.setAttribute("onclick", "checkAnswer(id)");
        element.setAttribute("disabled", "true");
        
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
/* flick the win and lose screens */
const flickScreen = async(screen) => { 
    gameScr.style.display="none";
    screen.style.display="flex";
    await(sleep(3));
    screen.style.display="none";
    gameScr.style.display="flex";
}

const toggleMenu = (element, close) => {
    if(element.style.display === "none") {
        element.style.display="block";
        if(close != undefined) {
            close.style.display="none";
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
    let originalColor = padName.style.backgroundColor;
    let moveColor = playerTurn ? playMoveColor : compMoveColor
    if(!playerTurn) {
        compSound.play();
    }   
    padName.style.backgroundColor=moveColor;
    await(sleep(0.2));
    padName.style.backgroundColor=originalColor;
}

/* flicks the borad for correct answer */
const flickBoard = async() => {
    let originalColor = board.style.backgroundColor;
    let correctColor = "lightgreen"
    board.style.backgroundColor=correctColor;
    await(sleep(0.2));
    board.style.backgroundColor=originalColor;
}

const checkAnswer = async(padName) => {
    playSound.play();
    let pad = document.getElementById(padName);
    flickPad(pad);
    userAnswer.push(parseInt(pad.value));
    partOfSeq = sequence.slice(0, userAnswer.length);

    if(JSON.stringify(userAnswer) === JSON.stringify(partOfSeq)) {
        flickBoard();
        if(userAnswer.length === sequence.length) {
            await(sleep(1));
            turn += 1;
            level.innerHTML=("LEVEL: " + turn);
            flickScreen(winScr);
            gameMusic.pause();
            winMusic.play();
            //Audio.play() // WINING MUSIC
            await(sleep(3));
            runGame();
        }
    }
    
    else {
        flickScreen(loseScr);
        gameMusic.pause();
        loseMusic.play();
        await(sleep(0.8));
        init();
        await(sleep(0.8));
        runGame();
    }
}

const playerMove = async() => {
    userAnswer = [];
    readyScr.style.display="flex";
    await(sleep(1));
    readyScr.style.display="none";
    let pads = document.getElementsByClassName("padBtn");
    for(let i = 0; i < pads.length; i++) {
        pads[i].disabled=false;
    }
    playerTurn = true;
}

const compMove = async() => {
    readyMsg.innerHTML="WATCH<BR>AND<BR>LEARN";
    readyScr.style.display="flex";
    await(sleep(2));
    gameMusic.play();
    readyScr.style.display="none";
    readyMsg.innerHTML="NOW<BR>CHASE";
    await(sleep(1));
    playerTurn = false;
    for(let i = 0; i < sequence.length; i++) {
        let padName = "pad" + (sequence[i]);
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
    gridWidth = parseInt(document.getElementById('grid-select').value);
    // console.log(document.getElementById("choser-form"));
    // console.log(document.getElementsByClassName("selector"));
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
            alert('problem!');
        }
    }
    createBoard(gridWidth, boardSize);
    runGame();
}