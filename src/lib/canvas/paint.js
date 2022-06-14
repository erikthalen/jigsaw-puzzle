import { map } from '../../utils/array-helpers.js'
import { tap } from '../../utils/tap.js'
import { paintPiece } from './paint-piece.js'

export const paint = tap(state => {
  state.pieces = map(tap(paintPiece(state)))(state.pieces)
})
