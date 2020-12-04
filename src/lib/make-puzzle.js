export const makePuzzle = (
  ps,
  img,
  attraction,
  container,
  size,
  draggable,
  onComplete
) => {
  const { width, height } = getComputedStyle(container);
  const isPortrait = img.width < img.height;
  const DPI = window.devicePixelRatio;
  const scale =
    parseInt([isPortrait ? height : width], 0) /
    img[isPortrait ? "height" : "width"];

  return {
    timeStamp: Date.now(),
    done: false,
    cols: ps.x,
    rows: ps.y,
    width: img.width * scale * DPI,
    height: img.height * scale * DPI,
    attraction,
    scale,
    occupy: size,
    draggable,
    onComplete,
  };
};
