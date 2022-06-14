import { tap } from "../../utils/tap"

export const clearCanvas = tap((state) => {
  state.canvas.ctx.save()
  state.canvas.ctx.setTransform(1, 0, 0, 1, 0, 0)
  state.canvas.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height)
  state.canvas.ctx.restore()
})
