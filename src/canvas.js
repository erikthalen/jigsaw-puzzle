import { tap } from './utils/utils.js'
import { isVertical } from './utils/sides.js'
import { bezier, bezierInv } from './utils/bezier.js'

export const loadImage = src =>
  new Promise(resolve => {
    var image = new Image()
    // image.crossOrigin = 'anonymous'
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
    clearCanvas(ui)
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
  const pos = {
    x: piece.pos.x * ui.size.x,
    y: piece.pos.y * ui.size.y,
  }

  const size = {
    x: ui.size.x / puzzle.size.x,
    y: ui.size.y / puzzle.size.y,
  }

  const path = ui.shapes[piece.id]

  const { ctx, image } = ui
  const shapeOffset = Math.max(size.x, size.y)

  ctx.save()
  ctx.translate(pos.x, pos.y)

  const highlight = !puzzle.done && (piece.active || piece.alsoActive)
  const strokeWidth = 3 / Math.max(ui.zoom, 2)

  ctx.shadowColor = highlight ? 'rgba(100, 100, 100, 1)' : 'rgba(50, 50, 50, 1)'
  ctx.shadowBlur = strokeWidth
  ctx.shadowOffsetX = ctx.shadowOffsetY = -strokeWidth / 2

  ctx.strokeStyle = 'rgba(220, 220, 220, 1)'
  ctx.lineWidth = highlight ? strokeWidth * 2 : strokeWidth

  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  ctx.stroke(path)
  ctx.clip(path)

  ctx.drawImage(
    image, // image
    piece.origin.x * size.x - shapeOffset, // what part of image
    piece.origin.y * size.y - shapeOffset, // what part of image
    size.x + shapeOffset * 2, // how much of image
    size.y + shapeOffset * 2, // how much of image
    piece.pos.x / ui.size.x - shapeOffset, // where on canvas
    piece.pos.y / ui.size.y - shapeOffset, // where on canvas
    size.x + shapeOffset * 2, // how big on canvas
    size.y + shapeOffset * 2 // how big on canvas
  )

  ctx.restore()
}
