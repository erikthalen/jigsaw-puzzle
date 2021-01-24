export const updCanvas = state => {
  const { top, left } = state.canvas.element.getBoundingClientRect()
  // const { width, height } = getComputedStyle(state.canvas.element);
  state.canvas.pos = { x: left, y: top }
  // state.canvas.width = parseInt(width, 0);
  // state.canvas.height = parseInt(height, 0);

  return state
}

export const makeCanvas = element => {
  const DPI = window.devicePixelRatio
  const canvas =
    element.tagName === 'CANVAS' ? element : document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const bg = document.createElement('canvas')
  const fg = document.createElement('canvas')

  const { height, width } = getComputedStyle(element)

  canvas.width = bg.width = fg.width = parseInt(width, 0) * DPI
  canvas.height = bg.height = fg.height = parseInt(height, 0) * DPI
  canvas.style.width = bg.style.width = fg.style.width =
    parseInt(width, 0) + 'px'
  canvas.style.height = bg.style.height = fg.style.height =
    parseInt(height, 0) + 'px'

  if (element.tagName !== 'CANVAS') {
    element.appendChild(canvas)
  }
  // element.appendChild(bg)
  // element.appendChild(fg)

  const { top, left } = canvas.getBoundingClientRect()

  return {
    element: canvas,
    background: { canvas: bg, ctx: bg.getContext('2d') },
    foreground: {
      canvas: fg,
      ctx: fg.getContext('2d'),
      pos: { x: null, y: null },
    },
    ctx,
    pos: { x: left, y: top },
    width: canvas.width,
    height: canvas.height,
    DPI,
  }
}
