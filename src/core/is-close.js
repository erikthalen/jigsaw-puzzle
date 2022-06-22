import { isVertical } from './../utils/sides.js'

const nw = side => side === 'top' || side === 'left'

// is piece1 close to piece2
export const isClose = (p1, p2, puzzle, side) => {
  const { attraction, width, height, size } = puzzle
  const snapArea = (Math.max(puzzle.width, puzzle.height) * attraction) / 100

  const XY = isVertical(side) ? 'y' : 'x'
  const invXY = XY === 'x' ? 'y' : 'x'

  const positive = nw(side) ? false : true

  const siz = XY === 'y' ? height / size.y : width / size.x
  const offset = positive ? p2.pos[XY] + siz : p2.pos[XY] - siz

  return (
    p1.pos[XY] <= offset + snapArea &&
    p1.pos[XY] >= offset - snapArea &&
    p1.pos[invXY] <= p2.pos[invXY] + snapArea &&
    p1.pos[invXY] >= p2.pos[invXY] - snapArea
  )
}
