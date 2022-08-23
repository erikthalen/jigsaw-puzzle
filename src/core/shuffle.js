import { random } from './../utils/utils.js'
import { shuffleArray } from './../utils/array-helpers'

const randomBetween = (min, max) => {
  return Math.random() * max - min
}

export const shuffle =
  (aligned = false) =>
  puzzle => ({
    ...puzzle,
    pieces: aligned
      ? shuffleArray(puzzle.pieces).map((piece, i) => ({
          ...piece,
          connections: [],
          pos: {
            x:
              ((i % puzzle.size.x) / puzzle.size.x) * 2 +
              randomBetween(-1 / puzzle.size.x, 1 / puzzle.size.x) -
              0.52,
            y:
              (Math.floor(i / puzzle.size.x) / puzzle.size.y) * 2 +
              randomBetween(-1 / puzzle.size.y, 1 / puzzle.size.y) -
              0.52,
          },
        }))
      : puzzle.pieces.map(piece => ({
          ...piece,
          connections: [],
          pos: {
            x: random() * 2 - 0.5,
            y: random() * 2 - 0.5,
          },
        })),
  })
