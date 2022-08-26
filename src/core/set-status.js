import { asPosition } from './at-position.js'
import { tap } from '../utils/utils.js'

export const setStatus = ({ x, y }) =>
  tap(puzzle => {
    const active = puzzle.pieces.find(piece => piece.active)

    if (active) {
      puzzle.status = 'active'
      return
    }

    const hovered = puzzle.pieces.find(piece =>
      asPosition(piece, {
        x,
        y,
        width: 1 / puzzle.size.x,
        height: 1 / puzzle.size.y,
      })
    )

    if (hovered && !active) {
      puzzle.status = 'ready'
      return
    }

    puzzle.status = 'idle'
  })
