import { allSides } from '../utils/sides.js'
import { random } from '../utils/utils.js'

const oppositeOf = ({ shape, size }) => {
  console.log(shape, size)
  return {
    shape: shape === 'out' ? 'in' : 'out',
    size: size,
  }
}

const order = ['top', 'right', 'bottom', 'left']
const clockwise = (a, b) => {
  return order.indexOf(a[0]) > order.indexOf(b[0]) ? 1 : -1
}

export const makeShapes = individualize => (acc, piece) => {
  const neighborShape = (id, side) => {
    const piece = acc.find(piece => piece.id === id)

    return piece?.sides[
      {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[side]
    ]
  }

  const flatSides = ({ neighbors }) =>
    allSides
      .filter(side => !Object.keys(neighbors).includes(side))
      .reduce(
        (acc, side) => ({ [side]: { shape: 'flat', size: 1 }, ...acc }),
        {}
      )

  const shapedSides = ({ neighbors }) =>
    Object.keys(neighbors).reduce((acc, side) => {
      const neighbor = neighborShape(neighbors[side], side)

      return {
        [side]: neighbor
          ? oppositeOf(neighbor)
          : random() >= 0.5
          ? { shape: 'out', size: individualize ? Math.random() : 1 }
          : { shape: 'in', size: individualize ? Math.random() : 1 },
        ...acc,
      }
    }, {})

  const sides = [
    ...Object.entries({
      ...shapedSides(piece),
      ...flatSides(piece),
    }),
  ]
    .sort(clockwise)
    .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {})

  return [{ ...piece, sides }, ...acc]
}
