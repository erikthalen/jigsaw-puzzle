import { filterUnique } from './../../utils/array-helpers.js'

// should return, not modify
export const shareConnections = (puzzle, piece, newPiece) => {
  piece.connections = filterUnique([
    piece.id,
    newPiece.id,
    ...piece.connections,
    ...newPiece.connections,
  ])

  piece.connections.forEach(id => {
    const connection = puzzle.pieces.find(piece => piece.id === id)
    connection.connections = filterUnique(piece.connections)
  })

  newPiece.connections.forEach(id => {
    const connection = puzzle.pieces.find(piece => piece.id === id)
    connection.connections = filterUnique(piece.connections)
  })
}
