const addListener = (what, el, cb) => {
  const name = cb
  el.addEventListener(what, cb)
  return {
    remove: () => el.removeEventListener(what, name),
  }
}

function touchHandler(event) {
  var touch = event.changedTouches[0]
  var simulatedEvent = new MouseEvent(
    {
      touchstart: 'mousedown',
      touchmove: 'mousemove',
      touchend: 'mouseup',
    }[event.type],
    {
      bubbles: true,
      cancelable: true,
      view: window,
      detail: 1,
      screenX: touch.screenX,
      screenY: touch.screenY,
      clientX: touch.clientX,
      clientY: touch.clientY,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      button: 0,
      relatedTarget: null,
    }
  )
  touch.target.dispatchEvent(simulatedEvent)
}
function init() {
  // I suggest you be far more specific than "document"
  document.addEventListener('touchstart', touchHandler, true)
  document.addEventListener('touchmove', touchHandler, true)
  document.addEventListener('touchend', touchHandler, true)
  document.addEventListener('touchcancel', touchHandler, true)
}

export const event = canvas => ({
  scroll: cb => addListener('scroll', window, cb),
  resize: cb => addListener('resize', window, cb),
  click: cb => addListener('click', canvas.element, cb),
  mousedown: cb => addListener('mousedown', canvas.element, cb),
  mousemove: cb => addListener('mousemove', canvas.element, cb),
  mouseup: cb => addListener('mouseup', document.body, cb),
})
