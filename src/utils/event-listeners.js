const addListener = (what, el, cb) => {
  const name = cb
  el.addEventListener(what, cb)
  return {
    remove: () => el.removeEventListener(what, name),
  }
}

export const event = canvas => ({
  scroll: cb => addListener('scroll', window, cb),
  resize: cb => addListener('resize', window, cb),
  click: cb => addListener('click', canvas, cb),
  pointerdown: cb => addListener('pointerdown', canvas, cb),
  pointermove: cb => addListener('pointermove', canvas, cb),
  pointerup: cb => addListener('pointerup', document.body, cb),
})
