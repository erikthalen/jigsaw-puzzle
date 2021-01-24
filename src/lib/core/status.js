export const status = (state) => {
  if (
    state.pieces[0].connections.length ===
      state.puzzle.rows * state.puzzle.cols &&
    !state.puzzle.done
  ) {
    state.puzzle.done = true;
    state.puzzle.onComplete(state);
  }
  return state;
};
