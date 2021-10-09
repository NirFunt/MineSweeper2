'use strict'

const SIZE = 4;
const MINES = 2;
const Lives = 3;

var gStartTime = 0;
var gTimeInterval;
var gReveledMines = 0;
var gIsFirstMovePlayed = false;

var gBoard;

var gLevel = {
    size: SIZE,
    mines: MINES
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: Lives
}

var gIsHint = false;
var gHint = null;
var gSaveMe = 3;
var gIsManualMode = false;
var gPlacesMines = 0;

var gGameSaves;
var gIsFirstUndo = true;

var gIsManu7BOOMFirstMovePassed = false;
