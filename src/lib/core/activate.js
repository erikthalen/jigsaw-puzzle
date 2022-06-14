import { activeLast, mapReverse, sort, map } from '../../utils/array-helpers.js'
import { isTruthy } from '../../utils/object-helpers.js'
import { runIf } from '../../utils/run-if.js'
import { pipe } from '../../utils/pipe.js'
import { isUnderCursor } from '../../utils/is-under-cursor.js'
import { getTransformedPosition } from '../../utils/pan.js'

const getPiecePos = (state, piece, e) => {
  const [x, y] = getTransformedPosition({ x: e.offsetX, y: e.offsetY }, state.canvas.DPI)

  return {
    x: x - piece.curPos.x,
    y: y - piece.curPos.y,
  }
}

// pieces gets painted bottom to top, we need to check in reverse order
export const activate = e => state => ({
  ...state,
  pieces: pipe(
    // activate clicked piece (first occurrence)
    mapReverse((piece, i, arr, acc) => ({
      ...piece,
      active:
        !acc.find(isTruthy('active')) && isUnderCursor(state, piece, e)
          ? getPiecePos(state, piece, e)
          : false,
    })),

    mapReverse((piece, i, arr) => ({
      ...piece,
      // activate the active piece's connections
      active: arr.find(p => p.active && p.connections.includes(piece.id))
        ? getPiecePos(state, piece, e)
        : // activate all pieces if none was clicked (and puzzle is draggable)
        !arr.find(isTruthy('active')) && state.puzzle.draggable
        ? getPiecePos(state, piece, e)
        : piece.active,
    })),

    // put the active piece(s) on top
    // if puzzle isn't done or not all pieces are active (puzzle dragged)
    runIf(sort(activeLast))(
      ps =>
        !state.puzzle.done &&
        ps.filter(p => p.active).length !== state.pieces.length
    )
  )(state.pieces),
})
