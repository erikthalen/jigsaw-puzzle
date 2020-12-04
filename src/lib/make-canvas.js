export const updCanvas = (state) => {
  const { top, left } = state.canvas.element.getBoundingClientRect();
  // const { width, height } = getComputedStyle(state.canvas.element);
  state.canvas.pos = { x: left, y: top };
  // state.canvas.width = parseInt(width, 0);
  // state.canvas.height = parseInt(height, 0);

  return state;
};

export const makeCanvas = (element) => {
  const DPI = window.devicePixelRatio;
  const canvas =
    element.tagName === "CANVAS" ? element : document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const { height, width } = getComputedStyle(element);

  canvas.width = parseInt(width, 0) * DPI;
  canvas.height = parseInt(height, 0) * DPI;
  canvas.style.width = parseInt(width, 0) + "px";
  canvas.style.height = parseInt(height, 0) + "px";

  if (element.tagName !== "CANVAS") {
    element.appendChild(canvas);
  }

  const { top, left } = canvas.getBoundingClientRect();

  return {
    element: canvas,
    ctx,
    pos: { x: left, y: top },
    width: canvas.width,
    height: canvas.height,
    DPI,
  };
};
