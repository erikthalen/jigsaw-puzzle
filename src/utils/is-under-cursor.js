import { getTransformedPosition } from './pan.js'

export const isUnderCursor = (piece, { x, y, width, height }) => {
  const [xpos, ypos] = getTransformedPosition({ x, y })

  return (
    xpos >= piece.pos.x &&
    xpos <= piece.pos.x + width &&
    ypos >= piece.pos.y &&
    ypos <= piece.pos.y + height
  )
}
