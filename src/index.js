import { pipe, tap } from './utils/utils.js'
import { event } from './utils/event-listeners.js'

import { makePieces } from './lib/core/make-pieces.js'
import { shuffle } from './lib/core/shuffle.js'
import { activate, deactivate } from './lib/core/activate.js'
import { move } from './lib/core/move.js'
import { snap } from './lib/core/snap.js'
import { status } from './lib/core/status.js'
import { clone } from './utils/clone.js'
import { setStatus } from './lib/core/set-status.js'
import './utils/safariDrawImageFix.js'
import pan from './utils/pan.js'
import {
  clearCanvas,
  makeCanvas,
  loadImage,
  paint,
  resize,
  setCursor,
  paintPiece,
} from './lib/canvas.js'

// const testCanvas = document.querySelector('.test-canvas')
// const testCtx = testCanvas.getContext('2d')

// const createPrintLayers = puzzle =>
//   tap(ui => {
//     const { active, nonActive } = puzzle.pieces.reduce(
//       (acc, piece) => {
//         acc[piece.active ? 'active' : 'nonActive'].push(piece)

//         return acc
//       },
//       { active: [], nonActive: [] }
//     )

//     active.forEach(paintPiece(puzzle, { ...ui, ...ui.layers.active }))
//     nonActive.forEach(paintPiece(puzzle, { ...ui, ...ui.layers.nonActive }))

//     console.log('active')
//   })

export const puzzle = async ({
  element,
  image: img = '',
  pieces = { x: 6, y: 4 },
  attraction = 5,
  aligned = false,
  zoom: initZoom,
  onComplete = () => {},
  onChange = () => {},
}) => {
  const container =
    typeof element === 'string' ? document.querySelector(element) : element

  if (!container) {
    console.warn(`Couldn't find element: ${element}`)
    return
  }

  const { canvas, ctx } = makeCanvas(container)
  const { image, width, height } = await loadImage(img)

  const initUI = {
    zoom: 1,
    position: { x: 0, y: 0 },
    canvas,
    ctx,
    image,
    // layers: {
    //   active: makeCanvas(),
    //   nonActive: makeCanvas(),
    // },
  }

  const initPuzzle = {
    url: img,
    moves: 0,
    status: 'idle',
    done: false,
    startTime: Date.now(),
    attraction,
    width,
    height,
    size: { x: pieces.x, y: pieces.y },
    pieces: makePieces(image, pieces),
  }

  let state = {}

  state.puzzle = pipe(shuffle(aligned))(initPuzzle)
  state.ui = paint(state.puzzle)(initUI)

  const { zoom } = pan(canvas, {
    initScale:
      initZoom ||
      Math.min(
        window.innerWidth / state.puzzle.width,
        window.innerHeight / state.puzzle.height
      ),
  })

  // createPrintLayers(state.puzzle)(state.ui)

  const updateUI = () => {
    state.ui = pipe(
      clearCanvas,
      paint(state.puzzle),
      setCursor(state.puzzle)
    )(state.ui)
  }

  canvas.addEventListener('pan', e => {
    e.preventDefault()
    const {
      detail: { scale, position },
    } = e

    state.ui.zoom = scale
    state.ui.position = position

    state.ui.ctx.setTransform(scale, 0, 0, scale, position.x, position.y)
    // state.ui.layers.active.ctx.setTransform(scale, 0, 0, scale, position.x, position.y)
    // state.ui.layers.nonActive.ctx.setTransform(scale, 0, 0, scale, position.x, position.y)
    updateUI()
  })

  // user interactions -----------------------------------------
  const eventListeners = [
    event(window).resize(() => {
      resize(state.ui.canvas)
      ctx.setTransform(
        state.ui.zoom,
        0,
        0,
        state.ui.zoom,
        state.ui.position.x,
        state.ui.position.y
      )

      updateUI()
    }),

    event(state.ui.canvas).pointerdown(e => {
      state.puzzle = pipe(
        activate({ x: e.offsetX, y: e.offsetY }),
        setStatus({ x: e.offsetX, y: e.offsetY })
      )(state.puzzle)

      // state.ui = pipe(createPrintLayers(state.puzzle))(state.ui)

      updateUI()
    }),

    event(state.ui.canvas).pointermove(e => {
      state.puzzle = pipe(
        move({ x: e.offsetX, y: e.offsetY }),
        setStatus({ x: e.offsetX, y: e.offsetY })
      )(state.puzzle)

      updateUI()
    }),

    event(document.body).pointerup(e => {
      state.puzzle = pipe(
        snap,
        deactivate,
        status,
        setStatus({ x: e.offsetX, y: e.offsetY })
      )(state.puzzle)

      updateUI()

      onChange({ ui: state.ui, puzzle: clone(state.puzzle) })

      if (state.puzzle.done) onComplete(state)
    }),
  ]

  return {
    newGame: () => {
      state.puzzle = pipe(shuffle(aligned))(initPuzzle)
      updateUI()
    },
    getState: () => ({ ui: state.ui, puzzle: clone(state.puzzle) }),
    setState: newState => {
      state.puzzle = pipe(shuffle(aligned))(newState.puzzle)
      updateUI()
    },
    destroy: () => {
      if (element.tagName !== 'CANVAS') {
        state.ui.canvas.remove()
      }

      state = null
      eventListeners.map(listener => listener.remove())
    },
    setZoom: zoom,
    getZoom: () => state.ui.zoom,
  }
}
