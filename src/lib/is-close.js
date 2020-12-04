import { isVertical, nw } from "./../utils/sides.js";

// is piece1 close to piece2
export const isClose = (p1, p2, state, side) => {
  const { attraction } = state.puzzle;

  const XY = isVertical(side) ? "y" : "x";
  const invXY = XY === "x" ? "y" : "x";

  const positive = nw(side) ? false : true;

  const size = p1[XY === "y" ? "height" : "width"];
  const offset = positive ? p2.curPos[XY] + size : p2.curPos[XY] - size;

  return (
    p1.curPos[XY] <= offset + attraction &&
    p1.curPos[XY] >= offset - attraction &&
    p1.curPos[invXY] <= p2.curPos[invXY] + attraction &&
    p1.curPos[invXY] >= p2.curPos[invXY] - attraction
  );
};
