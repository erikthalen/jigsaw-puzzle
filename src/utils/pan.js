const clamp = (val, min, max) => {
  return Math.max(min, Math.min(max, val))
}

let scale = 1
const position = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
}

const move = ({ x, y, bounding = { x: Infinity, y: Infinity } }) => {
  position.x = position.x + x
  position.y = position.y + y

  return { position, scale }
}

const zoom = ({ focal, zoom, max = 10000, min = 0.05 }) => {
  const atMax = scale === max || scale === min

  scale = clamp(scale * zoom, min, max)

  const at = {
    x: atMax ? position.x : focal.x,
    y: atMax ? position.y : focal.y,
  }

  position.x = at.x - (at.x - position.x) * zoom
  position.y = at.y - (at.y - position.y) * zoom

  return { position, scale }
}

export const restore = canvas => {
  const ctx = canvas.getContext('2d')
  clear(ctx)
  ctx.setTransform(1, 0, 0, 1, 0, 0)
}

function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  )
}

export default (
  canvas,
  { dpi = window.devicePixelRatio, bounding = null, initScale = 1 } = {}
) => {
  canvas.style.touchAction = 'none'
  canvas.style.userSelect = 'none'
  canvas.style.webkitUserSelect = 'none'
  canvas.style.overscrollBehaviour = 'contain'

  let fingers = {}
  let lastDistance = null
  scale = initScale

  const dispatch = detail => {
    canvas.dispatchEvent(
      new CustomEvent('pan', {
        detail,
        bubbles: true,
        cancelable: true,
        composed: false,
      })
    )
  }

  setTimeout(() => dispatch({ scale, position }))

  const handlePointerdown = e => {
    e.preventDefault()

    fingers[e.pointerId] = {
      x: e.offsetX,
      y: e.offsetY,
      deltaX: 0,
      deltaY: 0,
    }

    canvas.addEventListener('pointerleave', handlePointerup, { once: true })
  }

  const handlePointermove = e => {
    e.preventDefault()

    if (!fingers[e.pointerId]) return
    if (Object.keys(fingers).length !== 2) return

    fingers[e.pointerId] = {
      x: e.offsetX,
      y: e.offsetY,
      deltaX: e.offsetX - fingers[e.pointerId].x,
      deltaY: e.offsetY - fingers[e.pointerId].y,
    }

    const fingersArray = Object.values(fingers)

    const distance = Math.sqrt(
      Math.pow(fingersArray[1].x - fingersArray[0].x, 2) +
        Math.pow(fingersArray[1].y - fingersArray[0].y, 2)
    )

    const { position } = move({
      x: fingers[e.pointerId].deltaX * dpi * 0.7,
      y: fingers[e.pointerId].deltaY * dpi * 0.7,
    })

    const { scale } = zoom({
      focal: { x: e.offsetX * dpi, y: e.offsetY * dpi },
      zoom: !lastDistance ? 1 : 1 + (distance - lastDistance) / 200,
    })

    lastDistance = distance

    dispatch({ scale, position })
  }

  const handlePointerup = e => {
    e.preventDefault()
    delete fingers[e.pointerId]
    lastDistance = null
  }

  if (isTouchDevice()) {
    canvas.addEventListener('pointerdown', handlePointerdown)
    canvas.addEventListener('pointermove', handlePointermove)
    canvas.addEventListener('pointerup', handlePointerup)
    canvas.addEventListener('pointercancel', handlePointerup)
  } else {
    canvas.addEventListener('wheel', e => {
      e.preventDefault()

      if (e.ctrlKey) {
        dispatch(
          zoom({
            focal: { x: e.offsetX * dpi, y: e.offsetY * dpi },
            zoom: 1 - e.deltaY / 100,
          })
        )
      } else {
        dispatch(move({ x: -e.deltaX, y: -e.deltaY }))
      }
    })
  }

  return {
    zoom: newScale => {
      zoom({
        focal: {
          x: (window.innerWidth / 2) * dpi,
          y: (window.innerHeight / 2) * dpi,
        },
        zoom: newScale,
      })

      dispatch({ scale, position })
    },
  }
}

export const getTransformedPosition = (
  { x, y },
  dpi = window.devicePixelRatio
) => {
  return [(x * dpi - position.x) / scale, (y * dpi - position.y) / scale]
}
