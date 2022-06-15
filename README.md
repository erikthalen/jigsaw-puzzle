[demo](https://gto3y.csb.app/)

```js
import puzzle from 'jigsaw-puzzle'

const p = await puzzle({
  element: '#app',
  image: 'image.jpg',
  pieces: { x: 6, y: 4 },
  attraction: 5,   // distance to snap pieces
  aligned: true,   // don't overlap pieces on start
  zoom: 0.5,       // initial zoom of context
  onComplete: state => {},
  onChange: state => {}
})


p.newGame()              // start over
let state = p.getState() // save game
p.setState(state)        // load game
p.destroy()              // kill puzzle
p.getZoom()              // current zoom
p.setZoom()              // set zoom
```