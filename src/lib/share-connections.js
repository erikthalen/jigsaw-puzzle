import { filterUniqe } from "./../utils/array-helpers.js";

// should return, not modify
export const shareConnections = (state, piece, newPiece) => {
  piece.connections = filterUniqe([
    piece.id,
    newPiece.id,
    ...piece.connections,
    ...newPiece.connections,
  ]);

  piece.connections.forEach((id) => {
    const connection = state.pieces.find((piece) => piece.id === id);
    connection.connections = filterUniqe(piece.connections);
  });

  newPiece.connections.forEach((id) => {
    const connection = state.pieces.find((piece) => piece.id === id);
    connection.connections = filterUniqe(piece.connections);
  });
};
