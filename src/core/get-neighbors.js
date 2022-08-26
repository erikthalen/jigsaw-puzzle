// calculates which pieces are next to given piece
// breaks if rows/cols are 1
export const getNeighbors = (i, rows, cols) => {
  const slot = i + 1

  const neighbors = {
    top: slot > cols ? i - cols : undefined,
    right: slot % cols !== 0 ? i + 1 : undefined,
    bottom: slot <= (rows - 1) * cols ? i + cols : undefined,
    left: slot % cols !== (cols > 1 ? 1 : 0) ? i - 1 : undefined,
  }

  return JSON.parse(JSON.stringify(neighbors))
}
