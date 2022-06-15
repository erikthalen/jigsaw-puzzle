import { tap } from '../utils/utils.js'
import { paintPiece } from './canvas/paint-piece.js'

export const loadImage = src =>
  new Promise(resolve => {
    var image = new Image()
    image.onload = () =>
      resolve({ image, width: image.width, height: image.height })

    image.src = src
  })

export const resize = canvas => {
  const { height, width } = getComputedStyle(canvas.parentElement)

  canvas.width = parseInt(width, 0) * window.devicePixelRatio
  canvas.height = parseInt(height, 0) * window.devicePixelRatio
}

export const makeCanvas = element => {
  const canvas =
    element.tagName === 'CANVAS' ? element : document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (element.tagName !== 'CANVAS') {
    element.appendChild(canvas)
  }

  resize(canvas)

  return {
    canvas,
    ctx,
  }
}

export const clearCanvas = tap(state => {
  const { canvas, ctx } = state.ui
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.restore()
})

export const paint = tap(state => {
  state.puzzle.pieces.map(paintPiece(state))
})
