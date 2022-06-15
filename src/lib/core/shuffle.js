import { random } from './../../utils/utils.js'
import { shuffleArray } from './../../utils/array-helpers'

export const shuffle =
  (aligned = false) =>
  state => ({
    ...state,
    puzzle: {
      ...state.puzzle,
      pieces: aligned
        ? shuffleArray(state.puzzle.pieces).map((piece, i) => ({
            ...piece,
            connections: [],
            pos: {
              x:
                (((i % state.puzzle.size.x) * state.puzzle.width) /
                  state.puzzle.size.x) *
                1.5,
              y:
                ((Math.floor(i / state.puzzle.size.x) * state.puzzle.height) /
                  state.puzzle.size.y) *
                1.5,
            },
          }))
        : state.puzzle.pieces.map((piece, i) => ({
            ...piece,
            connections: [],
            pos: {
              x: (random() * 2 - 0.5) * state.puzzle.width,
              y: (random() * 2 - 0.5) * state.puzzle.height,
            },
          })),
    },
  })
