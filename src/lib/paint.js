import { map } from "./../utils/array-helpers.js";
import { paintPiece } from "./paint-piece.js";
import { clearCanvas } from "./clear-canvas.js";

export const paint = (state) => ({
  ...state,
  canvas: {
    ...state.canvas,
    ctx: clearCanvas(state, state.canvas.ctx),
  },
  pieces: map(paintPiece(state))(state.pieces),
});
