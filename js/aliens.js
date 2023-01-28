'use strict'

//building space invaders game
//building the aliens
const ALIEN_LASER = '🔸'

var gAliensTopRowIdx
var gAliensBottomRowIdx
var gIsAtRightEdge = false
var gIntervalAliens = null
var gLaserInterval = null
var ALIEN_SPEED = 500
var ALIEN_SHOT_SPEED = 350
var gAlienFreeze = false
var gIntervalAlienShot = null

function createAliens(board) {
  for (var i = 0; i < alienRowCount; i++) {
    for (var j = 0; j < alienRowLength; j++) {
      board[i][j].gameObject = ALIEN
      board[i][j].type = 'alien'
      gGame.aliensCount++
    }
  }

  gAliensTopRowIdx = 0
  gAliensBottomRowIdx = alienRowCount - 1

  gIntervalAliens = setInterval(function () {
    shiftBoardRight(board, gAliensTopRowIdx, gAliensBottomRowIdx)
  }, ALIEN_SPEED)

  gIntervalAlienShot = setInterval(function () {
    alienShoot()
  }, 1000)
}

function shiftBoardRight(board, fromI, toI) {
  if (gAlienFreeze) return
  if (!gGame.isOn) return
  for (var i = fromI; i <= toI; i++) {
    for (var j = board.length - 1; j >= 0; j--) {
      if (board[i][j].gameObject === ALIEN) {
        if (j === board.length - 1) {
          gIsAtRightEdge = true

          clearInterval(gIntervalAliens)

          gIntervalAliens = setInterval(function () {
            shiftBoardDown(board, gAliensTopRowIdx, gAliensBottomRowIdx)
          }, ALIEN_SPEED)

          return
        }

        updateCell({ i: i, j: j }, '')
        updateCell({ i: i, j: j + 1 }, ALIEN)
      }
    }
  }
}

function shiftBoardLeft(board, fromI, toI) {
  if (!gGame.isOn) return
  for (var i = fromI; i <= toI; i++) {
    for (var j = 0; j <= board.length - 1; j++) {
      if (board[i][j].gameObject === ALIEN) {
        if (j === 0) {
          gIsAtRightEdge = false

          clearInterval(gIntervalAliens)

          gIntervalAliens = setInterval(function () {
            shiftBoardDown(board, gAliensTopRowIdx, gAliensBottomRowIdx)
          }, ALIEN_SPEED)

          return
        }

        updateCell({ i: i, j: j }, '')
        updateCell({ i: i, j: j - 1 }, ALIEN)
      }
    }
  }
}

function shiftBoardDown(board, fromI, toI) {
  if (!gGame.isOn) return
  for (var i = toI; i >= fromI; i--) {
    for (var j = 0; j <= board.length - 1; j++) {
      if (board[i + 1][j].gameObject === HERO) {
        checkGameOver(false)
        return
      }

      if (board[i][j].gameObject === ALIEN) {
        updateCell({ i: i, j: j }, '')
        updateCell({ i: i + 1, j: j }, ALIEN)

        clearInterval(gIntervalAliens)
      }
    }
  }

  gAliensTopRowIdx++
  gAliensBottomRowIdx++

  if (gIsAtRightEdge) {
    gIntervalAliens = setInterval(function () {
      shiftBoardLeft(board, gAliensTopRowIdx, gAliensBottomRowIdx)
    }, ALIEN_SPEED)
  } else {
    gIntervalAliens = setInterval(function () {
      shiftBoardRight(board, gAliensTopRowIdx, gAliensBottomRowIdx)
    }, ALIEN_SPEED)
  }
}

function handleAliensHit(pos) {
  //only kill one alien at a time and let the laser get higher on board update the model and the dom we wan to also update that if we shot with 'n' we need to kill his neighbor

  var cell = gBoard[pos.i][pos.j]
  cell.gameObject = null
  cell.type = ''
  updateCell(pos, '')
  clearInterval(gLaserInterval)
  gLaserInterval = null
  gHero.isShooting = false
  gHero.isSuperLaser = false
  gGame.aliensCount--
  updateScore(10)
  if (gGame.aliensCount === 0 && !checkIfThereIsAlienOnBoard()) {
    checkGameOver(true)
  }
}

function handleAlienFreeze() {
  gAlienFreeze = true
  clearInterval(gIntervalAliens)
  setTimeout(function () {
    gAlienFreeze = false
    gIntervalAliens = setInterval(function () {
      shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
    }, ALIEN_SPEED)
  }, 5000)
}

function checkIfThereIsAlienOnBoard() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (gBoard[i][j].gameObject === ALIEN) {
        return true
      }
    }
  }
  return false
}

function isRowEmpty(rowIdx) {
  for (var i = 0; i < gBoard.length; i++) {
    if (gBoard[rowIdx][i].gameObject === ALIEN) {
      return false
    }
  }
  return true
}

function getRandomAlienShooter() {
  //we need to get a random alien shooter from the bottom row and always the first one we find and if we dont find any we need to go up one row and check again we can use the isRowEmpty function to check if the row is empty and if it is we need to go up one row and check again
  var rowIdx = gAliensBottomRowIdx
  while (rowIdx >= gAliensTopRowIdx) {
    if (!isRowEmpty(rowIdx)) {
      for (var i = 0; i < gBoard.length; i++) {
        if (gBoard[rowIdx][i].gameObject === ALIEN) {
          return { i: rowIdx, j: i }
        }
      }
    }
    rowIdx--
  }

  return null
}

function alienShoot() {
  //only shoot if there is no laser on the board and if there is no alien shooting and if there is no freeze
  if (!gIntervalAlienShot || !gAlienFreeze) {
    clearInterval(gIntervalAlienShot)

    console.log('shooting')
    var shooterPos = getRandomAlienShooter()
    if (shooterPos) {
      alienLaser(shooterPos)
    }
  }

  setTimeout(function () {
    alienShoot()
  }, 5000)
}
function alienLaser(shooterPos) {
  if (!gGame.isOn) return
  if (gAlienFreeze) return

  var laserPos = { i: shooterPos.i + 1, j: shooterPos.j }
  var heroPos = getHeroPos()
  var cell = gBoard[laserPos.i][laserPos.j]
  cell.gameObject = ALIEN_LASER
  cell.type = ALIEN_LASER
  updateCell(laserPos, ALIEN_LASER)
  gIntervalAlienShot = setInterval(function () {
    //check if the laser hit the alien we dont want to remove the alien and the laser
    if (cell.gameObject === ALIEN) {
      clearInterval(gIntervalAlienShot)
      gIntervalAlienShot = null
      return
    }

    if (laserPos.i === heroPos.i && laserPos.j === heroPos.j) {
      console.log('hero hit')
      handleHeroHit(laserPos)
      clearInterval(gIntervalAlienShot)
      gIntervalAlienShot = null
      return
    }

    if (laserPos.i === gBoard.length - 1) {
      clearInterval(gIntervalAlienShot)
      gIntervalAlienShot = null
      return
    }

    updateCell(laserPos, '')
    laserPos.i++
    cell = gBoard[laserPos.i][laserPos.j]
    cell.gameObject = ALIEN_LASER
    cell.type = ALIEN_LASER
    updateCell(laserPos, ALIEN_LASER)
  }, 300)
}

function handleHeroHit(laserPos) {
  //if the hero is on shield we need to reduce the shield count and if the shield count is 0 we need to remove the shield and if the hero is not on shield we need to reduce the lives and if the lives are 0 we need to end the game
  if (gHero.isShield) {
    updateCell(laserPos, SHIELD)
    return
  }

  var currLaserPos = { i: laserPos.i, j: laserPos.j }
  updateCell(currLaserPos, HERO)
  gHero.lives--
  updateLives()
  if (gHero.lives === 0) {
    checkGameOver(false)
    gGame.isOn = false
    return
  }
}

function updateLives() {
  var elLives = document.querySelector('.lives span')
  elLives.innerText = gHero.lives
}

function getHeroPos() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (gBoard[i][j].gameObject === HERO) {
        return { i: i, j: j }
      }
    }
  }
}
