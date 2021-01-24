import { paintPiece } from './paint-piece.js'
import { clearCanvas } from './clear-canvas.js'
import { map } from '../../utils/array-helpers.js'
import { tap } from '../../utils/tap.js'

export const makeLayers = tap(state => {
  state.canvas.background.ctx = clearCanvas(state, state.canvas.background.ctx)
  state.canvas.foreground.ctx = clearCanvas(state, state.canvas.foreground.ctx)

  map(paintPiece(state, { ctx: state.canvas.background.ctx }))(
    state.pieces.filter(({ active }) => !active)
  )
  
  map(paintPiece(state, { ctx: state.canvas.foreground.ctx }))(
    state.pieces.filter(({ active }) => active)
  )
})
