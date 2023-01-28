'use strict'

//building space invaders game now building the hero

const LASER_SPEED = 140
const SUPER_LASER_SPEED = 70
var gLaserInterval = null
var gNegsInterval = null
var gBlowUpNegs
var gShieldInterval = null

var gHero = {
  pos: { i: 12, j: 6 },
  isDead: false,
  lives: 3,
  score: 0,
  isShooting: false,
  isMoving: false,
  isBlowingUp: false,
  isShield: false,
  isSuperLaser: false,
  isHitCandy: false,
  superLaserCount: 3,
  shieldCount: 3,
}

function createHero(board) {
  board[gHero.pos.i][gHero.pos.j].gameObject = HERO
  board[gHero.pos.i][gHero.pos.j].type = 'hero'
}

function onHandleKey(ev) {
  switch (ev.key) {
    case 'ArrowLeft':
      moveHero(-1)
      break
    case 'ArrowRight':
      moveHero(1)
      break
    case ' ':
      shootLaser()
      break
    case 'n':
      if (gHero.isShooting) return
      gHero.isBlowingUp = true
      shootLaser()
      break
    case 'x':
      if (gHero.superLaserCount === 0) return
      gHero.isSuperLaser = true
      fastShootLaser()
      break
    case 'z':
      if (gHero.shieldCount === 0) return
      if (gShieldInterval) return
      gHero.isShield = true
      gHero.shieldCount--
      createShield()
      break

    default:
      break
  }
}

function moveHero(diff) {
  //update model and dom
  if (gHero.pos.j + diff < 0 || gHero.pos.j + diff > 13) return
  gBoard[gHero.pos.i][gHero.pos.j].gameObject = null
  gBoard[gHero.pos.i][gHero.pos.j].type = ''

  //dom
  updateCell(gHero.pos, '')
  //add hero to new pos
  //update model

  gHero.pos.j += diff

  gBoard[gHero.pos.i][gHero.pos.j].gameObject = HERO
  gBoard[gHero.pos.i][gHero.pos.j].type = 'hero'
  //dom
  if (gHero.isShield) {
    updateCell(gHero.pos, SHIELD)
  } else updateCell(gHero.pos, HERO)
}

//sets and interval to shoot lasers(blinks) up to the sky
function shootLaser(speed = LASER_SPEED, type = LASER) {
  if (gLaserInterval) return
  if (!gGame.isOn || gHero.isShooting) return

  gHero.isShooting = true
  var pos = { i: gHero.pos.i - 1, j: gHero.pos.j }
  var laserTypeSpeed = gHero.isSuperLaser ? SUPER_LASER_SPEED : LASER_SPEED
  gLaserInterval = setInterval(function () {
    pos.i--
    blinkLaser(pos, type)
  }, laserTypeSpeed)
}

function blinkLaser(pos) {
  if (pos.i < 0) {
    clearInterval(gLaserInterval)
    gLaserInterval = null
    gHero.isShooting = false
    gHero.isBlowingUp = false
    gHero.isSuperLaser = false
    return
  }

  var cell = gBoard[pos.i][pos.j]
  if (cell.gameObject === ALIEN) {
    gHero.isShooting = false

    if (gHero.isSuperLaser) {
      console.log('super laser')
      updateCell(pos, SUPER_LASER)
      setTimeout(updateCell, SUPER_LASER_SPEED, pos, '')
      gHero.isSuperLaser = false
    }

    if (gHero.isBlowingUp) {
      console.log('blowing up negs')
      blowUpNegs(pos)
      gHero.isBlowingUp = false
    } else {
      console.log('blowing up one')
      handleAliensHit(pos)
      gHero.isSuperLaser = false
    }
    clearInterval(gLaserInterval)

    gLaserInterval = null
    return
  }

  if (cell.gameObject === CANDY) {
    gHero.isShooting = false
    gHero.isBlowingUp = false
    gHero.isSuperLaser = false
    gHero.isHitCandy = true
    handleAlienFreeze()
    handleCandyHit(pos)
    clearInterval(gLaserInterval)
    gLaserInterval = null
    return
  }

  setTimeout(function () {
    var whatMode = gHero.isSuperLaser
      ? updateCell(pos, SUPER_LASER)
      : updateCell(pos, LASER)
  }, 0)
  setTimeout(function () {
    updateCell(pos, '')
  }, LASER_SPEED / 4)
}

function blowUpNegs(pos) {
  clearInterval(gLaserInterval)
  for (var i = pos.i - 1; i <= pos.i + 1; i++) {
    for (var j = pos.j - 1; j <= pos.j + 1; j++) {
      if (i < 0 || j < 0 || i > 12 || j > 13) continue
      var cell = gBoard[i][j]
      if (cell.gameObject === ALIEN) {
        handleAliensHit({ i: i, j: j })
      }
    }
  }
}

function fastShootLaser(pos) {
  if (gLaserInterval) return
  if (!gGame.isOn || gHero.isShooting || gHero.superLaserCount === 0) return
  shootLaser(SUPER_LASER_SPEED, SUPER_LASER)
  gHero.superLaserCount--
  updateCountSuperLaser()
  console.log(gHero.superLaserCount)
}

function handleCandyHit(pos) {
  console.log('candy hit')
  gBoard[pos.i][pos.j].gameObject = null
  gBoard[pos.i][pos.j].type = ''
  updateCell(pos, '')
  gHero.isHitCandy = false
  updateScore(50)
  gAlienFreeze = true
}

function getHeroPos() {
  return gHero.pos
}

// Shields
// When player press 'z' his symbol change and he is safe for 5 seconds. Player has 3
// Shields

function createShield() {
  gBoard[gHero.pos.i][gHero.pos.j].type = 'shield'
  gBoard[gHero.pos.i][gHero.pos.j].gameObject = SHIELD
  updateShield()
  updateCell(gHero.pos, SHIELD)
  setTimeout(function () {
    gHero.isShield = false
    gBoard[gHero.pos.i][gHero.pos.j].type = 'hero'
    gBoard[gHero.pos.i][gHero.pos.j].gameObject = HERO
    updateCell(gHero.pos, HERO)
  }, 3000)
}

function updateShield() {
  var elShield = document.querySelector('.shield-count span')
  elShield.innerText = gHero.shieldCount
}
