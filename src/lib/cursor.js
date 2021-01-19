import { isUnderCursor } from './../utils/is-under-cursor.js'

export const getCursor = (e) => state => {
  const hovered = state.pieces.find((piece) => isUnderCursor(state, piece, e))
  
  if (hovered) {
    state.canvas.cursor = 'grab'
  } else if (state.puzzle.draggable) {
    state.canvas.cursor = 'move'
  }

  return state
}

export const setCursor = state => {
  state.canvas.element.style.cursor = state.canvas.cursor

  return state
}
