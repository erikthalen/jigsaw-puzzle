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
  click: cb => addListener('click', canvas.element, cb),
  mousedown: cb => addListener('mousedown', canvas.element, cb),
  mousemove: cb => addListener('mousemove', canvas.element, cb),
  mouseup: cb => addListener('mouseup', document.body, cb),
})
