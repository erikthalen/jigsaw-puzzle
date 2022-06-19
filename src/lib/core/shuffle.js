import { random } from './../../utils/utils.js'
import { shuffleArray } from './../../utils/array-helpers'

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
              (((i % puzzle.size.x) * puzzle.width) / puzzle.size.x) * 2 +
              randomBetween(
                -puzzle.width / puzzle.size.x,
                puzzle.width / puzzle.size.x
              ) - puzzle.width / 1.5,
            y:
              ((Math.floor(i / puzzle.size.x) * puzzle.height) /
                puzzle.size.y) *
                2 +
              randomBetween(
                -puzzle.height / puzzle.size.y,
                puzzle.height / puzzle.size.y
              ) - puzzle.height / 1.5,
          },
        }))
      : puzzle.pieces.map((piece, i) => ({
          ...piece,
          connections: [],
          pos: {
            x: (random() * 2 - 0.5) * puzzle.width,
            y: (random() * 2 - 0.5) * puzzle.height,
          },
        })),
  })
