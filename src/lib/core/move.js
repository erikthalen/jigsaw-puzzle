export const move = ({ clientX, clientY }) => (state) => ({
  ...state,
  pieces: state.pieces.map((piece) => ({
    ...piece,
    curPos: piece.active
      ? {
          x: (clientX - state.canvas.pos.x) * state.canvas.DPI - piece.active.x,
          y: (clientY - state.canvas.pos.y) * state.canvas.DPI - piece.active.y,
        }
      : piece.curPos,
  })),
});
