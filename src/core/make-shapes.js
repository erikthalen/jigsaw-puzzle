import { allSides } from '../utils/sides.js'
import { random } from '../utils/utils.js'

const oppositeOf = x => (x === 'out' ? 'in' : 'out')
const order = ['top', 'right', 'bottom', 'left']
const clockwise = (a, b) => (order.indexOf(a[0]) > order.indexOf(b[0]) ? 1 : -1)

export const makeShapes = (acc, piece) => {
  const neighborShape = (id, side) =>
    acc.find(piece => piece.id === id)?.sides[
      {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[side]
    ]

  const flatSides = ({ neighbors }) =>
    allSides
      .filter(side => !Object.keys(neighbors).includes(side))
      .reduce((acc, side) => ({ [side]: 'flat', ...acc }), {})

  const shapedSides = ({ neighbors }) =>
    Object.keys(neighbors).reduce((acc, side) => {
      const neighbor = neighborShape(neighbors[side], side)
      return {
        [side]: neighbor
          ? oppositeOf(neighbor)
          : random() >= 0.5
          ? 'out'
          : 'in',
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
