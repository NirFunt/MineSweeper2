'use strict'

// happens when left mouse button clicked on td cell of the DOM table
function cellClicked(elCell, idxI, idxJ) {
    if (!gGame.isOn) return;

    if (gIsManualMode) return;

    if (gIsManu7BOOMFirstMovePassed) {
        gStartTime = Date.now();
        gTimeInterval = setInterval(stoper, 1000);
        gIsManu7BOOMFirstMovePassed = false;
    }

    if (gBoard[idxI][idxJ].isShown) return;
    if (gBoard[idxI][idxJ].isMarked) return;

    if (gIsHint) {
        // will cover and uncover only the DOM, will use the Model but wont change it, 
        gIsHint = false;
        gHint.classList.add('hint-hide');
        var negLocations = getNegLocations(gBoard, idxI, idxJ);

        for (var i = 0; i < negLocations.length; i++) {
            var loc = negLocations[i];
            var elNegCell = document.querySelector(`.cell-${loc.i}-${loc.j}`)
            elNegCell.classList.remove('cover');

            UpdateDOMBombsNoExpand(elNegCell, loc.i, loc.j);
            // elNegCell.innerHTML = gBoard[loc.i][loc.j].minesAroundCount;
            if (gBoard[loc.i][loc.j].isMine) elNegCell.innerHTML = '🧨';
        }

        setTimeout(function () {
            for (var i = 0; i < negLocations.length; i++) {
                var loc = negLocations[i];
               
                var elNegCell = document.querySelector(`.cell-${loc.i}-${loc.j}`)
                if (!gBoard[loc.i][loc.j].isShown) elNegCell.classList.add('cover');
                if (gBoard[loc.i][loc.j].isMine) elNegCell.innerHTML = '';
                if (!gBoard[loc.i][loc.j].isShown) elNegCell.innerHTML = "";

                if (gBoard[loc.i][loc.j].isMine && gBoard[loc.i][loc.j].isShown) elNegCell.innerHTML = '🧨';
                if (gBoard[loc.i][loc.j].isMarked) elNegCell.innerHTML = '<img src="img/red-flag.png">';
            }
            gHint = null;
        }, 2000);

    } else {

        gGame.shownCount++;
        gBoard[idxI][idxJ].isShown = true; // model
        elCell.classList.remove('cover'); // DOM

        // all this code happens only at first click
        if (!gIsFirstMovePlayed) firstMove(idxI, idxJ);

        UpdateDOMMinesAroundCount(elCell, idxI, idxJ);

        if (gBoard[idxI][idxJ].isMine) {
            elCell.innerHTML = '🧨';
            document.querySelector('.face').src = 'img/supprise-face.jpg';
            gGame.lives--;
            updateHeaders();
            gReveledMines++;
        }

        checkGameOver();
    }
    gGameSaves.push({ board: copyMatrix(gBoard), life: gGame.lives });
    // copy the gBoard and all its object cells to new board and new cells object with new refernces. in the future I should store also all the gVars for more correct undo()
    // console.log(gGameSaves);
}

// happens when right mouse button clicked on td cell of the DOM table
function cellMarked(elCell, i, j) {
    // console.log(i,j);
    if (!gGame.isOn) return;

    if (gBoard[i][j].isShown) return;

    if (gIsManualMode) {
        gBoard[i][j].isMine = true;
        elCell.innerHTML = '🧨';
        gIsFirstMovePlayed = true;
        gPlacesMines++;
        if (gPlacesMines === gLevel.mines) {
            gIsManualMode = false;
            setMinesNegsCount(gBoard);
            renderBoard(gBoard);
            // takeContexMenuOff();
            document.querySelector('body').style.backgroundColor = 'lightskyblue';
            document.querySelector('.end-game h1').style.display = 'none';
            document.querySelector('.end-game h1').style.left = 40 + '%';
            gIsManu7BOOMFirstMovePassed = true;
        }
        return;
    }


    if (!gIsFirstMovePlayed) return;
    // if (!gIsFirstMove) {
    //     firstMove(i, j);
    //     gBoard[i][j].isMarked = true;
    // } 

    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false;
        elCell.innerHTML = '';
        gGame.markedCount--;
    } else {
        gBoard[i][j].isMarked = true;
        elCell.innerHTML = '<img src="img/red-flag.png">';
        gGame.markedCount++;
        gGameSaves.push({ board: copyMatrix(gBoard), life: gGame.lives });
    }

    checkGameOver();

}

// the function called when cell have no bombs negs, it is doing neigbours loops to find all neigbours, if its not bomb, not shown, not flag, then it shows it and put its bomb neg count by UpdateDOMMinesAroundCount
function expandShown(board, elCell, idxI, idxJ) {
    if (gBoard[idxI][idxJ].isMine) return;
    for (var i = idxI - 1; i <= idxI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = idxJ - 1; j <= idxJ + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            if (i === idxI && j === idxJ) continue;
            if (gBoard[i][j].isMarked || gBoard[i][j].isMine || gBoard[i][j].isShown) {
                continue;
            }
            board[i][j].isShown = true;
            gGame.shownCount++;
            var elNegCell = document.querySelector(`.cell-${i}-${j}`);
            elNegCell.classList.remove('cover');

            UpdateDOMMinesAroundCount(elNegCell, i, j);

        }
    }
}


// the function update the DOM td cell showing value of neg mines taken from the model gBoard at same location, update the neg mines value and color it according to its value, in 0 neg case another function is called
// so when left mouse button pressed then the innerHTML of elCell update to consist the neg mine count
function UpdateDOMMinesAroundCount(elCell, idxI, idxJ) {
    switch (gBoard[idxI][idxJ].minesAroundCount) {
        case 0:
            expandShown(gBoard, elCell, idxI, idxJ);
            break;
        case 1:
            elCell.innerHTML = `<span style="color: blue;"> ${gBoard[idxI][idxJ].minesAroundCount} </span>`;
            break;
        case 2:
            elCell.innerHTML = `<span style="color: green;"> ${gBoard[idxI][idxJ].minesAroundCount} </span>`;
            break;
        case 3:
            elCell.innerHTML = `<span style="color: red;"> ${gBoard[idxI][idxJ].minesAroundCount} </span>`;
            break;
        case 4:
            elCell.innerHTML = `<span style="color: purple;"> ${gBoard[idxI][idxJ].minesAroundCount} </span>`;
            break;
        case 5:
            elCell.innerHTML = `<span style="color: gold;"> ${gBoard[idxI][idxJ].minesAroundCount} </span>`;
            break;
    }
}

function UpdateDOMBombsNoExpand(elCell, idxI, idxJ) {
    switch (gBoard[idxI][idxJ].minesAroundCount) {
        case 0:
            elCell.innerHTML = '';
            break;
        case 1:
            elCell.innerHTML = `<span style="color: blue;"> ${gBoard[idxI][idxJ].minesAroundCount} </span>`;
            break;
        case 2:
            elCell.innerHTML = `<span style="color: green;"> ${gBoard[idxI][idxJ].minesAroundCount} </span>`;
            break;
        case 3:
            elCell.innerHTML = `<span style="color: red;"> ${gBoard[idxI][idxJ].minesAroundCount} </span>`;
            break;
        case 4:
            elCell.innerHTML = `<span style="color: purple;"> ${gBoard[idxI][idxJ].minesAroundCount} </span>`;
            break;
        case 5:
            elCell.innerHTML = `<span style="color: gold;"> ${gBoard[idxI][idxJ].minesAroundCount} </span>`;
            break;
    }
}

// happnes only on the first click
function firstMove(idxI, idxJ) {
    var negCellLocations = getNegLocations(gBoard, idxI, idxJ);
    var emptyLocations = getEmptyLocations(gBoard);

    takeClickedNegLocOff(negCellLocations, emptyLocations);

    setMinesNegsCount(gBoard); // we need to set the mines after the fisrt click, so we wont fall on mine the first time, this function goes over all the board and count mines neg for each cell and enter the data to the model cell object
    renderBoard(gBoard); // we need to render the cells in table (DOM) again because our Model gBoard has changed and now it has mines
    // takeContexMenuOff(); // we need to do it again due to renderBoard () again

    gIsFirstMovePlayed = true; // condition to make all this block code to happen once at first click

    gStartTime = Date.now(); // take the start time at first click
    gTimeInterval = setInterval(stoper, 1000);
}

