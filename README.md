[demo](https://codesandbox.io/s/funny-archimedes-gto3y)

```js
// index.js
import { puzzle } from 'jigsaw-puzzle'


const P = await puzzle({
  element: '#app',
  image: 'image.jpg',
  pieces: { x: 6, y: 4 },
  attraction: 30,
  size: 0.8,
  draggable: true,
  onComplete: state => {},
  onChange: state => {}
})


P.newGame()       // start over
P.getState()      // save game
P.setState(state) // load game
P.destroy()       // kill puzzle
```