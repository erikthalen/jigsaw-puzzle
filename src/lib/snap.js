import { shareConnections } from "./share-connections.js";
import { isClose } from "./is-close.js";
import { same } from "./../utils/object-helpers.js";

const moveConnections = (state, [...pieceIds], distance) => {
  pieceIds.forEach((id) => {
    const piece = state.pieces.find(same("id", id));
    piece.curPos = {
      x: piece.curPos.x + distance.x,
      y: piece.curPos.y + distance.y,
    };
  });
};

// export const snapNew = (state) => ({
//   ...state,
//   pieces: state.pieces.map((piece) => ({
//     ...piece,
//     curPos:
//       !piece.active ||
//       !Object.entries(piece.neighbors).find(([side, id]) =>
//         isClose(state.pieces.find(same("id", id)), piece, state, side)
//       )
//         ? piece.curPos
//         : { x: 10, y: 20 }
//   }))
// });

export const snap = (state) => {
  const activePieces = state.pieces.filter((piece) => piece.active);

  if (!activePieces.length || activePieces.length === state.pieces.length) {
    return state;
  }

  activePieces.forEach((piece) => {
    Object.entries(piece.neighbors).forEach(([side, id]) => {
      const neighbor = state.pieces.find(same("id", id));

      if (isClose(neighbor, piece, state, side)) {
        const newPos = {
          x:
            neighbor.curPos.x +
            (side === "right"
              ? -neighbor.width
              : side === "left"
              ? +neighbor.width
              : 0),
          y:
            neighbor.curPos.y +
            (side === "top"
              ? neighbor.height
              : side === "bottom"
              ? -neighbor.height
              : 0),
        };

        // order is important
        moveConnections(state, piece.connections, {
          x: newPos.x - piece.curPos.x,
          y: newPos.y - piece.curPos.y,
        });

        piece.curPos = newPos;

        // piece.connections = neighbor.connections = shareConnections(state, piece, neighbor);

        shareConnections(state, piece, neighbor);
      }
    });
  });

  return state;
};
