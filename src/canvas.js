import { tap } from './utils/utils.js'
import { cutPieces } from './utils/create-piece.js'

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

export const createOffscreen = async (
  image,
  piecesData,
  numberOfPieces,
  onProgress = () => {}
) => {
  const pieceWidth = image.width / numberOfPieces.x
  const pieceHeight = image.height / numberOfPieces.y
  const extraSpaceNeeded = Math.round(Math.max(pieceWidth, pieceHeight) / 2)

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  ctx.msImageSmoothingEnabled = false
  ctx.mozImageSmoothingEnabled = false
  ctx.webkitImageSmoothingEnabled = false
  ctx.imageSmoothingEnabled = false

  canvas.width = (pieceWidth + extraSpaceNeeded) * numberOfPieces.x * 1.1
  canvas.height = (pieceHeight + extraSpaceNeeded) * numberOfPieces.y * 1.1

  const totalNumberOfPieces = numberOfPieces.x * numberOfPieces.y
  let piecesProcessed = 0

  const paths = cutPieces(pieceWidth, pieceHeight, piecesData)

  const getPieceData = piece => {
    return new Promise(resolve => {
      ctx.save()
      ctx.setTransform(
        1,
        0,
        0,
        1,
        (pieceWidth + extraSpaceNeeded) * piece.origin.x * 1.1,
        (pieceHeight + extraSpaceNeeded) * piece.origin.y * 1.1
      )

      // ctx.stroke(paths[piece.id])
      ctx.clip(paths[piece.id])

      ctx.drawImage(
        image,
        piece.origin.x * pieceWidth - extraSpaceNeeded, // what part of image
        piece.origin.y * pieceHeight - extraSpaceNeeded, // what part of image
        pieceWidth + extraSpaceNeeded * 2, // how much of image
        pieceHeight + extraSpaceNeeded * 2, // how much of image
        -extraSpaceNeeded, // where on canvas
        -extraSpaceNeeded, // where on canvas
        pieceWidth + extraSpaceNeeded * 2, // how big on canvas
        pieceHeight + extraSpaceNeeded * 2 // how big on canvas
      )

      ctx.restore()

      piecesProcessed++

      onProgress(piecesProcessed / totalNumberOfPieces)

      resolve({
        id: piece.id,
        data: {
          x:
            ((pieceWidth + extraSpaceNeeded) * piece.origin.x -
              extraSpaceNeeded / 2) *
            1.1,
          y:
            ((pieceHeight + extraSpaceNeeded) * piece.origin.y -
              extraSpaceNeeded / 2) *
            1.1,
          width: (pieceWidth + extraSpaceNeeded * 2) * 1.05 - extraSpaceNeeded,
          height:
            (pieceHeight + extraSpaceNeeded * 2) * 1.05 - extraSpaceNeeded,
          extraSpaceNeeded,
        },
      })
    })
  }

  return new Promise(async resolve => {
    const pieces = new Map()
    const piecesRenderData = await Promise.all(piecesData.map(getPieceData))
    piecesRenderData.forEach(piece => {
      pieces.set(piece.id, piece.data)
    })

    resolve({ canvas, pieces })
  })
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
    puzzle.pieces.map(paintPiece(ui))
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

export const paintPiece = (ui) => piece => {
  ui.ctx.setTransform(
    ui.zoom,
    0,
    0,
    ui.zoom,
    piece.pos.x * ui.size.x * ui.zoom + ui.position.x,
    piece.pos.y * ui.size.y * ui.zoom + ui.position.y
  )

  const renderPiece = ui.offscreen.pieces.get(piece.id)

  ui.ctx.drawImage(
    ui.offscreen.canvas,
    renderPiece.x, // what part of image
    renderPiece.y, // what part of image
    renderPiece.width, // how much of image
    renderPiece.height, // how much of image
    piece.pos.x / ui.size.x - renderPiece.extraSpaceNeeded / 2, // where on canvas
    piece.pos.y / ui.size.y - renderPiece.extraSpaceNeeded / 2, // where on canvas
    renderPiece.width, // how big on canvas
    renderPiece.height // how big on canvas
  )
}
