import { pipe } from './utils/pipe.js'
import { tap } from './utils/tap.js'
import { event } from './utils/event-listeners.js'

import { makeCanvas } from './lib/canvas/make-canvas.js'
import { loadImage } from './lib/canvas/load-image.js'
import { makePuzzle } from './lib/core/make-puzzle.js'
import { makePieces } from './lib/core/make-pieces.js'
import { shuffle } from './lib/core/shuffle.js'
import { paint } from './lib/canvas/paint.js'
import { activate } from './lib/core/activate.js'
import { deactivate } from './lib/core/deactivate.js'
import { move } from './lib/core/move.js'
import { snap } from './lib/core/snap.js'
import { status } from './lib/core/status.js'
import { gather } from './lib/core/gather.js'
import { clone } from './lib/core/clone.js'
import { getCursor, setCursor } from './lib/canvas/cursor.js'
import './utils/safariDrawImageFix.js'
import pan from './utils/pan.js'
import { clearCanvas } from './lib/canvas/clear-canvas.js'

export const puzzle = async ({
  element,
  restore = {},
  image: img = '',
  pieces: ps = { x: 6, y: 4 },
  attraction = 20,
  size = 0.8,
  draggable = false,
  aligned = false,
  onComplete = () => {},
  onChange: changecb = () => {},
}) => {
  // game board
  const container =
    typeof element === 'string' ? document.querySelector(element) : element

  if (!container) {
    console.warn(`Couldn't find element: ${element}`)
    return
  }

  // initial setup ---------------------------------------------
  const canvas = makeCanvas(container)

  const image = restore.image || (await loadImage(img))
  const puzzle = () =>
    restore.puzzle ||
    makePuzzle(
      ps,
      image,
      attraction,
      container,
      size,
      draggable,
      aligned,
      onComplete
    )
  const pieces = restore.pieces || makePieces(puzzle())

  // passed on-change callback ---------------------------------
  const onChange = typeof changecb === 'function' && tap(pipe(clone, changecb))

  // initial state ---------------------------------------------
  const initState = () => ({
    scale: 1,
    position: { x: 0, y: 0 },
    image,
    canvas,
    pieces,
    puzzle: puzzle(),
  })

  // 'global' game state ---------------------------------------
  let state = initState()

  pan(canvas.element)

  canvas.element.addEventListener('pan', e => {
    e.preventDefault()
    const {
      detail: { scale, position },
    } = e

    state.scale = scale
    state.position = position

    clearCanvas(state)
    canvas.ctx.setTransform(scale, 0, 0, scale, position.x, position.y)
    paint(state)
  })

  // initial paint ---------------------------------------------
  state = restore.puzzle ? pipe(paint)(state) : pipe(shuffle, paint)(state)

  // user interactions -----------------------------------------
  const eventListeners = [
    event(window).resize(e => (state = pipe(gather, paint)(state))),
    event(state.canvas).mousedown(
      e =>
        (state = pipe(
          activate(e),
          getCursor(e),
          setCursor,
          clearCanvas,
          paint
        )(state))
    ),
    event(state.canvas).mousemove(e => {
      state = pipe(getCursor(e), move(e), clearCanvas, paint, setCursor)(state)
    }),
    event(document.body).mouseup(
      e =>
        (state = pipe(
          snap,
          deactivate,
          getCursor(e),
          clearCanvas,
          paint,
          setCursor,
          onChange,
          status
        )(state))
    ),
  ]

  // exposed api -----------------------------------------------
  return {
    newGame: () => (state = pipe(shuffle, paint)(initState())),
    getState: () => clone(state),
    setState: newState => (state = pipe(clone, paint)(newState)),
    update: () => (state = pipe(paint)(state)),
    destroy: () => {
      if (element.tagName !== 'CANVAS') {
        state.canvas.element.remove()
      }

      state = null
      eventListeners.map(listener => listener.remove())
    },
  }
}
