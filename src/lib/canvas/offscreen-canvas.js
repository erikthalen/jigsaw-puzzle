import { makeCanvas } from './make-canvas.js'

export const offscreenCanvas = state => {
  const canvas = makeCanvas(document.body.querySelector('#app2'))
  return canvas
}
