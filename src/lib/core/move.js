import { getTransformedPosition } from '../../utils/pan.js'

export const move =
  ({ offsetX, offsetY }) =>
  state => {
    const [x, y] = getTransformedPosition(
      { x: offsetX, y: offsetY },
      state.canvas.DPI
    )

    return {
      ...state,
      pieces: state.pieces.map(piece => ({
        ...piece,
        curPos: piece.active
          ? {
              x: x - piece.active.x,
              y: y - piece.active.y,
            }
          : piece.curPos,
      })),
    }
  }
