import { removeNull } from './object-helpers.js'

// calculates which pieces are next to given piece
// breaks if rows/cols are 1
export const getNeighbors = (i, rows, cols) => {
  const slot = i + 1

  const neighbors = {
    top: slot > cols ? i - cols : null,
    right: slot % cols !== 0 ? i + 1 : null,
    bottom: slot <= (rows - 1) * cols ? i + cols : null,
    left: slot % cols !== 1 ? i - 1 : null,
  }

  return removeNull(neighbors)
}
