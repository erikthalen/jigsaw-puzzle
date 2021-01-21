import { isUnderCursor } from './../utils/is-under-cursor.js'

export const getCursor = (e) => state => {
  const hovered = state.pieces.find((piece) => isUnderCursor(state, piece, e))
  const active = state.pieces.find(piece => piece.active)
  const allActive = state.pieces.every(piece => piece.active)

  if(active && !allActive) {
    state.canvas.cursor = 'grabbing'
    return
  }
  
  if (hovered && !active) {
    state.canvas.cursor = 'grab'
    return
  }
  
  if (state.puzzle.draggable) {
    state.canvas.cursor = 'move'
    return
  }
}

export const setCursor = state => {
  state.canvas.element.style.cursor = state.canvas.cursor
}
