export const makeCanvas = element => {
  const DPI = window.devicePixelRatio
  const canvas =
    element.tagName === 'CANVAS' ? element : document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const { height, width } = getComputedStyle(element)

  canvas.width = parseInt(width, 0) * DPI
  canvas.height = parseInt(height, 0) * DPI
  canvas.style.width = parseInt(width, 0) + 'px'
  canvas.style.height = parseInt(height, 0) + 'px'

  if (element.tagName !== 'CANVAS') {
    element.appendChild(canvas)
  }

  return {
    element: canvas,
    ctx,
    width: canvas.width,
    height: canvas.height,
    DPI,
  }
}
