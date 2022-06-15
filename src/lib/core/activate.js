import { activeLast, mapReverse, sort } from '../../utils/array-helpers.js'
import { isTruthy } from '../../utils/object-helpers.js'
import { pipe, runIf } from '../../utils/utils.js'
import { isUnderCursor } from '../../utils/is-under-cursor.js'
import { getTransformedPosition } from '../../utils/pan.js'

const getPiecePos = (piece, e) => {
  const [x, y] = getTransformedPosition({ x: e.offsetX, y: e.offsetY })

  return {
    x: x - piece.pos.x,
    y: y - piece.pos.y,
  }
}

// pieces gets painted bottom to top, we need to check in reverse order
export const activate = e => state => ({
  ...state,
  puzzle: {
    ...state.puzzle,
    pieces: pipe(
      // activate clicked piece (first occurrence)
      mapReverse((piece, i, arr, acc) => ({
        ...piece,
        active:
          !acc.find(isTruthy('active')) &&
          isUnderCursor(piece, {
            x: e.offsetX,
            y: e.offsetY,
            width: state.puzzle.width / state.puzzle.size.x,
            height: state.puzzle.height / state.puzzle.size.y,
          })
            ? getPiecePos(piece, e)
            : false,
      })),

      mapReverse((piece, i, arr) => ({
        ...piece,
        // activate the active piece's connections
        active: arr.find(p => p.active && p.connections.includes(piece.id))
          ? getPiecePos(piece, e)
          : piece.active,
      })),

      // put the active piece(s) on top
      // if puzzle isn't done or not all pieces are active (puzzle dragged)
      runIf(sort(activeLast))(
        ps =>
          !state.puzzle.done &&
          ps.filter(p => p.active).length !== state.puzzle.pieces.length
      )
    )(state.puzzle.pieces),
  },
})

export const deactivate = state => ({
  ...state,
  puzzle: {
    ...state.puzzle,
    pieces: state.puzzle.pieces.map(piece => ({
      ...piece,
      active: false,
    })),
  },
})
