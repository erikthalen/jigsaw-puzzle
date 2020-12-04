import { getNeighbors } from "./../utils/get-neighbors.js";
import { makeShapes } from "./make-shapes.js";

export const makePieces = (puzzle) => {
  const piecesAmount = [...Array(puzzle.rows * puzzle.cols)];
  const width = (puzzle.width / puzzle.cols) * puzzle.occupy;
  const height = (puzzle.height / puzzle.rows) * puzzle.occupy;
  const pieces = piecesAmount
    .map((x, i) => ({
      id: i,
      orgPos: {
        x: (i % puzzle.cols) * width,
        y: Math.floor(i / puzzle.cols) * height,
      },
      curPos: { x: 0, y: 0 },
      width,
      height,
      neighbors: getNeighbors(i, puzzle.rows, puzzle.cols),
      active: false, // if clicked/dragged
      connections: [], // every other piece this one is snapped together with
    }))
    .reduce(makeShapes, []);

  return pieces;
};
