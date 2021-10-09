'use strict'

// after creating all td elements we add to them a lisener to remove the contexmenu of each td 
function takeContexMenuOff() {
  var elCells = document.querySelectorAll('td');
  for (var i = 0; i < elCells.length; i++) {
    elCells[i].addEventListener('contextmenu', e => {
      e.preventDefault();
    });
  }
}

// create our Model, the Model will hold all the data needed by object, arrays, etc. the DOM would be updated by taking data from our gBoard model, we can update everytime the DOM to different values by taking different data from our Model as needed for the state of the game
function buildBoard(board) {
  for (var i = 0; i < gLevel.size; i++) {
    gBoard[i] = [];
    for (var j = 0; j < gLevel.size; j++) {
      board[i][j] = createCell(0, false, false, false);
    }
  }
  // board[0][1].isMine = board[2][1].isMine = true;
}

// create the basic Model Object cell which hold all needed data, the board would construct of these object cells, and the DOM table and td would be update according to the data contained in these object cells.
function createCell(minesAroundCount, isShown, isMine, isMarked) {
  var cell = {
    minesAroundCount: minesAroundCount,
    isShown: isShown,
    isMine: isMine,
    isMarked: isMarked
  }
  return cell;
}

// construct the UI table the data it arriving from our Model gBoard which contains all the data
function renderBoard(board) {
  var strHTML = '';
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>\n'
    for (var j = 0; j < board[0].length; j++) {
      var cellClassList = `cell-${i}-${j} `;
      var cellValue = '';
      if (!board[i][j].isShown) {
        cellClassList += 'cover';
        if (board[i][j].isMarked) cellValue = '<img src="img/red-flag.png">';
      }

      strHTML += ` <td class="${cellClassList}" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this, ${i} ,${j})"  > ${cellValue} </td>\n`;
    }
    strHTML += '</tr>\n'
  }
  // console.log(strHTML);
  var elTable = document.querySelector('.game-table');
  elTable.innerHTML = strHTML;
}

// after our Model board is constructed and mines were set, we go over each cell at our gBoard and check how much mines Neighbours it has, and insert the value into our object cell, then according to this data contained in cell we would be able to update our DOM accordinly
function setMinesNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      board[i][j].minesAroundCount = countMinesNeg(board, i, j);
    }
  }
}

// go to the selected cell(idxI, idxJ) neighbours in our model, and check if they are mines, if they are increment counter 
function countMinesNeg(board, idxI, idxJ) {
  var mineCount = 0;
  for (var i = idxI - 1; i <= idxI + 1; i++) {
      if (i < 0 || i > board.length - 1) continue;
      for (var j = idxJ - 1; j <= idxJ + 1; j++) {
          if (j < 0 || j > board[0].length - 1) continue;
          if (i === idxI && j === idxJ) continue;
          if (board[i][j].isMine) mineCount++;
      }
  }
  return mineCount;
}

// get all the locations of a picked cell on the table, returns as array of location objects
function getNegLocations(board, idxI, idxJ) {
  var negCells = [];
  for (var i = idxI - 1; i <= idxI + 1; i++) {
    if (i < 0 || i > board.length - 1) continue;
    for (var j = idxJ - 1; j <= idxJ + 1; j++) {
      if (j < 0 || j > board[0].length - 1) continue;
      negCells.push({ i: i, j: j });
    }
  }
  return negCells;
}

// go over the board model, and check for mines, cell doesn't contain mine then its location is pushed to emptyLocations arr, so that a random mine would be randomly entered somewhere where there is no mine 
function getEmptyLocations(board) {
  var emptyLocations = [];
  for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board[0].length; j++) {
          if (!board[i][j].isMine) emptyLocations.push({ i: i, j: j });
      }
  }
  return emptyLocations;
}

// this function get negCellLocations which is the locations of all the neigbouurs of the cell that was clicked, and taking these location off emptyLocations, because we dont want to a bomb to be a neigbouur of the first clicked cell , then update the mines in gBoard 
function takeClickedNegLocOff(negCellLocations, emptyLocations) {
  // taking off locations
  for (var i = 0; i < negCellLocations.length; i++) {
      for (var j = 0; j < emptyLocations.length; j++) {
          if (negCellLocations[i].i === emptyLocations[j].i && negCellLocations[i].j === emptyLocations[j].j) {
              emptyLocations.splice(j, 1);
          }
      }
  }

  // get random locations and insert mines to gBoard
  for (var i = 0; i < gLevel.mines; i++) {
      var randomLocation = emptyLocations[getRandomInt(0, emptyLocations.length)];
      gBoard[randomLocation.i][randomLocation.j].isMine = true;
  }
}


function getEmptyCoverdLocations(board) {
  var emptyLocations = [];
  for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board[0].length; j++) {
          if(board[i][j].isShown) continue;
          if (!board[i][j].isMine) emptyLocations.push({ i: i, j: j });
      }
  }
  return emptyLocations;
}



function copyMatrix (board) {
  var copyBoard = [];
  for (var i = 0; i < board.length; i++) {
      copyBoard[i] = [];
      for (var j = 0; j < board[0].length; j++) {
          var cell = board[i][j];
          copyBoard[i][j] = createCell(cell.minesAroundCount, cell.isShown, cell.isMine,cell.isMarked);
      }
  }
  return copyBoard;
}

function renderMinesAndAmounts () {
  for (var i = 0; i < gBoard.length; i++) {
      for (var j = 0; j < gBoard[0].length; j++) {
          var elCell = document.querySelector(`.cell-${i}-${j}`);
          if (gBoard[i][j].isMine && gBoard[i][j].isShown) elCell.innerHTML = '🧨';
          else if (gBoard[i][j].isShown) UpdateDOMBombsNoExpand (elCell, i, j);
      }
  }
}


// get random int exclusive 
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

