import { map } from '../../utils/array-helpers'
import { paintPiece } from './paint-piece'

export const paintLayers = state => {
  state.canvas.ctx.drawImage(state.canvas.background.canvas, 0, 0)
  //   state.canvas.ctx.drawImage(
  //     state.canvas.foreground.canvas,
  //     state.canvas.foreground.pos.x * state.canvas.DPI,
  //     state.canvas.foreground.pos.y * state.canvas.DPI
  //   )
  const activePieces = state.pieces.filter(({ active }) => active)
  map(paintPiece(state))(activePieces)
}
