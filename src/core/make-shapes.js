import { allSides, isVertical } from '../utils/sides.js'
import { bezier, bezierInv } from '../utils/bezier.js'
import { random } from '../utils/utils.js'

export const opposite = side =>
  ({
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[side])

export const makeShapes = (width, height) => (acc, piece) => {
  const getNeighbor = id => acc.find(piece => piece.id === id)
  const neighborShape = (id, side) =>
    getNeighbor(id)?.shapes && getNeighbor(id).shapes[opposite(side)]

  // 'flat' if no neighbor
  const flatSides = ({ neighbors }) =>
    allSides
      .filter(side => !Object.keys(neighbors).includes(side))
      .reduce((acc, side) => ({ [side]: 'flat', ...acc }), {})

  // a random- or an inverse bezier if the neighbor has a shape
  const shapedSides = ({ neighbors }, width, height) =>
    Object.keys(neighbors).reduce(
      (acc, side) => ({
        [side]: neighborShape(neighbors[side], side) // neighbor has shape
          ? bezierInv(neighborShape(neighbors[side], side)) // mirror that shape
          : random() >= 0.5 // else 50/50
          ? bezier(isVertical(side) ? width : height, Math.min(width, height)) // be 'outy'
          : bezierInv(
              bezier(isVertical(side) ? width : height, Math.min(width, height))
            ), // or 'inny
        ...acc,
      }),
      {}
    )

  const shapes = {
    ...shapedSides(piece, width, height),
    ...flatSides(piece),
  }

  return [{ ...piece, shapes }, ...acc]
}
