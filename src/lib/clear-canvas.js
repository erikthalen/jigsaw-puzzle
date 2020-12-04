export const clearCanvas = (state, ctx) => {
  ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
  return ctx;
};
