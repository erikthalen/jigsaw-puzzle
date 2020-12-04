export const drawImage = (state, pos) => {
  state.canvas.ctx.drawImage(
    state.image.image,
    0,
    0,
    state.image.width,
    state.image.height,
    pos.x,
    pos.y,
    state.puzzle.width * state.puzzle.occupy,
    state.puzzle.height * state.puzzle.occupy
  );
  return state;
};
