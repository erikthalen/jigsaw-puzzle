export const status = onComplete => state => {
  if (
    state.puzzle.pieces[0].connections.length ===
      state.puzzle.size.y * state.puzzle.size.x &&
    !state.puzzle.done
  ) {
    state.puzzle.done = true
    onComplete(state)
  }
  return state
}
