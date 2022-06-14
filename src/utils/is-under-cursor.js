import { getTransformedPosition } from './pan.js'

export const isUnderCursor = (state, piece, e) => {
  const [x, y] = getTransformedPosition({ x: e.offsetX, y: e.offsetY }, state.canvas.DPI)
  
  return (
    x >= piece.curPos.x &&
    x <= piece.curPos.x + piece.width &&
    y >= piece.curPos.y &&
    y <= piece.curPos.y + piece.height
  )
}
