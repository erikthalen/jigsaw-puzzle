[demo](https://gto3y.csb.app/)

```bash
yarn add jigsaw-puzzle
```

```js
import { puzzle } from 'jigsaw-puzzle'

const p = await puzzle({
  element: '#app',
  image: 'image.jpg',
  /* ...optionalParameters */
})

const optionalParameters = {
  pieces: { x: 6, y: 4 },
  attraction: 5,   // distance to snap pieces
  aligned: true,   // don't overlap pieces on start
  zoom: 0.5,       // initial zoom of context
  beforeInit: canvas => {},
  onInit: state => {},
  onChange: state => {},
  onComplete: state => {}
}

p.newGame()              // start over
let state = p.getState() // save game
p.setState(state)        // load game
p.destroy()              // kill puzzle
p.getZoom()              // current zoom
p.setZoom()              // set zoom
p.centralize()           // pan to center
```
