export const deactivate = (state) => ({
  ...state,
  pieces: state.pieces
    // .sort(connectedFirst)
    .map((piece) => ({
      ...piece,
      active: false,
    })),
});
