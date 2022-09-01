import { bezier, bezierInv, rotate, move, rotatePoint } from './bezier'

export const createPiece = ({ size, shapes, knobsize }) => {
  const path = new Path2D()

  if (!shapes.length === 4) {
    console.log('a piece needs to have 4 sides')
    return
  }

  const angles = [0, 90, 180, 270]
  const corners = [
    { x: 0, y: 0 },
    { x: size.x, y: 0 },
    { x: size.x, y: size.y },
    { x: 0, y: size.y },
  ]

  corners.forEach((corner, idx) => {
    const length = idx % 2 === 1 ? size.y : size.x
    const shape = shapes[idx]

    if (shape === 'flat') {
      const end = rotatePoint(corner, angles[idx], [
        corner.x + length,
        corner.y,
      ])

      path.lineTo(...end)
    } else {
      const bez = bezier({
        length,
        knobsize,
      })

      const curve =
        shape === 'in'
          ? rotate(move(bezierInv(bez), corner), angles[idx])
          : rotate(move(bez, corner), angles[idx])

      curve.forEach(p => path.bezierCurveTo(...p.flat()))
    }
  })

  path.closePath()

  return path
}

export const createPieces = (width, height, arr) => {
  return arr.reduce((acc, cur) => {
    return {
      ...acc,
      [cur.id]: createPiece({
        size: {
          x: width,
          y: height,
        },
        shapes: Object.values(cur.sides),
        knobsize: Math.min(width, height) / 110,
      }),
    }
  }, {})
}
