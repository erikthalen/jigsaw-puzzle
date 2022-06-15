import { getTransformedPosition } from '../../utils/pan.js'

export const move =
  ({ offsetX, offsetY }) =>
  state => {
    const [x, y] = getTransformedPosition({ x: offsetX, y: offsetY })

    return {
      ...state,
      puzzle: {
        ...state.puzzle,
        pieces: state.puzzle.pieces.map(piece => ({
          ...piece,
          pos: piece.active
            ? {
                x: x - piece.active.x,
                y: y - piece.active.y,
              }
            : piece.pos,
        })),
      },
    }
  }
