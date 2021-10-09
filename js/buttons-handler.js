'use strict'

// set the level according to level button that was clicked and restart the game
function setLevel(size, mines) {
    if (gIsManualMode) return;
    gLevel.size = size;
    gLevel.mines = mines;
    restart();
    if (size === 4) document.querySelector('table').style.left = 35 + '%';
    if (size === 8) document.querySelector('table').style.left = 25 + '%';
    if (size === 12) document.querySelector('table').style.left = 10 + '%';
    if (size === 4) document.querySelector('table').style.bottom = 50 + '%';
    if (size === 8) document.querySelector('table').style.bottom = 25 + '%';
    if (size === 12) document.querySelector('table').style.bottom = 6 + '%';
}

// start the hint logic
function hint(elHint) {
    if (!gIsFirstMovePlayed) return;
    if (gHint) {
        elHint.style.backgroundColor = 'gold';
        gHint = null;
        gIsHint = false;
        return;
    }
    gIsHint = true;
    elHint.style.backgroundColor = 'yellow';
    gHint = elHint;
}

// this function pick random free location and mark it, it changes back and forth only the DOM, the Model is not changed, just used to get data on the cell (shown, mine, etc)
function saveMe() {
    if (gSaveMe > 0 && gIsFirstMovePlayed) {
        gSaveMe--;
        updateHeaders();
        var emptyLocs = getEmptyCoverdLocations(gBoard);
        // console.log(emptyLocs);
        if (!emptyLocs) return // if there is no safe locations we get null
        var randomLocation = emptyLocs[getRandomInt(0, emptyLocs.length)];
        var elMarkedCell = document.querySelector(`.cell-${randomLocation.i}-${randomLocation.j}`);
        elMarkedCell.classList.add('mark');
        setTimeout(function () { elMarkedCell.classList.remove('mark'); }, 800);
    }
}

function manualMode() {
    if (gIsFirstMovePlayed) return;
    if (!confirm('Do You to put the Bombs?')) return;
    if (gPlacesMines === 0) {
        gIsManualMode = true;
        document.querySelector('body').style.backgroundColor = 'brown';
        var elEndgame = document.querySelector('.end-game h1');
        elEndgame.innerText = '🖱R to 📌 Bombs ';
        elEndgame.style.display = 'block';
        elEndgame.style.left = 30 + '%';
        elEndgame.style.top = 85 + '%';
    }

}

function undo() {
    var savedGame = gGameSaves[gGameSaves.length - 2];
    if (!savedGame) return;
    var board = savedGame.board;
    gBoard = board;

    gGame.lives = savedGame.life;
    // console.log(gGameSaves);
    renderBoard(gBoard);
    renderMinesAndAmounts();
    gGameSaves.pop();
}

function sevenBoom() {
    if (gIsManualMode) return;
    if (gIsFirstMovePlayed) return;
    if (!confirm('Do You Want To Play 7 BOOM?')) return;
    var sevenIdxBombs = [];
    for (var i = 1; i <= gLevel.size ** 2; i++) {
        if (i % 7 === 0) sevenIdxBombs[i - 1] = true;
        else sevenIdxBombs[i - 1] = false;
    }
    // console.log(sevenIdxBombs);
    var counter = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (sevenIdxBombs[counter++]) gBoard[i][j].isMine = true;
        }
    }
    // console.log(gBoard);
    setMinesNegsCount(gBoard);
    renderBoard(gBoard);
    // takeContexMenuOff(); 
    gIsFirstMovePlayed = true;
    gLevel.mines = parseInt((gLevel.size ** 2) / 7);
    gIsManu7BOOMFirstMovePassed = true;
}
