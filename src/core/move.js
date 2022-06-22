import { getTransformedPosition } from '../utils/pan.js'

export const move =
  ({ x, y }) =>
  puzzle => {
    const [xpos, ypos] = getTransformedPosition({ x, y })

    return {
      ...puzzle,
      pieces:
        puzzle.status === 'idle'
          ? puzzle.pieces
          : puzzle.pieces.map(piece => ({
              ...piece,
              pos: piece.active
                ? {
                    x: xpos - piece.active.x,
                    y: ypos - piece.active.y,
                  }
                : piece.pos,
            })),
    }
  }