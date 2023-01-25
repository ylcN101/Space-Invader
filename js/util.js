'use strict'

function getElCell(pos) {
  return document.querySelector(`.cell${pos.i}-${pos.j}`)
}

function getNextPos(pos, ev) {
  var nextPos = {
    i: pos.i,
    j: pos.j,
  }
  switch (ev.key) {
    case 'ArrowLeft':
      nextPos.j--
      break
    case 'ArrowRight':
      nextPos.j++

      break
    case ' ':
      shoot()
      console.log('shoot')

      break
  }
  return nextPos
}
