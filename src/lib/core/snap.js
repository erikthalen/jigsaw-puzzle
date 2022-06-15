import { shareConnections } from './share-connections.js'
import { isClose } from './is-close.js'
import { same } from './../../utils/object-helpers.js'

const moveConnections = (state, [...pieceIds], distance) => {
  pieceIds.forEach(id => {
    const piece = state.puzzle.pieces.find(same('id', id))
    piece.pos = {
      x: piece.pos.x + distance.x,
      y: piece.pos.y + distance.y,
    }
  })
}

// export const snapNew = (state) => ({
//   ...state,
//   pieces: state.puzzle.pieces.map((piece) => ({
//     ...piece,
//     pos:
//       !piece.active ||
//       !Object.entries(piece.neighbors).find(([side, id]) =>
//         isClose(state.puzzle.pieces.find(same("id", id)), piece, state, side)
//       )
//         ? piece.pos
//         : { x: 10, y: 20 }
//   }))
// });

export const snap = state => {
  const activePieces = state.puzzle.pieces.filter(piece => piece.active)
  const { width, height, size } = state.puzzle

  if (
    !activePieces.length ||
    activePieces.length === state.puzzle.pieces.length
  ) {
    return state
  }

  activePieces.forEach(piece => {
    Object.entries(piece.neighbors).forEach(([side, id]) => {
      const neighbor = state.puzzle.pieces.find(same('id', id))

      if (isClose(neighbor, piece, state, side)) {
        const newPos = {
          x:
            neighbor.pos.x +
            (side === 'right'
              ? -width / size.x
              : side === 'left'
              ? +width / size.x
              : 0),
          y:
            neighbor.pos.y +
            (side === 'top'
              ? height / size.y
              : side === 'bottom'
              ? -height / size.y
              : 0),
        }

        // order is important
        moveConnections(state, piece.connections, {
          x: newPos.x - piece.pos.x,
          y: newPos.y - piece.pos.y,
        })

        piece.pos = newPos

        shareConnections(state, piece, neighbor)
      }
    })
  })

  return state
}
