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
  // gAlienInterval = setInterval(moveAliens, ALIEN_SPEED)
}

var gAliensTopRowIdx = 0
var gAliensBottomRowIdx = ALIENS_ROW_COUNT - 1
