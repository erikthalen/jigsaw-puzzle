export const asPosition = (piece, { x, y, width, height }) => {
  return (
    x >= piece.pos.x &&
    x <= piece.pos.x + width &&
    y >= piece.pos.y &&
    y <= piece.pos.y + height
  )
}
