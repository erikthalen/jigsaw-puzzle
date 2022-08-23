import { random } from './../utils/utils.js'
import { shuffleArray } from './../utils/array-helpers'

const randomBetween = (val) => {
  return Math.random() * (val - (val * -1)) + (val * -1)
}

export const shuffle =
  (aligned = false) =>
  puzzle => {
    console.log(
      puzzle.pieces.map((piece, i) => {
        return ((i % puzzle.size.x) / puzzle.size.x)
      })
    )
    return {
      ...puzzle,
      pieces: aligned
        ? shuffleArray(puzzle.pieces).map((piece, i) => ({
            ...piece,
            connections: [],
            pos: {
              x: ((i % puzzle.size.x) / puzzle.size.x) * 2 - 0.42 + randomBetween(0.07),
              y: (Math.floor(i / puzzle.size.x) / puzzle.size.y) * 2 - 0.42 + randomBetween(0.07),
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
    }
  }
