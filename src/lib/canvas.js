import { tap } from '../utils/utils.js'
import { allSides } from '../utils/sides.js'

export const loadImage = src =>
  new Promise(resolve => {
    var image = new Image()
    image.onload = () =>
      resolve({ image, width: image.width, height: image.height })

    image.src = src
  })

export const resize = canvas => {
  const { height, width } = getComputedStyle(canvas.parentElement)

  const dpr = Math.min(2, window.devicePixelRatio)

  canvas.width = parseInt(width, 0) * dpr
  canvas.height = parseInt(height, 0) * dpr
}

export const makeCanvas = element => {
  const canvas =
    element && element.tagName === 'CANVAS'
      ? element
      : document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (element && element.tagName !== 'CANVAS') {
    element.appendChild(canvas)

    canvas.style.width = '100%'
    canvas.style.height = '100%'

    resize(canvas)
  }

  return {
    canvas,
    ctx,
  }
}

export const clearCanvas = tap(ui => {
  const { canvas, ctx } = ui
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.restore()
})

export const paint = puzzle =>
  tap(ui => {
    // ui.ctx.drawImage(ui.layers.active.canvas, 0, 0)
    // ui.ctx.drawImage(ui.layers.nonActive.canvas, 0, 0)
    puzzle.pieces.map(paintPiece(puzzle, ui))
  })

export const setCursor = puzzle =>
  tap(ui => {
    ui.canvas.style.cursor =
      puzzle.status === 'active'
        ? 'grabbing'
        : puzzle.status === 'ready'
        ? 'grab'
        : 'default'
  })

export const paintPiece = (puzzle, ui) => piece => {
  const { ctx, image } = ui
  const pieceWidth = puzzle.width / puzzle.size.x
  const pieceHeight = puzzle.height / puzzle.size.y
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
    piece.pos.x / puzzle.width - shapeOffset, // where on canvas
    piece.pos.y / puzzle.height - shapeOffset - pieceHeight, // where on canvas
    pieceWidth + shapeOffset * 2, // how big on canvas
    pieceHeight + shapeOffset * 2 // how big on canvas
  )

  ctx.restore()

  const highlight = !puzzle.done && (piece.active || piece.alsoActive)
  const strokeWidth = (1 / 2500) * puzzle.width

  ctx.shadowColor = highlight ? 'rgba(100, 100, 100, 1)' : 'rgba(50, 50, 50, 1)'
  ctx.strokeStyle = highlight
    ? 'rgba(225, 225, 225, 1)'
    : 'rgba(220, 220, 220, 1)'
  ctx.shadowBlur = highlight ? strokeWidth * 2 : strokeWidth
  ctx.lineWidth = highlight ? strokeWidth * 2 : strokeWidth

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
