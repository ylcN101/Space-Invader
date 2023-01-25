'use strict'

const ALIEN = '👾'
const ALIEN_SPEED = 500
var gAlienInterval = null
const ALIENS_ROW_LENGTH = 8
const ALIENS_ROW_COUNT = 3
var gIsAlienFreeze = false

function createAlien() {
  return {
    type: ALIEN,
    isDead: false,
    isHit: false,
  }
}

function createAliens(board) {
  for (var i = 0; i < ALIENS_ROW_COUNT; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (j === 0 || j === board[0].length - 1) continue
      board[i][j].gameObject = createAlien()
      updateCell({ i, j }, ALIEN)
      gGame.alienCount++
    }
  }
  gAlienInterval = setInterval(moveAliens, ALIEN_SPEED)
}

var gAliensTopRowIdx = 0
var gAliensBottomRowIdx = ALIENS_ROW_COUNT - 1

function isAliensReachRightEdge() {
  for (var i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
    if (gBoard[i][gBoard[0].length - 1].gameObject) return true
  }
  return false
}

function isAliensReachLeftEdge() {
  for (var i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
    if (gBoard[i][0].gameObject) return true
  }
  return false
}

function isAliensRowEmpty(rowIdx) {
  for (var j = 0; j < gBoard[0].length; j++) {
    if (gBoard[rowIdx][j].gameObject) return false
  }
  return true
}

function shiftAliensRight() {
  for (var i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
    for (var j = gBoard[0].length - 1; j > 0; j--) {
      if (gBoard[i][j].gameObject && gBoard[i][j].gameObject.type === ALIEN) {
        updateCell({ i, j }, '')
        updateCell({ i, j: j + 1 }, ALIEN)
      }
    }
  }
}

function shiftAliensLeft() {
  for (var i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].gameObject && gBoard[i][j].gameObject.type === ALIEN) {
        updateCell({ i, j }, '')
        updateCell({ i, j: j - 1 }, ALIEN)
      }
    }
  }
}

function shiftAliensDown() {
  for (var i = gAliensBottomRowIdx; i >= gAliensTopRowIdx; i--) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].gameObject && gBoard[i][j].gameObject.type === ALIEN) {
        updateCell({ i, j }, '')
        updateCell({ i: i + 1, j }, ALIEN)
      }
    }
  }

  updateAliensRowsIdx()
}

function moveAliens() {
  if (isAliensReachRightEdge()) {
    shiftAliensDown()
    shiftAliensLeft()
  } else if (isAliensReachLeftEdge()) {
    shiftAliensDown()
    shiftAliensRight()
  } else {
    shiftAliensRight()
  }
}
