import { isUnderCursor } from '../utils/is-under-cursor.js'
import { tap } from '../utils/utils.js'

export const setStatus = ({ x, y }) =>
  tap(puzzle => {
    const active = puzzle.pieces.find(piece => piece.active)

    if (active) {
      puzzle.status = 'active'
      return
    }

    const hovered = puzzle.pieces.find(piece =>
      isUnderCursor(piece, {
        x,
        y,
        width: puzzle.width / puzzle.size.x,
        height: puzzle.height / puzzle.size.y,
      })
    )

    if (hovered && !active) {
      puzzle.status = 'ready'
      return
    }

    puzzle.status = 'idle'
  })
