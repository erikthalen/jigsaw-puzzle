import { bezier, inverse, rotate, move, rotatePoint } from './bezier'

export const cutPiece = ({ size, shapes, knobsize }) => {
  const path = new Path2D()

  if (!shapes.length === 4) {
    console.log('a piece needs to have 4 sides')
    return
  }

  const corners = [
    { x: 0, y: 0, angle: 0 },
    { x: size.x, y: 0, angle: 90 },
    { x: size.x, y: size.y, angle: 180 },
    { x: 0, y: size.y, angle: 270 },
  ]

  corners.forEach((corner, idx) => {
    const length = idx % 2 === 1 ? size.y : size.x
    const shape = shapes[idx]

    if (shape === 'flat') {
      const end = rotatePoint(corner, corner.angle, [
        corner.x + length,
        corner.y,
      ])

      path.lineTo(...end)
    } else {
      const bez = bezier({
        length,
        knobsize: knobsize[idx],
      })

      const curve =
        shape === 'in'
          ? rotate(move(inverse(bez), corner), corner.angle)
          : rotate(move(bez, corner), corner.angle)

      curve.forEach(p => path.bezierCurveTo(...p.flat()))
    }
  })

  path.closePath()

  return path
}

export const cutPieces = (width, height, arr) => {
  return arr.reduce((acc, cur) => {
    const sides = Object.values(cur.sides)
    const shapes = sides.map(({ shape }) => shape)
    const knobsize = sides.map(
      ({ size }) => ((0.6 + size * 0.4) * Math.min(width, height)) / 110
    )
    return {
      ...acc,
      [cur.id]: cutPiece({
        size: {
          x: width,
          y: height,
        },
        shapes,
        knobsize,
      }),
    }
  }, {})
}
