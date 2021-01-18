// import { isUnderCursor } from './activate.js'

const isUnderCursor = (p, x, y) => {
  return false
  // return (
  //   p.curPos.x
  // )
}

export const changeCursor = ({ clientX, clientY }) => state => {
  console.log(state.canvas.element, clientX, clientY, state)
  // state.canvas.element.style.cursor = state.pieces.find(isUnderCursor) ? 'pointer' : 'resize'
  state.canvas.element.style.cursor = 'move'

  return state
}
