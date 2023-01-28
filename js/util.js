function createCell(gameObject = null) {
  return {
    type: '',
    gameObject,
  }
}

function updateCell(pos, gameObject = null) {
  gBoard[pos.i][pos.j].gameObject = gameObject
  var elCell = getElCell(pos)
  elCell.innerHTML = gameObject || ''
}

function getElCell(pos) {
  return document.querySelector(`[data-i='${pos.i}'][data-j='${pos.j}']`)
}

function updateScore(diff) {
  gGame.score += diff
  document.querySelector('.score span ').innerText = gGame.score
}

function getLocationForCandies() {
  //find a random location on the first row
  var i = 0
  var j = getRandomIntInclusive(0, BOARD_SIZE - 2)
  return [i, j]
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function updateCountSuperLaser() {
  var elSuperLaser = document.querySelector('.super-laser span')
  elSuperLaser.innerText = gHero.superLaserCount
}
