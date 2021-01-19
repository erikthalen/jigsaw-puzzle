export const isWithinX = (state, piece, e) =>
  (e.clientX - state.canvas.pos.x) * state.canvas.DPI >= piece.curPos.x &&
  (e.clientX - state.canvas.pos.x) * state.canvas.DPI <=
    piece.curPos.x + piece.width

export const isWithinY = (state, piece, e) =>
  (e.clientY - state.canvas.pos.y) * state.canvas.DPI >= piece.curPos.y &&
  (e.clientY - state.canvas.pos.y) * state.canvas.DPI <=
    piece.curPos.y + piece.height

export const isUnderCursor = (state, piece, e) =>
  isWithinX(state, piece, e) && isWithinY(state, piece, e)
