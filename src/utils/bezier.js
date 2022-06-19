export const bezier = (pieceSize = 100, knobSize = 100 /* knobPos = 20 */) => {
  const scale = knobSize / 110;
  const middle = pieceSize / 2;

  return [
    {
      cx1: 0,
      cy1: 0,
      cx2: middle - scale * 20,
      cy2: scale * 4,
      ex: middle - scale * 13,
      ey: scale * 0,
    }, // left shoulder
    {
      cx1: middle - scale * 13,
      cy1: scale * 0,
      cx2: middle - scale * 10,
      cy2: scale * -2,
      ex: middle - scale * 12,
      ey: scale * -5,
    }, // left neck
    {
      cx1: middle - scale * 12,
      cy1: scale * -5,
      cx2: middle - scale * 30,
      cy2: scale * -30,
      ex: middle,
      ey: scale * -30,
    }, // left head
    {
      cx1: middle,
      cy1: scale * -30,
      cx2: middle - scale * -30,
      cy2: scale * -31,
      ex: middle - scale * -12,
      ey: scale * -5,
    }, // right head
    {
      cx1: middle - scale * -12,
      cy1: scale * -5,
      cx2: middle - scale * -10,
      cy2: scale * -2,
      ex: middle - scale * -13,
      ey: scale * 0,
    }, // right neck
    {
      cx1: middle - scale * -13,
      cy1: scale * 0,
      cx2: middle - scale * -20,
      cy2: scale * 4,
      ex: pieceSize,
      ey: scale * 0,
    }, // right shoulder
  ];
};

export const bezierInv = (b, y = 1) =>
  b.map((bb, i) => ({
    cx1: bb.cx1 * y,
    cy1: bb.cy1 * -1,
    cx2: bb.cx2 * y,
    cy2: bb.cy2 * -1,
    ex: bb.ex * y,
    ey: bb.ey * -1,
  }));
