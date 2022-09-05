export const rotatePoint = (center, degrees, ...args) => {
  const deg = (degrees * Math.PI) / 180
  const { sin, cos } = Math

  return args
    .map(([x, y]) => [
      (x - center.x) * cos(deg) - (y - center.y) * sin(deg) + center.x,
      (x - center.x) * sin(deg) + (y - center.y) * cos(deg) + center.y,
    ])
    .flat()
}

export const rotate = (bezier, angle) => {
  const [origin] = bezier[0]

  return bezier.map(part => {
    return rotatePoint({ x: origin[0], y: origin[1] }, angle, ...part)
  })
}

export const move = (curve, to) => {
  const res = curve.map(part => {
    return part.map(point => {
      return [point[0] + to.x, point[1] + to.y]
    })
  })
  return res
}

export const inverse = curve => {
  const res = curve.map(part => {
    return part.map(point => {
      return [point[0], point[1] * -1]
    })
  })
  return res
}

export const bezier = ({ knobsize = 1, length = 100 } = {}) => {
  const middle = length / 2

  return [
    // left shoulder
    [
      [0, 0],
      [middle - knobsize * 20, knobsize * 4],
      [middle - knobsize * 13, 0],
    ],

    // left neck
    [
      [middle - knobsize * 13, 0],
      [middle - knobsize * 10, knobsize * -2],
      [middle - knobsize * 12, knobsize * -5],
    ],

    // left head
    [
      [middle - knobsize * 12, knobsize * -5],
      [middle - knobsize * 30, knobsize * -30],
      [middle, knobsize * -30],
    ],

    // right head
    [
      [middle, knobsize * -30],
      [middle - knobsize * -30, knobsize * -30],
      [middle - knobsize * -12, knobsize * -5],
    ],

    // right neck
    [
      [middle - knobsize * -12, knobsize * -5],
      [middle - knobsize * -10, knobsize * -2],
      [middle - knobsize * -13, 0],
    ],

    // right shoulder
    [
      [middle - knobsize * -13, 0],
      [middle - knobsize * -20, knobsize * 4],
      [length, 0],
    ],
  ]
}
