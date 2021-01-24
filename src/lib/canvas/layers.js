import { map } from "../../utils/array-helpers.js";
import { tap } from "../../utils/tap.js";
import { paintPiece } from "./paint-piece.js";
import { clearCanvas } from "./clear-canvas.js";

export const layers = (state) => ({
  ...state,
  canvas: {
    ...state.canvas,
    ctx: clearCanvas(state, state.canvas.ctx),
  },
  pieces: map(tap(paintPiece(state)))(state.pieces),
});