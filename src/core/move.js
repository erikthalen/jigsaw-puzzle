export const move =
  ({ x, y }) =>
  puzzle => {
    return {
      ...puzzle,
      pieces:
        puzzle.status === 'idle'
          ? puzzle.pieces
          : puzzle.pieces.map(piece => ({
              ...piece,
              pos: piece.active
                ? {
                    x: x - piece.active.x,
                    y: y - piece.active.y,
                  }
                : piece.pos,
            })),
    }
  }
