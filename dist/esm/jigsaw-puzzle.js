const tap = fn => x => { fn(x); return x };

// random number 0 - 1, based on hash
const random = (hash = Math.random()) =>
  (Math.cos(Math.sin((hash + 69) * 1337.1337) * 6669.1337) + 1) * 0.5;

// ex. runIf(console.log)(true)('foo') -> prints 'foo'
// ex. runIf(console.log)(false)('bar') -> returns 'bar'
// ex. runIf(console.log)(x => x === 'bar'))('bar') -> prints 'bar'
const runIf = fn => x => y =>
  (typeof x === 'function' ? x(y) : x) ? fn(y) : y;

const pipe =
  (...fns) =>
  x =>
    [...fns].reduce((acc, f) => f(acc), x);

const clone = obj => JSON.parse(JSON.stringify(obj));

// calculates which pieces are next to given piece
const getNeighbors = (i, rows, cols) => {
  const slot = i + 1;

  const neighbors = {
    top: slot > cols ? i - cols : undefined,
    right: slot % cols !== 0 ? i + 1 : undefined,
    bottom: slot <= (rows - 1) * cols ? i + cols : undefined,
    left: slot % cols !== (cols > 1 ? 1 : 0) ? i - 1 : undefined,
  };

  return JSON.parse(JSON.stringify(neighbors))
};

const allSides = ['top', 'right', 'bottom', 'left'];
const isVertical = side => side === 'top' || side === 'bottom';

const oppositeOf = ({ shape, size }) => {
  return {
    shape: shape === 'out' ? 'in' : 'out',
    size: size,
  }
};

const order = ['top', 'right', 'bottom', 'left'];
const clockwise = (a, b) => {
  return order.indexOf(a[0]) > order.indexOf(b[0]) ? 1 : -1
};

const makeShapes = individualize => (acc, piece) => {
  const neighborShape = (id, side) => {
    const piece = acc.find(piece => piece.id === id);

    return piece?.sides[
      {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[side]
    ]
  };

  const flatSides = ({ neighbors }) =>
    allSides
      .filter(side => !Object.keys(neighbors).includes(side))
      .reduce(
        (acc, side) => ({ [side]: { shape: 'flat', size: 1 }, ...acc }),
        {}
      );

  const shapedSides = ({ neighbors }) =>
    Object.keys(neighbors).reduce((acc, side) => {
      const neighbor = neighborShape(neighbors[side], side);

      return {
        [side]: neighbor
          ? oppositeOf(neighbor)
          : random() >= 0.5
          ? { shape: 'out', size: individualize ? Math.random() : 1 }
          : { shape: 'in', size: individualize ? Math.random() : 1 },
        ...acc,
      }
    }, {});

  const sides = [
    ...Object.entries({
      ...shapedSides(piece),
      ...flatSides(piece),
    }),
  ]
    .sort(clockwise)
    .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {});

  return [{ ...piece, sides }, ...acc]
};

const makePieces = (amount, individualize) => {
  const piecesAmount = [...Array(amount.y * amount.x)];

  const pieces = piecesAmount.map((_, i) => ({
    id: i,
    origin: {
      x: i % amount.x,
      y: Math.floor(i / amount.x),
    },
    pos: { x: 0, y: 0 },
    neighbors: getNeighbors(i, amount.y, amount.x),
    active: false, // if clicked/dragged
    connections: [], // every other piece this one is snapped together with
  }));

  return pieces.reduce(makeShapes(individualize), [])
};

// shallow filtering
const filterUnique = xs => [...new Set(xs)];
const activeLast = (x, y) => (y.active ? -1 : 1);
const mapReverse = fn => xs =>
  xs.reduceRight((acc, el, i, arr) => [...acc, fn(el, i, arr, acc)], []);
const sort = fn => xs => xs.sort(fn);

function shuffleArray(array) {
  const suffled = [...array];
  let counter = suffled.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = suffled[counter];
    suffled[counter] = suffled[index];
    suffled[index] = temp;
  }

  return suffled
}

const randomBetween = val => {
  return Math.random() * (val - val * -1) + val * -1
};

const shuffle =
  (aligned = false) =>
  puzzle => {
    return {
      ...puzzle,
      pieces: aligned
        ? shuffleArray(puzzle.pieces).map((piece, i) => ({
            ...piece,
            connections: [],
            pos: {
              x: (i % puzzle.size.x) / puzzle.size.x * 2 - 0.4 + randomBetween(0.03),
              y: Math.floor(i / puzzle.size.x) / puzzle.size.y * 2 - 0.4 + randomBetween(0.03),
              // x:
              //   ((i % puzzle.size.x) / puzzle.size.x + randomBetween(0.015)) *
              //   2,
              // y:
              //   (Math.floor(i / puzzle.size.x) / puzzle.size.y +
              //     randomBetween(0.015)) *
              //   2,
            },
          }))
        : puzzle.pieces.map(piece => ({
            ...piece,
            connections: [],
            pos: {
              x: random() * 2 - 0.5,
              y: random() * 2 - 0.5,
            },
          })),
    }
  };

const asPosition = (piece, { x, y, width, height }) => {
  return (
    x >= piece.pos.x &&
    x <= piece.pos.x + width &&
    y >= piece.pos.y &&
    y <= piece.pos.y + height
  )
};

const isTruthy = prop => obj => obj[prop];

const getPiecePos = (piece, { x, y }) => {
  return {
    x: x - piece.pos.x,
    y: y - piece.pos.y,
  }
};

// pieces gets painted bottom to top, we need to check in reverse order
const activate =
  ({ x, y }) =>
  puzzle => ({
    ...puzzle,
    pieces: pipe(
      // activate clicked piece (first occurrence)
      mapReverse((piece, i, arr, acc) => ({
        ...piece,
        active:
          !acc.find(isTruthy('active')) &&
          asPosition(piece, {
            x,
            y,
            width: 1 / puzzle.size.x,
            height: 1 / puzzle.size.y,
          })
            ? getPiecePos(piece, { x, y })
            : false,
      })),

      mapReverse((piece, i, arr) => ({
        ...piece,
        // activate the active piece's connections
        active: arr.find(p => p.active && p.connections.includes(piece.id))
          ? getPiecePos(piece, { x, y })
          : piece.active,
      })),

      // put the active piece(s) on top
      // if puzzle isn't done or not all pieces are active (puzzle dragged)
      runIf(sort(activeLast))(
        ps =>
          !puzzle.done &&
          ps.filter(p => p.active).length !== puzzle.pieces.length
      )
    )(puzzle.pieces),
  });

const deactivate = tap(puzzle => {
  puzzle.pieces = puzzle.pieces.map(piece => ({
    ...piece,
    active: false,
  }));
});

const move$2 =
  ({ x, y }) =>
  puzzle => {
    return {
      ...puzzle,
      pieces:
        puzzle.status === 'idle'
          ? puzzle.pieces
          : puzzle.pieces.map(piece => ({
              ...piece,
              pos: piece.active
                ? {
                    x: x - piece.active.x,
                    y: y - piece.active.y,
                  }
                : piece.pos,
            })),
    }
  };

// should return, not modify
const shareConnections = (puzzle, piece, newPiece) => {
  piece.connections = filterUnique([
    piece.id,
    newPiece.id,
    ...piece.connections,
    ...newPiece.connections,
  ]);

  piece.connections.forEach(id => {
    const connection = puzzle.pieces.find(piece => piece.id === id);
    connection.connections = filterUnique(piece.connections);
  });

  newPiece.connections.forEach(id => {
    const connection = puzzle.pieces.find(piece => piece.id === id);
    connection.connections = filterUnique(piece.connections);
  });
};

const nw = side => side === 'top' || side === 'left';

// is piece1 close to piece2
const isClose = (p1, p2, puzzle, side) => {
  const { attraction, size } = puzzle;
  const snapArea = attraction / 100;

  const XY = isVertical(side) ? 'y' : 'x';
  const invXY = XY === 'x' ? 'y' : 'x';

  const positive = nw(side) ? false : true;

  const siz = XY === 'y' ? 1 / size.y : 1 / size.x;
  const offset = positive ? p2.pos[XY] + siz : p2.pos[XY] - siz;

  return (
    p1.pos[XY] <= offset + snapArea &&
    p1.pos[XY] >= offset - snapArea &&
    p1.pos[invXY] <= p2.pos[invXY] + snapArea &&
    p1.pos[invXY] >= p2.pos[invXY] - snapArea
  )
};

const same = (val, prop) => obj => obj[val] === prop;

const moveConnections = (puzzle, [...pieceIds], distance) => {
  pieceIds.forEach(id => {
    const piece = puzzle.pieces.find(same('id', id));
    piece.pos = {
      x: piece.pos.x + distance.x,
      y: piece.pos.y + distance.y,
    };
  });
};

const snap = tap(puzzle => {
  const activePieces = puzzle.pieces.filter(piece => piece.active);
  const { size } = puzzle;

  if (!activePieces.length || activePieces.length === puzzle.pieces.length) {
    return
  }

  activePieces.forEach(piece => {
    Object.entries(piece.neighbors).forEach(([side, id]) => {
      const neighbor = puzzle.pieces.find(same('id', id));

      if (isClose(neighbor, piece, puzzle, side)) {
        const newPos = {
          x:
            neighbor.pos.x +
            (side === 'right'
              ? -1 / size.x
              : side === 'left'
              ? +1 / size.x
              : 0),
          y:
            neighbor.pos.y +
            (side === 'top' ? 1 / size.y : side === 'bottom' ? -1 / size.y : 0),
        };

        // order is important
        moveConnections(puzzle, piece.connections, {
          x: newPos.x - piece.pos.x,
          y: newPos.y - piece.pos.y,
        });

        piece.pos = newPos;

        shareConnections(puzzle, piece, neighbor);
      }
    });
  });
});

const status = tap(puzzle => {
  if (puzzle.status === 'active') {
    puzzle.moves = puzzle.moves + 1;
  }

  if (
    puzzle.pieces[0].connections.length === puzzle.size.y * puzzle.size.x &&
    !puzzle.done
  ) {
    puzzle.done = true;
  }
});

const setStatus = ({ x, y }) =>
  tap(puzzle => {
    const active = puzzle.pieces.find(piece => piece.active);

    if (active) {
      puzzle.status = 'active';
      return
    }

    const hovered = puzzle.pieces.find(piece =>
      asPosition(piece, {
        x,
        y,
        width: 1 / puzzle.size.x,
        height: 1 / puzzle.size.y,
      })
    );

    if (hovered && !active) {
      puzzle.status = 'ready';
      return
    }

    puzzle.status = 'idle';
  });

/**
 * MIT License - Copyright (c) 2021 Kaiido
 *
 * A monkey-patch for Safari's drawImage.
 *
 * This browser doesn't handle well using the cropping abilities of drawImage
 * with out-of-bounds values.
 * (see https://stackoverflow.com/questions/35500999/cropping-with-drawimage-not-working-in-safari)
 * This script takes care of detecting when the monkey-patch is needed,
 * and does redefine the cropping parameters so they fall inside the source's boundaries.
 *
**/

(()=> {

  if( !needPoly() ) { return; }

  const proto = CanvasRenderingContext2D.prototype;
  const original = proto.drawImage;
  if( !original ) {
    console.error( "This script requires a basic implementation of drawImage" );
    return;
  }

  proto.drawImage = function drawImage( source, x, y ) { // length: 3

    const will_crop = arguments.length === 9;
    if( !will_crop ) {
      return original.apply( this, [...arguments] );
    }

    const safe_rect = getSafeRect( ...arguments );
    if( isEmptyRect( safe_rect ) ) {
      return;
    }
    return original.apply( this, safe_rect );
  }; 

  function needPoly() {
    const ctx = document.createElement( "canvas" ).getContext( "2d" );
    ctx.fillRect( 0, 0, 40, 40 );
    ctx.drawImage( ctx.canvas, -40, -40, 80, 80, 50, 50, 20, 20 );

    const img = ctx.getImageData( 50, 50, 30, 30 ); // 10px around expected square
    const data = new Uint32Array( img.data.buffer );
    const colorAt = (x, y) => data[ y * img.width + x ];

    const transparents = [ [ 9, 9 ], [ 20, 9 ], [ 9, 20 ], [ 20, 20 ] ];
    const blacks = [ [ 10, 10 ], [ 19, 10 ], [ 10, 19 ], [ 19, 19 ] ];
    return transparents.some( ([ x, y ]) => colorAt( x, y ) !== 0x00000000 ) ||
      blacks.some( ([ x, y ]) => colorAt( x, y ) === 0x00000000 )
  }

  function getSafeRect( image, sx, sy, sw, sh, dx, dy, dw, dh ) {
  
    const { width, height } = getSourceDimensions( image );
    
    if( sw < 0 ) {
      sx += sw;
      sw = Math.abs( sw );
    }
    if( sh < 0 ) {
      sy += sh;
      sh = Math.abs( sh );
    }
    if( dw < 0 ) {
      dx += dw;
      dw = Math.abs( dw );
    }
    if( dh < 0 ) {
      dy += dh;
      dh = Math.abs( dh );
    }
    const x1 = Math.max( sx, 0 );
    const x2 = Math.min( sx + sw, width );
    const y1 = Math.max( sy, 0 );
    const y2 = Math.min( sy + sh, height );
    const w_ratio = dw / sw;
    const h_ratio = dh / sh;

    return [
      image,
      x1,
      y1,
      x2 - x1,
      y2 - y1,
      sx < 0 ? dx - (sx * w_ratio) : dx,
      sy < 0 ? dy - (sy * h_ratio) : dy,
      (x2 - x1) * w_ratio,
      (y2 - y1) * h_ratio
    ];

  }

  function isEmptyRect( args ) {
    // sw, sh, dw, dh
    return [ 3, 4, 7, 8 ].some( (index) => !args[ index ] );
  }

  function getSourceDimensions( source ) {
    const sourceIs = ( type ) => {
      const constructor = globalThis[ type ];
      return constructor && (source instanceof constructor);
    };
    if( sourceIs( "HTMLImageElement" ) ) {
      return { width: source.naturalWidth, height: source.naturalHeight };
    }
    else if( sourceIs( "HTMLVideoElement" ) ) {
      return { width: source.videoWidth, height: source.videoHeight };
    }
    else if( sourceIs( "SVGImageElement" ) ) {
      throw new TypeError( "SVGImageElement isn't yet supported as source image.", "UnsupportedError" );
    }
    else if( sourceIs( "HTMLCanvasElement" ) || sourceIs( "ImageBitmap" ) ) {
      return source;
    }
  }

})();

const clamp = (val, min, max) => {
  return Math.max(min, Math.min(max, val))
};

let scale = 1;
const position = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};

const move$1 = ({ x, y, bounding = { x: Infinity, y: Infinity } }) => {
  position.x = position.x + x;
  position.y = position.y + y;

  return { position, scale }
};

const zoom = ({ focal, zoom, max = 10000, min = 0.05 }) => {
  const atMax = scale === max || scale === min;

  scale = clamp(scale * zoom, min, max);

  const at = {
    x: atMax ? position.x : focal.x,
    y: atMax ? position.y : focal.y,
  };

  position.x = at.x - (at.x - position.x) * zoom;
  position.y = at.y - (at.y - position.y) * zoom;

  return { position, scale }
};

const restore = () => {
  position.x = (window.innerWidth / 2) * Math.min(2, window.devicePixelRatio);
  position.y = (window.innerHeight / 2) * Math.min(2, window.devicePixelRatio);
};

function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  )
}

var pan = (
  canvas,
  {
    dpi = Math.min(2, window.devicePixelRatio),
    bounding = null,
    initScale = 1,
  } = {}
) => {
  canvas.style.touchAction = 'none';
  canvas.style.userSelect = 'none';
  canvas.style.webkitUserSelect = 'none';
  canvas.style.overscrollBehavior = 'contain';

  let fingers = {};
  let lastDistance = null;
  scale = initScale;

  const dispatch = detail => {
    canvas.dispatchEvent(
      new CustomEvent('pan', {
        detail,
        bubbles: true,
        cancelable: true,
        composed: false,
      })
    );
  };

  setTimeout(() => dispatch({ scale, position }));

  const handlePointerdown = e => {
    e.preventDefault();

    fingers[e.pointerId] = {
      x: e.offsetX,
      y: e.offsetY,
      deltaX: 0,
      deltaY: 0,
    };

    canvas.addEventListener('pointerleave', handlePointerup, { once: true });
  };

  const handlePointermove = e => {
    e.preventDefault();

    if (!fingers[e.pointerId]) return

    fingers[e.pointerId] = {
      x: e.offsetX,
      y: e.offsetY,
      deltaX: e.offsetX - fingers[e.pointerId].x,
      deltaY: e.offsetY - fingers[e.pointerId].y,
    };

    const fingersArray = Object.values(fingers);

    const { position } = move$1({
      x: fingers[e.pointerId].deltaX * dpi * 0.7,
      y: fingers[e.pointerId].deltaY * dpi * 0.7,
    });

    const distance =
      Object.keys(fingers).length !== 2
        ? 1
        : Math.sqrt(
            Math.pow(fingersArray[1].x - fingersArray[0].x, 2) +
              Math.pow(fingersArray[1].y - fingersArray[0].y, 2)
          );

    const { scale } = zoom({
      focal: { x: e.offsetX * dpi, y: e.offsetY * dpi },
      zoom:
        Object.keys(fingers).length !== 2 || !lastDistance
          ? 1
          : 1 + (distance - lastDistance) / 200,
    });

    lastDistance = distance;

    dispatch({ scale, position });
  };

  const handlePointerup = e => {
    e.preventDefault();
    delete fingers[e.pointerId];
    lastDistance = null;
  };

  if (isTouchDevice()) {
    canvas.addEventListener('pointerdown', handlePointerdown);
    canvas.addEventListener('pointermove', handlePointermove);
    canvas.addEventListener('pointerup', handlePointerup);
    canvas.addEventListener('pointercancel', handlePointerup);
  } else {
    canvas.addEventListener('wheel', e => {
      e.preventDefault();

      if (e.ctrlKey) {
        dispatch(
          zoom({
            focal: { x: e.offsetX * dpi, y: e.offsetY * dpi },
            zoom: 1 - e.deltaY / 100,
          })
        );
      } else {
        dispatch(move$1({ x: -e.deltaX, y: -e.deltaY }));
      }
    });
  }

  return {
    zoom: newScale => {
      zoom({
        focal: {
          x: (window.innerWidth / 2) * dpi,
          y: (window.innerHeight / 2) * dpi,
        },
        zoom: newScale,
      });

      dispatch({ scale, position });
    },
    restore: () => {
      restore();
      dispatch({ scale, position });
    },
  }
};

const getTransformedPosition = (
  { x, y },
  dpi = Math.min(2, window.devicePixelRatio)
) => {
  return [(x * dpi - position.x) / scale, (y * dpi - position.y) / scale]
};

const loadImage = src =>
  new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = src;
  });

const resize = canvas => {
  const { height, width } = getComputedStyle(canvas.parentElement);

  const dpr = Math.min(2, window.devicePixelRatio);

  canvas.width = parseInt(width, 0) * dpr;
  canvas.height = parseInt(height, 0) * dpr;
};

const makeCanvas = element => {
  const canvas =
    element && element.tagName === 'CANVAS'
      ? element
      : document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (element && element.tagName !== 'CANVAS') {
    element.appendChild(canvas);

    canvas.style.width = '100%';
    canvas.style.height = '100%';

    resize(canvas);
  }

  ctx.strokeStyle = 'rgba(220, 220, 220, 1)';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  return {
    canvas,
    ctx,
  }
};

const clearCanvas = tap(ui => {
  const { canvas, ctx } = ui;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
});

const paint = puzzle =>
  tap(ui => {
    clearCanvas(ui);
    puzzle.pieces.map(paintPiece(puzzle, ui));
  });

const setCursor = puzzle =>
  tap(ui => {
    ui.canvas.style.cursor =
      puzzle.status === 'active'
        ? 'grabbing'
        : puzzle.status === 'ready'
        ? 'grab'
        : 'default';
  });

const paintPiece = (puzzle, ui) => piece => {
  const size = {
    x: ui.size.x / puzzle.size.x,
    y: ui.size.y / puzzle.size.y,
  };

  const { ctx, image } = ui;
  const path = ui.shapes[piece.id];

  //
  const shapeOffset = Math.max(size.x, size.y);

  ctx.save();
  ctx.translate(piece.pos.x * ui.size.x, piece.pos.y * ui.size.y);

  const highlight = !puzzle.done && (piece.active || piece.alsoActive);
  const strokeWidth = 8 / Math.max(ui.zoom, 4);

  ctx.lineWidth = highlight ? strokeWidth * 2 : strokeWidth;
  ctx.shadowOffsetX = ctx.shadowOffsetY = -strokeWidth / 2;
  ctx.shadowBlur = strokeWidth;
  ctx.shadowColor = highlight ? 'rgba(100, 100, 100, 1)' : 'rgba(50, 50, 50, 1)';

  ctx.stroke(path);
  ctx.clip(path);

  ctx.drawImage(
    image,
    piece.origin.x * size.x - shapeOffset, // what part of image
    piece.origin.y * size.y - shapeOffset, // what part of image
    size.x + shapeOffset * ui.dpi, // how much of image
    size.y + shapeOffset * ui.dpi, // how much of image
    piece.pos.x / ui.size.x - shapeOffset, // where on canvas
    piece.pos.y / ui.size.y - shapeOffset, // where on canvas
    size.x + shapeOffset * ui.dpi, // how big on canvas
    size.y + shapeOffset * ui.dpi // how big on canvas
  );

  ctx.restore();
};

const rotatePoint = (center, degrees, ...args) => {
  const deg = (degrees * Math.PI) / 180;
  const { sin, cos } = Math;

  return args
    .map(([x, y]) => [
      (x - center.x) * cos(deg) - (y - center.y) * sin(deg) + center.x,
      (x - center.x) * sin(deg) + (y - center.y) * cos(deg) + center.y,
    ])
    .flat()
};

const rotate = (bezier, angle) => {
  const [origin] = bezier[0];

  return bezier.map(part => {
    return rotatePoint({ x: origin[0], y: origin[1] }, angle, ...part)
  })
};

const move = (curve, to) => {
  const res = curve.map(part => {
    return part.map(point => {
      return [point[0] + to.x, point[1] + to.y]
    })
  });
  return res
};

const inverse = curve => {
  const res = curve.map(part => {
    return part.map(point => {
      return [point[0], point[1] * -1]
    })
  });
  return res
};

const bezier = ({ knobsize = 1, length = 100 }) => {
  const middle = length / 2;

  return [
    // left shoulder
    [
      [0, 0],
      [middle - knobsize * 20, knobsize * 4],
      [middle - knobsize * 13, 0],
    ],

    // left neck
    [
      [middle - knobsize * 13, 0],
      [middle - knobsize * 10, knobsize * -2],
      [middle - knobsize * 12, knobsize * -5],
    ],

    // left head
    [
      [middle - knobsize * 12, knobsize * -5],
      [middle - knobsize * 30, knobsize * -30],
      [middle, knobsize * -30],
    ],

    // right head
    [
      [middle, knobsize * -30],
      [middle - knobsize * -30, knobsize * -30],
      [middle - knobsize * -12, knobsize * -5],
    ],

    // right neck
    [
      [middle - knobsize * -12, knobsize * -5],
      [middle - knobsize * -10, knobsize * -2],
      [middle - knobsize * -13, 0],
    ],

    // right shoulder
    [
      [middle - knobsize * -13, 0],
      [middle - knobsize * -20, knobsize * 4],
      [length, 0],
    ],
  ]
};

const cutPiece = ({ size, shapes, knobsize }) => {
  const path = new Path2D();

  if (!shapes.length === 4) {
    console.log('a piece needs to have 4 sides');
    return
  }

  const corners = [
    { x: 0, y: 0, angle: 0 },
    { x: size.x, y: 0, angle: 90 },
    { x: size.x, y: size.y, angle: 180 },
    { x: 0, y: size.y, angle: 270 },
  ];

  corners.forEach((corner, idx) => {
    const length = idx % 2 === 1 ? size.y : size.x;
    const shape = shapes[idx];

    if (shape === 'flat') {
      const end = rotatePoint(corner, corner.angle, [
        corner.x + length,
        corner.y,
      ]);

      path.lineTo(...end);
    } else {
      const bez = bezier({
        length,
        knobsize: knobsize[idx],
      });

      const curve =
        shape === 'in'
          ? rotate(move(inverse(bez), corner), corner.angle)
          : rotate(move(bez, corner), corner.angle);

      curve.forEach(p => path.bezierCurveTo(...p.flat()));
    }
  });

  path.closePath();

  return path
};

const cutPieces = (width, height, arr) => {
  return arr.reduce((acc, cur) => {
    const sides = Object.values(cur.sides);
    const shapes = sides.map(({ shape }) => shape);
    const knobsize = sides.map(
      ({ size }) => ((0.6 + size * 0.4) * Math.min(width, height)) / 110
    );
    return {
      ...acc,
      [cur.id]: cutPiece({
        size: {
          x: width,
          y: height,
        },
        shapes,
        knobsize,
      }),
    }
  }, {})
};

const createPiecesCanvas = (image, piecesData, numberOfPieces, dpi = 2) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const pieceWidth = image.width / numberOfPieces.x;
  const pieceHeight = image.height / numberOfPieces.y;

  const extraSpaceNeeded = Math.round(Math.max(pieceWidth, pieceHeight) / 2);

  canvas.width = pieceWidth + extraSpaceNeeded;
  canvas.height = pieceHeight + extraSpaceNeeded;
  
  const paths = cutPieces(pieceWidth, pieceHeight, piecesData);
  
  piecesData.map((piece) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ctx.stroke(paths[piece.id])
    ctx.clip(paths[piece.id]);

    ctx.drawImage(
      image,
      piece.origin.x * pieceWidth - extraSpaceNeeded, // what part of image
      piece.origin.y * pieceHeight - extraSpaceNeeded, // what part of image
      (numberOfPieces.x + extraSpaceNeeded * 2) * dpi, // how much of image
      (numberOfPieces.y + extraSpaceNeeded * 2) * dpi, // how much of image
      0, // where on canvas
      0, // where on canvas
      (numberOfPieces.x + extraSpaceNeeded * 2) * dpi, // how big on canvas
      (numberOfPieces.y + extraSpaceNeeded * 2) * dpi // how big on canvas
    );

    return {
      imageData: ctx.getImageData(0, 0, canvas.width, canvas.height),
      x: 0
    }
  });

  canvas.style.position = 'fixed';
  canvas.style.top = '20px';
  canvas.style.left = '20px';
  canvas.style.width = '800px';
  canvas.style.border = '1px solid';

  document.body.append(canvas);
};

const puzzle = async ({
  element,
  image: img = '',
  pieces = { x: 6, y: 4 },
  attraction = 5,
  aligned = true,
  individualize = false,
  zoom: initZoom,
  beforeInit = () => {},
  onInit = () => {},
  onComplete = () => {},
  onChange = () => {},
}) => {
  const container =
    typeof element === 'string' ? document.querySelector(element) : element;

  if (!container) {
    console.warn(`Couldn't find element: ${element}`);
    return
  }

  const { canvas, ctx } = makeCanvas(container);

  beforeInit(canvas);

  const image = await loadImage(img);

  const initPuzzle = {
    moves: 0,
    status: 'idle',
    done: false,
    startTime: Date.now(),
    attraction,
    size: pieces,
    pieces: makePieces(pieces, individualize),
  };

  const initUI = {
    url: img,
    zoom: 1,
    position: { x: 0, y: 0 },
    size: { x: image.width, y: image.height },
    canvas,
    ctx,
    piecesCanvas: createPiecesCanvas(image, initPuzzle.pieces, pieces),
    image,
    dpi: Math.min(2, window.devicePixelRatio),
    shapes: cutPieces(
      image.width / pieces.x,
      image.height / pieces.y,
      initPuzzle.pieces
    ),
  };

  let state = {};

  state.puzzle = pipe(shuffle(aligned))(initPuzzle);
  state.ui = paint(state.puzzle)(initUI);

  const { zoom, restore } = pan(canvas, {
    dpi: Math.min(2, window.devicePixelRatio),
    initScale:
      initZoom ||
      Math.min(
        (window.innerWidth / state.ui.size.x) * 0.9,
        (window.innerHeight / state.ui.size.y) * 0.9
      ),
  });

  const updateUI = () => {
    state.ui = pipe(paint(state.puzzle), setCursor(state.puzzle))(state.ui);
  };

  canvas.addEventListener('pan', e => {
    e.preventDefault();
    const {
      detail: { scale, position },
    } = e;

    state.ui.zoom = scale;
    state.ui.position = position;

    state.ui.ctx.setTransform(scale, 0, 0, scale, position.x, position.y);
    updateUI();
  });

  setTimeout(() => onInit(state));

  const getCursor = ({ x, y }) => {
    const [xpos, ypos] = getTransformedPosition({ x, y }, state.ui.dpi);
    return { x: xpos / state.ui.size.x, y: ypos / state.ui.size.y }
  };

  const handlePointerdown = ({ offsetX: x, offsetY: y }) => {
    const cursor = getCursor({ x, y });

    state.puzzle = pipe(activate(cursor), setStatus(cursor))(state.puzzle);

    updateUI();
  };

  const handlePointermove = ({ offsetX: x, offsetY: y }) => {
    const cursor = getCursor({ x, y });

    state.puzzle = pipe(move$2(cursor), setStatus(cursor))(state.puzzle);

    updateUI();
  };

  const handlePointerup = ({ offsetX: x, offsetY: y }) => {
    const cursor = getCursor({ x, y });

    state.puzzle = pipe(
      snap,
      deactivate,
      status,
      setStatus(cursor)
    )(state.puzzle);

    updateUI();

    onChange({ ui: state.ui, puzzle: clone(state.puzzle) });

    if (state.puzzle.done) onComplete(state);
  };

  const handleResize = () => {
    const { zoom, position } = state.ui;
    resize(state.ui.canvas);
    ctx.setTransform(zoom, 0, 0, zoom, position.x, position.y);
    updateUI();
  };

  state.ui.canvas.addEventListener('pointerdown', handlePointerdown);
  state.ui.canvas.addEventListener('pointermove', handlePointermove);
  state.ui.canvas.addEventListener('pointerup', handlePointerup);
  window.addEventListener('resize', handleResize);

  return {
    newGame: () => {
      state.puzzle = pipe(shuffle(aligned))(initPuzzle);
      updateUI();
    },
    getState: () => clone(state.puzzle),
    setState: newState => {
      state.puzzle = newState;
      updateUI();
    },
    destroy: () => {
      if (element.tagName !== 'CANVAS') {
        state.ui.canvas.remove();
      }

      state = null;
    },
    setZoom: zoom,
    getZoom: () => state.ui.zoom,
    centralize: restore,
  }
};

export { puzzle };
