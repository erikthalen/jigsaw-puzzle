import { tap } from './utils/utils.js'
import { resizeImage } from './utils/resize-image.js'

const scales = [...Array(20)].map((_, i) => Math.floor((1 - i / 20) * 20) / 20)

console.log(scales)

export const loadImage = src =>
  new Promise(resolve => {
    const image = new Image()

    image.onload = () => {
      // const images = scales.map(scale => ({
      //   image: resizeImage(image, scale),
      //   width: image.width,
      //   height: image.height,
      // }))

      // console.log(images)

      resolve({ image, width: image.width, height: image.height })
    }

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

  ctx.strokeStyle = 'rgba(220, 220, 220, 1)'
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

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
  const size = {
    x: ui.size.x / puzzle.size.x,
    y: ui.size.y / puzzle.size.y,
  }

  const { ctx, image } = ui
  const path = ui.shapes[piece.id]

  //
  const shapeOffset = Math.max(size.x, size.y)

  ctx.save()
  ctx.translate(piece.pos.x * ui.size.x, piece.pos.y * ui.size.y)

  const highlight = !puzzle.done && (piece.active || piece.alsoActive)
  const strokeWidth = 8 / Math.max(ui.zoom, 4)

  ctx.lineWidth = highlight ? strokeWidth * 2 : strokeWidth
  ctx.shadowOffsetX = ctx.shadowOffsetY = -strokeWidth / 2
  ctx.shadowBlur = strokeWidth
  ctx.shadowColor = highlight ? 'rgba(100, 100, 100, 1)' : 'rgba(50, 50, 50, 1)'

  ctx.stroke(path)
  ctx.clip(path)

  ctx.drawImage(
    image,
    piece.origin.x * size.x - shapeOffset, // what part of image
    piece.origin.y * size.y - shapeOffset, // what part of image
    size.x + shapeOffset * ui.dpi, // how much of image
    size.y + shapeOffset * ui.dpi, // how much of image
    piece.pos.x / ui.size.x - shapeOffset, // where on canvas
    piece.pos.y / ui.size.y - shapeOffset, // where on canvas
    size.x + shapeOffset * ui.dpi, // how big on canvas
    size.y + shapeOffset * ui.dpi // how big on canvas
  )

  ctx.restore()
}
