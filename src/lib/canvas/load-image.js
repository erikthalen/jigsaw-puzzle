export const loadImage = (src) =>
  new Promise((resolve) => {
    var image = new Image();
    image.onload = () =>
      resolve({ image, width: image.width, height: image.height });

    image.src = src;
  });
