[demo](https://gto3y.csb.app/)

```js
// index.js
import { puzzle } from 'jigsaw-puzzle'


const P = await puzzle({
  element: '#app',
  image: 'image.jpg',
  pieces: { x: 6, y: 4 },
  attraction: 30,  // distance to snap pieces
  size: 0.8,       // ratio of puzzle/canvas
  draggable: true, // move puzzle by dragging canvas
  onComplete: state => {},
  onChange: state => {}
})


P.newGame()       // start over
P.getState()      // save game
P.setState(state) // load game
P.destroy()       // kill puzzle
```