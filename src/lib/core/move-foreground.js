import { tap } from './../../utils/tap.js'

export const moveForeground = ({ clientX, clientY }) =>
  tap(state => {
    state.canvas.foreground.pos = {
      x:
        (clientX - state.canvas.pos.x) * state.canvas.DPI -
        state.canvas.foreground.pos.x,
      y:
        (clientY - state.canvas.pos.y) * state.canvas.DPI -
        state.canvas.foreground.pos.y,
    }
  })
