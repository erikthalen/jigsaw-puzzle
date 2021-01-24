export const clone = (state) => ({
  image: state.image,
  canvas: state.canvas,
  pieces: JSON.parse(JSON.stringify(state.pieces)),
  puzzle: JSON.parse(JSON.stringify(state.puzzle)),
});
