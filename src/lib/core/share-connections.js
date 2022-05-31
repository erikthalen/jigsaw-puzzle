import { filterUnique } from "./../../utils/array-helpers.js";

// should return, not modify
export const shareConnections = (state, piece, newPiece) => {
  piece.connections = filterUnique([
    piece.id,
    newPiece.id,
    ...piece.connections,
    ...newPiece.connections,
  ]);

  piece.connections.forEach((id) => {
    const connection = state.pieces.find((piece) => piece.id === id);
    connection.connections = filterUnique(piece.connections);
  });

  newPiece.connections.forEach((id) => {
    const connection = state.pieces.find((piece) => piece.id === id);
    connection.connections = filterUnique(piece.connections);
  });
};
