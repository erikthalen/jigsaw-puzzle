export function resizeImage(img, scale) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  canvas.width = img.width * scale
  canvas.height = img.height * scale

  context.drawImage(
    img,
    0,
    0,
    img.width * scale,
    img.height * scale
  )

  const dataUrl = canvas.toDataURL()
  const image = document.createElement('img')
  image.src = dataUrl

  return image
}
