import { random } from './../../utils/random.js'
import { shuffleArray } from './../../utils/shuffleArray.js'

export const shuffle = state => ({
  ...state,
  pieces: state.puzzle.aligned
    ? shuffleArray(state.pieces).map((piece, i) => ({
        ...piece,
        connections: [],
        curPos: {
          x: (i % state.puzzle.cols) * state.pieces[0].width * 1.5,
          y: Math.floor(i / state.puzzle.cols) * state.pieces[0].height * 1.5,
        },
      }))
    : state.pieces.map((piece, i) => ({
        ...piece,
        connections: [],
        curPos: {
          x: random() * (state.canvas.width - state.pieces[0].width),
          y: random() * (state.canvas.height - state.pieces[0].height),
        },
      })),
})
