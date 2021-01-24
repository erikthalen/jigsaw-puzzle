import { random } from "./../../utils/random.js";

export const shuffle = (state) => ({
  ...state,
  pieces: state.pieces.map((piece, i) => ({
    ...piece,
    connections: [],
    curPos: {
      x: random() * (state.canvas.width - state.pieces[0].width),
      y: random() * (state.canvas.height - state.pieces[0].height),
    },
  })),
});
