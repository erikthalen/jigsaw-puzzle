export const gather = (state) => {
  /**
   * map pieces and move them onto the board after window resize
   */
  state.pieces = state.pieces.map((piece) => ({
    ...piece,
    curPos: {
      x:
        piece.curPos.x - piece.width > state.canvas.width * state.canvas.DPI
          ? state.canvas.width - piece.width
          : piece.curPos.x,
      y:
        piece.curPos.y - piece.height > state.canvas.height * state.canvas.DPI
          ? state.canvas.height - piece.height
          : piece.curPos.y,
    },
  }));
  return state;
};
