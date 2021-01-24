import { map } from '../../utils/array-helpers.js'
import { tap } from '../../utils/tap.js'
import { paintPiece } from './paint-piece.js'
import { clearCanvas } from './clear-canvas.js'
import { paintLayers } from './paint-layers.js'

// export const paint = (state) => ({
//   ...state,
//   canvas: {
//     ...state.canvas,
//     ctx: clearCanvas(state, state.canvas.ctx),
//   },
//   pieces: map(tap(paintPiece(state)))(state.pieces),
// });

export const paint = tap(state => {
  clearCanvas(state, state.canvas.ctx)
  paintLayers(state)
  // state.pieces = map(tap(paintPiece(state)))(state.pieces)
})
