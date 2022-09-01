// export const bezier = (length = 100, { knobsize = 1 }) => {
//   const middle = length / 2

//   return [
//     {
//       cx1: 0,
//       cy1: 0,
//       cx2: middle - knobsize * 20,
//       cy2: knobsize * 4,
//       ex: middle - knobsize * 13,
//       ey: knobsize * 0,
//     }, // left shoulder
//     {
//       cx1: middle - knobsize * 13,
//       cy1: knobsize * 0,
//       cx2: middle - knobsize * 10,
//       cy2: knobsize * -2,
//       ex: middle - knobsize * 12,
//       ey: knobsize * -5,
//     }, // left neck
//     {
//       cx1: middle - knobsize * 12,
//       cy1: knobsize * -5,
//       cx2: middle - knobsize * 30,
//       cy2: knobsize * -30,
//       ex: middle,
//       ey: knobsize * -30,
//     }, // left head
//     {
//       cx1: middle,
//       cy1: knobsize * -30,
//       cx2: middle - knobsize * -30,
//       cy2: knobsize * -31,
//       ex: middle - knobsize * -12,
//       ey: knobsize * -5,
//     }, // right head
//     {
//       cx1: middle - knobsize * -12,
//       cy1: knobsize * -5,
//       cx2: middle - knobsize * -10,
//       cy2: knobsize * -2,
//       ex: middle - knobsize * -13,
//       ey: knobsize * 0,
//     }, // right neck
//     {
//       cx1: middle - knobsize * -13,
//       cy1: knobsize * 0,
//       cx2: middle - knobsize * -20,
//       cy2: knobsize * 4,
//       ex: length,
//       ey: knobsize * 0,
//     }, // right shoulder
//   ]
// }

// export const bezierInv = (b, y = 1) =>
//   b.map(bb => ({
//     cx1: bb.cx1 * y,
//     cy1: bb.cy1 * -1,
//     cx2: bb.cx2 * y,
//     cy2: bb.cy2 * -1,
//     ex: bb.ex * y,
//     ey: bb.ey * -1,
//   }))

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
      [middle - knobsize * -30, knobsize * -31],
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

export const bezierInv = (curve, y = 1) => {
  const res = curve.map(part => {
    return part.map(point => {
      // console.log('inv', point)
      return [point[0] * y, point[1] * -1]
    })
  })
  return res
}
