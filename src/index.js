import { pipe, tap } from './utils/utils.js'
import { event } from './utils/event-listeners.js'

import { makePieces } from './lib/core/make-pieces.js'
import { shuffle } from './lib/core/shuffle.js'
import { activate, deactivate } from './lib/core/activate.js'
import { move } from './lib/core/move.js'
import { snap } from './lib/core/snap.js'
import { status } from './lib/core/status.js'
import { clone } from './lib/core/clone.js'
import { getCursor, setCursor } from './lib/canvas/cursor.js'
import './utils/safariDrawImageFix.js'
import pan from './utils/pan.js'
import {
  clearCanvas,
  makeCanvas,
  loadImage,
  paint,
  resize,
} from './lib/canvas.js'

export const puzzle = async ({
  element,
  image: img = '',
  pieces = { x: 6, y: 4 },
  attraction = 5,
  aligned = false,
  onComplete = () => {},
  onChange: changecb = () => {},
}) => {
  const container =
    typeof element === 'string' ? document.querySelector(element) : element

  if (!container) {
    console.warn(`Couldn't find element: ${element}`)
    return
  }

  const { canvas, ctx } = makeCanvas(container)
  const { image, width, height } = await loadImage(img)

  const initState = () => ({
    ui: {
      zoom: 1,
      position: { x: 0, y: 0 },
      canvas,
      ctx,
      image,
      cursor: 'default',
    },
    puzzle: {
      done: false,
      startTime: Date.now(),
      attraction,
      width,
      height,
      size: { x: pieces.x, y: pieces.y },
      pieces: makePieces(image, pieces),
    },
  })

  let state = pipe(shuffle(aligned), paint)(initState())

  pan(canvas, {
    initScale: Math.min(
      window.innerWidth / state.puzzle.width,
      window.innerHeight / state.puzzle.height
    ),
  })

  canvas.addEventListener('pan', e => {
    e.preventDefault()
    const {
      detail: { scale, position },
    } = e

    state.ui.zoom = scale
    state.ui.position = position

    clearCanvas(state)
    ctx.setTransform(scale, 0, 0, scale, position.x, position.y)
    paint(state)
  })

  // passed on-change callback ---------------------------------
  const onChange =
    typeof changecb === 'function'
      ? tap(pipe(clone, changecb))
      : () => () => state

  // user interactions -----------------------------------------
  const eventListeners = [
    event(window).resize(() => {
      resize(state.ui.canvas)
      clearCanvas(state)
      ctx.setTransform(
        state.ui.zoom,
        0,
        0,
        state.ui.zoom,
        state.ui.position.x,
        state.ui.position.y
      )
      paint(state)
    }),
    event(state.ui.canvas).pointerdown(
      e =>
        (state = pipe(
          activate(e),
          getCursor(e),
          setCursor,
          clearCanvas,
          paint
        )(state))
    ),
    event(state.ui.canvas).pointermove(e => {
      state = pipe(getCursor(e), move(e), clearCanvas, paint, setCursor)(state)
    }),
    event(document.body).pointerup(
      e =>
        (state = pipe(
          snap,
          deactivate,
          getCursor(e),
          clearCanvas,
          paint,
          setCursor,
          onChange,
          status(onComplete),
          tap(() => {
            console.log(state)
          })
        )(state))
    ),
  ]

  return {
    newGame: () =>
      (state = pipe(shuffle(aligned), clearCanvas, paint)(initState())),
    getState: () => clone(state),
    setState: puzzle => {
      state.puzzle = puzzle
      state = pipe(clearCanvas, paint)(state)
    },
    destroy: () => {
      if (element.tagName !== 'CANVAS') {
        state.ui.canvas.remove()
      }

      state = null
      eventListeners.map(listener => listener.remove())
    },
  }
}
