import { random } from "./../utils/random.js";

export const shuffle = (state) => ({
  ...state,
  pieces: state.pieces.map((piece, i) => ({
    ...piece,
    connections: [],
    curPos: {
      x: random(i) * (state.canvas.width - state.pieces[0].width),
      y: random(i + 123) * (state.canvas.height - state.pieces[0].height),
    },
  })),
});
