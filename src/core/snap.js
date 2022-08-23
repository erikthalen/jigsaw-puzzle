import { shareConnections } from './share-connections.js'
import { isClose } from './is-close.js'
import { tap } from '../utils/utils.js'

const same = (val, prop) => obj => obj[val] === prop

const moveConnections = (puzzle, [...pieceIds], distance) => {
  pieceIds.forEach(id => {
    const piece = puzzle.pieces.find(same('id', id))
    piece.pos = {
      x: piece.pos.x + distance.x,
      y: piece.pos.y + distance.y,
    }
  })
}

export const snap = tap(puzzle => {
  const activePieces = puzzle.pieces.filter(piece => piece.active)
  const { width, height, size } = puzzle

  if (!activePieces.length || activePieces.length === puzzle.pieces.length) {
    return
  }

  activePieces.forEach(piece => {
    Object.entries(piece.neighbors).forEach(([side, id]) => {
      const neighbor = puzzle.pieces.find(same('id', id))

      if (isClose(neighbor, piece, puzzle, side)) {
        const newPos = {
          x:
            neighbor.pos.x +
            (side === 'right'
              ? -1 / size.x
              : side === 'left'
              ? +1 / size.x
              : 0),
          y:
            neighbor.pos.y +
            (side === 'top' ? 1 / size.y : side === 'bottom' ? -1 / size.y : 0),
        }

        // order is important
        moveConnections(puzzle, piece.connections, {
          x: newPos.x - piece.pos.x,
          y: newPos.y - piece.pos.y,
        })

        piece.pos = newPos

        shareConnections(puzzle, piece, neighbor)
      }
    })
  })
})
