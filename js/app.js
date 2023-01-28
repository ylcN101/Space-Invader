'use strict'

//building space invaders game

const BOARD_SIZE = 14
var gCandyInterval = null

var alienRowCount = 3
var alienRowLength = 8

const HERO = '<img src="img/hero.png" />'
const ALIEN = '<img src="img/12.png" />'
const LASER = '<img src="img/1.png" />'
const EARTH = '🟫'
const SKY = ''
const SUPER_LASER = '🔥'
const CANDY = '🍬'
const SHIELD = '<img src="img/shield.png" />'

var gBoard

var gGame = {
  isOn: false,
  score: 0,
  aliensCount: 0,
}

function onInit() {
  gBoard = buildBoard()
  createHero(gBoard)
  createAliens(gBoard)
  gCandyInterval = setInterval(createCandies, 10000)
  renderBoard(gBoard)
  gGame.isOn = true
  gGame.score = 0
  gHero.lives = 3
  gHero.superLaser = 0
  updateHTMLonRestart()
}

function buildBoard() {
  var board = []
  for (var i = 0; i < BOARD_SIZE; i++) {
    board.push([])
    for (var j = 0; j < BOARD_SIZE; j++) {
      board[i][j] = createCell()
    }

    //add earth
    if (i === 13) {
      for (var j = 0; j < BOARD_SIZE; j++) {
        board[i][j].gameObject = EARTH
        board[i][j].type = 'earth'
      }
    }

    //add sky
    if (i < 13) {
      for (var j = 0; j < BOARD_SIZE; j++) {
        board[i][j].gameObject = SKY
        board[i][j].type = ''
      }
    }
  }
  return board
}

function renderBoard(board) {
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      var cellObject = board[i][j].gameObject
      var cellType = board[i][j].type
      var className = `cell cell-${i}-${j} ${cellType}`

      if (cellObject === EARTH) className += ' earth'
      if (cellObject === HERO) className += ' hero'
      if (cellObject === ALIEN) className += ' alien'
      if (cellObject === LASER) className += ' laser'
      if (cellObject === SUPER_LASER) className += ' super-laser'
      if (cellObject === CANDY) className += ' candy'
      if (cellObject === SHIELD) className += ' shield'

      strHTML += `<td class="${className}" data-i="${i}" data-j="${j}">${cellObject}</td>`
    }

    strHTML += '</tr>'
  }
  var elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
}

function checkGameOver(isWin) {
  if (isWin) {
    clearInterval(gCandyInterval)
    clearInterval(gLaserInterval)
    gGame.isOn = false
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
    var elModalText = document.querySelector('.modal-text')
    elModalText.innerText = 'You Won!'
    return
  } else {
    clearInterval(gCandyInterval)
    clearInterval(gLaserInterval)
    gGame.isOn = false
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
    var elModalText = document.querySelector('.modal-text')
    elModalText.innerText = 'You Lost!'
    return
  }
}

function createCandies(board) {
  //put candy in random location on the first row
  var location = getLocationForCandies()
  var i = location[0]
  var j = location[1]
  updateCell({ i, j }, CANDY)

  //remove candy after 5 seconds
  setTimeout(function () {
    updateCell({ i, j }, SKY)
  }, 5000)
}

function onRestart() {
  clearInterval(gCandyInterval)
  clearInterval(gIntervalAliens)
  gIntervalAliens = null
  gGame.isOn = false
  var elModal = document.querySelector('.modal')
  elModal.style.display = 'none'
  var elScore = document.querySelector('.score span')
  elScore.innerText = 0
  onInit()
}

function updateHTMLonRestart() {
  var elLives = document.querySelector('.lives span')
  elLives.innerText = 3
  var elSuperLaser = document.querySelector('.super-laser span')
  elSuperLaser.innerText = 3
  var elScore = document.querySelector('.score span')
  elScore.innerText = 0
  var elShieldCount = document.querySelector('.shield-count span')
  elShieldCount.innerText = 3
}
