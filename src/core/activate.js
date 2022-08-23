import { activeLast, mapReverse, sort } from '../utils/array-helpers.js'
import { pipe, runIf } from '../utils/utils.js'
import { isUnderCursor } from '../utils/is-under-cursor.js'
import { tap } from '../utils/utils.js'

const isTruthy = prop => obj => obj[prop]

const getPiecePos = (piece, { x, y }) => {
  return {
    x: x - piece.pos.x,
    y: y - piece.pos.y,
  }
}

// pieces gets painted bottom to top, we need to check in reverse order
export const activate =
  ({ x, y }) =>
  puzzle => ({
    ...puzzle,
    pieces: pipe(
      // activate clicked piece (first occurrence)
      mapReverse((piece, i, arr, acc) => ({
        ...piece,
        active:
          !acc.find(isTruthy('active')) &&
          isUnderCursor(piece, {
            x,
            y,
            width: 1 / puzzle.size.x,
            height: 1 / puzzle.size.y,
          })
            ? getPiecePos(piece, { x, y })
            : false,
      })),

      mapReverse((piece, i, arr) => ({
        ...piece,
        // activate the active piece's connections
        active: arr.find(p => p.active && p.connections.includes(piece.id))
          ? getPiecePos(piece, { x, y })
          : piece.active,
      })),

      // put the active piece(s) on top
      // if puzzle isn't done or not all pieces are active (puzzle dragged)
      runIf(sort(activeLast))(
        ps =>
          !puzzle.done &&
          ps.filter(p => p.active).length !== puzzle.pieces.length
      )
    )(puzzle.pieces),
  })

export const deactivate = tap(puzzle => {
  puzzle.pieces = puzzle.pieces.map(piece => ({
    ...piece,
    active: false,
  }))
})
