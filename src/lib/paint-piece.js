import { allSides } from "./../utils/sides.js";

export const paintPiece = (state) => (piece) => {
  const { image } = state.image;
  const { ctx, DPI } = state.canvas;
  const { scale, occupy } = state.puzzle;
  const shapeOffset = Math.max(piece.width, piece.height);

  ctx.save();
  ctx.beginPath();
  ctx.translate(piece.curPos.x, piece.curPos.y + piece.height);

  allSides.forEach((side) => {
    drawSide(ctx, piece.shapes[side], {
      x: side === "top" || side === "bottom" ? -piece.height : -piece.width,
      y: side === "top" || side === "bottom" ? piece.width : piece.height,
    });
  });

  ctx.closePath();
  ctx.clip();

  ctx.drawImage(
    image, // image
    (piece.orgPos.x - shapeOffset) / scale / DPI / occupy, // what part of image
    (piece.orgPos.y - shapeOffset) / scale / DPI / occupy, // what part of image
    (piece.width + shapeOffset * 2) / scale / DPI / occupy, // how much of image
    (piece.height + shapeOffset * 2) / scale / DPI / occupy, // how much of image
    piece.curPos.x / state.canvas.width - shapeOffset, // where on canvas
    piece.curPos.y / state.canvas.height - shapeOffset - piece.height, // where on canvas
    piece.width + shapeOffset * 2, // how big on canvas
    piece.height + shapeOffset * 2 // how big on canvas
  );

  ctx.restore();

  const highlight = !state.puzzle.done && (piece.active || piece.alsoActive);

  ctx.shadowColor = highlight
    ? "rgba(100, 100, 100, 1)"
    : "rgba(50, 50, 50, 1)";
  ctx.strokeStyle = highlight
    ? "rgba(225, 225, 225, 1)"
    : "rgba(220, 220, 220, 1)";
  ctx.shadowBlur = highlight ? 2 : 1;
  ctx.lineWidth = highlight ? 2 : 1;

  ctx.shadowOffsetX = ctx.shadowOffsetY = -1;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.stroke();

  return piece;
};

function drawSide(ctx, side, size) {
  ctx.translate(0, size.x);

  if (side === "flat") {
    ctx.lineTo(size.y, 0);
  } else {
    side.forEach((b) => {
      ctx.bezierCurveTo(b.cx1, b.cy1, b.cx2, b.cy2, b.ex, b.ey);
    });
  }

  ctx.rotate(Math.PI / 2);
}
