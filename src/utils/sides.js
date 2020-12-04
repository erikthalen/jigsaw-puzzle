export const allSides = ["top", "right", "bottom", "left"];
export const opposite = (side) =>
  ({
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  }[side]);

export const isVertical = (side) => side === "top" || side === "bottom";
export const isHorizontal = (side) => !isVertical(side);

export const sw = (side) => side === "bottom" || side === "left";
export const nw = (side) => side === "top" || side === "left";
