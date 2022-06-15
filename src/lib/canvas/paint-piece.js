import { allSides } from '../../utils/sides.js'

export const paintPiece = state => piece => {
  const { ctx, image } = state.ui
  const pieceWidth = state.puzzle.width / state.puzzle.size.x
  const pieceHeight = state.puzzle.height / state.puzzle.size.y
  const shapeOffset = Math.max(pieceWidth, pieceHeight)

  ctx.save()
  ctx.beginPath()
  ctx.translate(piece.pos.x, piece.pos.y + pieceHeight)

  allSides.forEach(side => {
    drawSide(ctx, piece.shapes[side], {
      x: side === 'top' || side === 'bottom' ? -pieceHeight : -pieceWidth,
      y: side === 'top' || side === 'bottom' ? pieceWidth : pieceHeight,
    })
  })

  ctx.closePath()
  ctx.clip()

  ctx.drawImage(
    image, // image
    piece.origin.x * pieceWidth - shapeOffset, // what part of image
    piece.origin.y * pieceHeight - shapeOffset, // what part of image
    pieceWidth + shapeOffset * 2, // how much of image
    pieceHeight + shapeOffset * 2, // how much of image
    piece.pos.x / state.puzzle.width - shapeOffset, // where on canvas
    piece.pos.y / state.puzzle.height - shapeOffset - pieceHeight, // where on canvas
    pieceWidth + shapeOffset * 2, // how big on canvas
    pieceHeight + shapeOffset * 2 // how big on canvas
  )

  ctx.restore()

  const highlight = !state.puzzle.done && (piece.active || piece.alsoActive)

  ctx.shadowColor = highlight ? 'rgba(100, 100, 100, 1)' : 'rgba(50, 50, 50, 1)'
  ctx.strokeStyle = highlight
    ? 'rgba(225, 225, 225, 1)'
    : 'rgba(220, 220, 220, 1)'
  ctx.shadowBlur = highlight ? 2 : 1
  ctx.lineWidth = highlight ? 2 : 1

  ctx.shadowOffsetX = ctx.shadowOffsetY = -1
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  ctx.stroke()
}

function drawSide(ctx, side, size) {
  ctx.translate(0, size.x)

  if (side === 'flat') {
    ctx.lineTo(size.y, 0)
  } else {
    side.forEach(b => {
      ctx.bezierCurveTo(b.cx1, b.cy1, b.cx2, b.cy2, b.ex, b.ey)
    })
  }

  ctx.rotate(Math.PI / 2)
}
