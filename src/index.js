import { pipe, tap } from './utils/utils.js'
import { makePieces } from './core/make-pieces.js'
import { shuffle } from './core/shuffle.js'
import { activate, deactivate } from './core/activate.js'
import { move } from './core/move.js'
import { snap } from './core/snap.js'
import { status } from './core/status.js'
import { clone } from './utils/clone.js'
import { setStatus } from './core/set-status.js'
import './utils/safariDrawImageFix.js'
import pan from './utils/pan.js'
import { makeCanvas, loadImage, paint, resize, setCursor } from './canvas.js'

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
    useCache: false,
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

  const { zoom, restore } = pan(canvas, {
    initScale:
      initZoom ||
      Math.min(
        window.innerWidth / state.puzzle.width,
        window.innerHeight / state.puzzle.height
      ),
  })

  // createPrintLayers(state.puzzle)(state.ui)

  const updateUI = () => {
    state.ui = pipe(paint(state.puzzle), setCursor(state.puzzle))(state.ui)

    // state.ui.useCache = puzzle.status !== 'active'
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

  const handlePointerdown = ({ offsetX: x, offsetY: y }) => {
    state.puzzle = pipe(activate({ x, y }), setStatus({ x, y }))(state.puzzle)
    updateUI()
  }

  const handleResize = () => {
    const { zoom, position } = state.ui
    resize(state.ui.canvas)
    ctx.setTransform(zoom, 0, 0, zoom, position.x, position.y)
    updateUI()
  }

  const handlePointermove = ({ offsetX: x, offsetY: y }) => {
    state.puzzle = pipe(move({ x, y }), setStatus({ x, y }))(state.puzzle)
    updateUI()
  }

  const handlePointerup = ({ offsetX: x, offsetY: y }) => {
    state.puzzle = pipe(
      snap,
      deactivate,
      status,
      setStatus({ x, y })
    )(state.puzzle)

    updateUI()

    onChange({ ui: state.ui, puzzle: clone(state.puzzle) })

    if (state.puzzle.done) onComplete(state)
  }

  state.ui.canvas.addEventListener('pointerdown', handlePointerdown)
  state.ui.canvas.addEventListener('pointermove', handlePointermove)
  state.ui.canvas.addEventListener('pointerup', handlePointerup)
  window.addEventListener('resize', handleResize)

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
    },
    setZoom: zoom,
    getZoom: () => state.ui.zoom,
    restorePan: restore,
  }
}
