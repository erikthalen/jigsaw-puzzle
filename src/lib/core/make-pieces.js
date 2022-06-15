import { getNeighbors } from './../../utils/get-neighbors.js'
import { makeShapes } from './make-shapes.js'

export const makePieces = (image, amount) => {
  const piecesAmount = [...Array(amount.y * amount.x)]
  const width = image.width / amount.x
  const height = image.height / amount.y
  const pieces = piecesAmount
    .map((_, i) => ({
      id: i,
      origin: {
        x: i % amount.x,
        y: Math.floor(i / amount.x),
      },
      pos: { x: 0, y: 0 },
      neighbors: getNeighbors(i, amount.y, amount.x),
      active: false, // if clicked/dragged
      connections: [], // every other piece this one is snapped together with
    }))
    .reduce(makeShapes(width, height), [])

  return pieces
}
