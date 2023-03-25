import { puzzle } from './esm/jigsaw-puzzle.js'

const $ = selector => document.querySelector(selector)

const solution = $('#solution')
const newGame = $('#new-game')
const saveGame = $('#save-game')
const loadGame = $('#load-game')
// const source = $('#source')
const X = $('#x')
const Y = $('#y')

export const loadImage = src =>
  new Promise(resolve => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.src = src
  })

const image = await loadImage('street.jpg')

const options = {
  element: '#app',
  image,
  pieces: { x: 10, y: 8 },
  attraction: 3,
  aligned: true,
  individualize: false,
  beforeInit: canvas => {
    canvas.style.opacity = 0
  },
  onInit: state => {
    console.log('on init:', state)
    state.ui.canvas.style.transition = 'opacity 0.2s ease'
    state.ui.canvas.style.opacity = 1
  },
  onChange: state => {
    console.log('on change:', state)
  },
  onComplete: state => {
    console.log('on complete:', state)
  },
}

X.value = options.pieces.x
Y.value = options.pieces.y

let p = await puzzle(options)

window.puzzle = p

newGame.addEventListener('click', async () => p.newGame())

saveGame.addEventListener('click', () => {
  localStorage.setItem('save', JSON.stringify(p.getState()))
})

loadGame.addEventListener('click', () => {
  p.setState(JSON.parse(localStorage.getItem('save')))
})

const refresh = async () => {
  p.destroy()
  p = await puzzle(options)
}

X.addEventListener('change', async e => {
  if (e.target.value < 2) return
  options.pieces.x = parseInt(e.target.value, 0)
  refresh()
})

Y.addEventListener('change', async e => {
  if (e.target.value < 2) return
  options.pieces.y = parseInt(e.target.value, 0)
  refresh()
})

// window.addEventListener('click', p.restorePan)
