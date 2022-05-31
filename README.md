[demo](https://gto3y.csb.app/)

```js
import { puzzle } from 'jigsaw-puzzle'

const p = await puzzle({
  element: '#app',
  image: 'image.jpg',
  pieces: { x: 6, y: 4 },
  attraction: 30,  // distance to snap pieces
  size: 0.8,       // ratio of puzzle/canvas
  draggable: true, // move puzzle by dragging canvas
  aligned: true,   // don't overlap pieces on start
  onComplete: state => {},
  onChange: state => {}
})


p.newGame()              // start over
let state = p.getState() // save game
p.setState(state)        // load game
p.destroy()              // kill puzzle
```