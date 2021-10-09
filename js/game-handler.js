'use strict'


// initGame() called when HTML page load, and when restart() called
function initGame() {
    document.querySelector('.table').addEventListener('contextmenu', e => {e.preventDefault();});
    updateHeaders(); // update headers of Lives and Time Passed
    gBoard = [];
    gGameSaves = [];
    gGame.isOn = true; // game is on

    buildBoard(gBoard); // create our Model, the Model will hold all the data needed by object, arrays, etc. the DOM would be updated by taking data from our gBoard model, we can update everytime the DOM to different values by taking different data from our Model as needed for the state of the game
    renderBoard(gBoard); // construct the UI table the data it arriving from our Model gBoard which contains all the data
    // takeContexMenuOff(); // after creating all td elements we add to them a lisener to remove the contexmenu of each td
    document.querySelector('.best-score span').innerText = localStorage.getItem(`best-score-level-${gLevel.size}`);
    // gGameSaves.push( {board : copyMatrix(gBoard), life : gGame.lives });
}


// check if game is over
function checkGameOver() {
    // console.log(gGame.shownCount, gGame.markedCount);

    if (gGame.lives === 0) lose();
    else if ((gGame.shownCount === gLevel.size ** 2 - gLevel.mines + gReveledMines)
        && (gGame.markedCount === gLevel.mines - gReveledMines)) won();
}

// won situation 
function won() {
    var elEndgame = document.querySelector('.end-game h1');
    document.querySelector('.face').src = 'img/won-face.jpg';
    clearInterval(gTimeInterval);
    gGame.isOn = false;
    elEndgame.innerText = 'You Won';
    elEndgame.style.display = 'block';

    var bestScore = localStorage.getItem(`best-score-level-${gLevel.size}`);
    if (gGame.shownCount - gReveledMines > +bestScore) {
        localStorage.setItem(`best-score-level-${gLevel.size}`, gGame.shownCount - gReveledMines);
    }
}

// lose situation 
function lose() {
    var elEndgame = document.querySelector('.end-game h1');
    document.querySelector('.face').src = 'img/lose-face.jpg';
    clearInterval(gTimeInterval);
    gGame.isOn = false;
    elEndgame.innerText = 'You Lose';
    elEndgame.style.display = 'block';

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isShown = true;
                var elMineCell = document.querySelector(`.cell-${i}-${j}`);
                elMineCell.classList.remove('cover');
                elMineCell.innerHTML = '🧨';
            }
        }
    }
    var bestScore = localStorage.getItem(`best-score-level-${gLevel.size}`);
    if (gGame.shownCount - gReveledMines > +bestScore) {
        localStorage.setItem(`best-score-level-${gLevel.size}`, gGame.shownCount);
    }
}


// restart the game after pressing the smily or the level buttons
function restart() {
    document.querySelector('.face').src = 'img/happy.jpg'; // return to original smiley face
    document.querySelector('.end-game h1').style.display = 'none';

    // reboot all our counters and variables so they would be ready for new game
    gIsFirstMovePlayed = false;
    gStartTime = 0;
    gReveledMines = 0;
    gGame.shownCount = 0;
    gGame.secsPassed = 0;
    gGame.markedCount = 0;
    gGame.lives = Lives;
    gSaveMe = 3;
    gIsManualMode = false;
    gPlacesMines = 0;
    gGameSaves = [];

    clearInterval(gTimeInterval); // stop the stopper
    initGame(); // start new game
    restartHints();
}

// revels all the hints and change their color back to blue
function restartHints() {
    document.querySelector('.hint1').classList.remove('hint-hide');
    document.querySelector('.hint2').classList.remove('hint-hide');
    document.querySelector('.hint3').classList.remove('hint-hide');
    document.querySelector('.hint1').style.backgroundColor = 'gold';
    document.querySelector('.hint2').style.backgroundColor = 'gold';
    document.querySelector('.hint3').style.backgroundColor = 'gold';
    gHint = null;
}

// update headers of Lives and Time Passed
function updateHeaders() {
    document.querySelector('h3 span').innerText = gGame.secsPassed;
    document.querySelector('.lives span').innerText = gGame.lives;
    document.querySelector('.safe-amount').innerText = gSaveMe;
}

// update the smily face according to Lives
function updateFaceAccodingToLives() {
    if (gGame.lives === 3) document.querySelector('.face').src = 'img/happy.jpg';
    else if (gGame.lives === 2) document.querySelector('.face').src = 'img/twolife.jpg';
    else if (gGame.lives === 1) document.querySelector('.face').src = 'img/onelife.jpg';
}

// update the time passed by taking every 1000ms the Date.now(), also update the headers and faces according to lives
function stoper() {
    gGame.secsPassed = Math.floor((Date.now() - gStartTime) / 1000);
    updateHeaders();
    updateFaceAccodingToLives();
}

