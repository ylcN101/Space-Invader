'use strict'
const HERO = '🚀'

const LASER_SPEED = 80
var gLaserInterval = null

function createHero(board) {
  var pos = getHeroPos(board)
  var hero = createHeroObject()
  board[pos.i][pos.j].gameObject = hero
  updateCell(pos, hero.type)
}

function createHeroObject() {
  return {
    type: HERO,
    isDead: false,
  }
}

function getHeroPos(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (board[i][j].type === HERO) {
        return { i, j }
      }
    }
  }
}

function moveHero(ev) {
  var pos = getHeroPos(gBoard)
  var nextPos = getNextPos(pos, ev)
  if (!isNextPosValid(nextPos)) return
  // update the dom
  updateCell(pos)
  updateCell(nextPos, HERO)
}

function isNextPosValid(pos) {
  if (pos.i !== BOARD_SIZE - 2) return false
  if (pos.j < 0 || pos.j >= BOARD_SIZE) return false
  return true
}

function shoot() {
  if (gLaserInterval) return
  var pos = getHeroPos(gBoard)
  pos.i--
  gLaserInterval = setInterval(function () {
    pos.i--
    blinkLaser(pos)
  }, LASER_SPEED)
}

function createLaserObject() {
  return {
    type: LASER,
    isDead: false,
    isHit: false,
  }
}

function handleAliensHit(pos) {
  //only kill one alien at a time and let the laser get higher on board update the model and the dom
  var cell = gBoard[pos.i][pos.j]
  // cell.gameObject.isDead = true
  // cell.gameObject.isHit = true
  cell.type = null
  updateCell(pos)
  clearInterval(gLaserInterval)
  gLaserInterval = null
  gGame.alienCount--
  updateScore(10)
  if (gGame.alienCount === 0) {
    checkGameOver(true)
  }
}

function blinkLaser(pos) {
  // renders a LASER at specific cell for short time and removes it
  if (pos.i < 0) {
    clearInterval(gLaserInterval)
    gLaserInterval = null
    return
  }
  var cell = gBoard[pos.i][pos.j]
  if (cell.type === ALIEN) {
    handleAliensHit(pos)
    return
  }
  updateCell(pos, LASER)
  setTimeout(function () {
    updateCell(pos)
  }, LASER_SPEED / 2)
}
