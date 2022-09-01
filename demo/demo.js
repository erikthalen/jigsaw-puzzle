import { puzzle } from './jigsaw-puzzle.esm.mjs'

const $ = selector => document.querySelector(selector)

const solution = $('#solution')
const newGame = $('#new-game')
const saveGame = $('#save-game')
const loadGame = $('#load-game')
// const source = $('#source')
const X = $('#x')
const Y = $('#y')

const images = [
  'https://images.unsplash.com/photo-1529982567978-dbaa7babe4df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
  // 'https://artsourceinternational.com/wp-content/uploads/2018/04/WOR0006.jpg',
  // 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fmedicinetoday.com.au%2Fsites%2Fdefault%2Ffiles%2FDermQuiz-Figure.jpg&f=1&nofb=1',
  // 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fallhdwallpapers.com%2Fwp-content%2Fuploads%2F2015%2F07%2FDesert-6.jpg&f=1&nofb=1',
]

const options = {
  element: '#app',
  image: images[Math.floor((Date.now() / 1000) % images.length)],
  pieces: { x: 10, y: 7 },
  attraction: 3,
  aligned: true,
  beforeInit: canvas => {
    // console.log('before init:', canvas)
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

let image = options.image
X.value = options.pieces.x
Y.value = options.pieces.y

let p = await puzzle(options)

window.puzzle = p

// const tick = () => {
//   if(p.getZoom() >= 0.1) {
//     requestAnimationFrame(tick)
//   }

//   p.setZoom(0.99)
// }
// tick()

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

source.addEventListener('change', async e => {
  options.image = solution.src = e.target.value
  refresh()
})

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
