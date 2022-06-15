import { isUnderCursor } from '../../utils/is-under-cursor.js'
import { tap } from '../../utils/utils.js'

export const getCursor = e =>
  tap(state => {
    const hovered = state.puzzle.pieces.find(piece =>
      isUnderCursor(piece, {
        x: e.offsetX,
        y: e.offsetY,
        width: state.puzzle.width / state.puzzle.size.x,
        height: state.puzzle.height / state.puzzle.size.y,
      })
    )
    const active = state.puzzle.pieces.find(piece => piece.active)
    const allActive = state.puzzle.pieces.every(piece => piece.active)

    if (active && !allActive) {
      state.ui.cursor = 'grabbing'
      return
    }

    if (hovered && !active) {
      state.ui.cursor = 'grab'
      return
    }

    state.ui.cursor = 'default'
  })

export const setCursor = tap(state => {
  state.ui.canvas.style.cursor = state.ui.cursor
})
