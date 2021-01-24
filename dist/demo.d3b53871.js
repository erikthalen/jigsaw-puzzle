// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/utils/dom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$ = void 0;

const $ = selector => document.querySelector(selector);

exports.$ = $;
},{}],"src/utils/pipe.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pipe = void 0;

const pipe = (...fns) => x => [...fns].reduce((acc, f) => f(acc), x);

exports.pipe = pipe;
},{}],"src/utils/tap.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tap = void 0;

const tap = fn => x => {
  fn(x);
  return x;
};

exports.tap = tap;
},{}],"src/utils/event-listeners.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.event = void 0;

const addListener = (what, el, cb) => {
  const name = cb;
  el.addEventListener(what, cb);
  return {
    remove: () => el.removeEventListener(what, name)
  };
};

const event = canvas => ({
  scroll: cb => addListener("scroll", window, cb),
  resize: cb => addListener("resize", window, cb),
  click: cb => addListener("click", canvas.element, cb),
  mousedown: cb => addListener("mousedown", canvas.element, cb),
  mousemove: cb => addListener("mousemove", canvas.element, cb),
  mouseup: cb => addListener("mouseup", document.body, cb)
});

exports.event = event;
},{}],"src/lib/canvas/make-canvas.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeCanvas = exports.updCanvas = void 0;

const updCanvas = state => {
  const {
    top,
    left
  } = state.canvas.element.getBoundingClientRect(); // const { width, height } = getComputedStyle(state.canvas.element);

  state.canvas.pos = {
    x: left,
    y: top
  }; // state.canvas.width = parseInt(width, 0);
  // state.canvas.height = parseInt(height, 0);

  return state;
};

exports.updCanvas = updCanvas;

const makeCanvas = element => {
  const DPI = window.devicePixelRatio;
  const canvas = element.tagName === 'CANVAS' ? element : document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const bg = document.createElement('canvas');
  const fg = document.createElement('canvas');
  const {
    height,
    width
  } = getComputedStyle(element);
  canvas.width = bg.width = fg.width = parseInt(width, 0) * DPI;
  canvas.height = bg.height = fg.height = parseInt(height, 0) * DPI;
  canvas.style.width = bg.style.width = fg.style.width = parseInt(width, 0) + 'px';
  canvas.style.height = bg.style.height = fg.style.height = parseInt(height, 0) + 'px';

  if (element.tagName !== 'CANVAS') {
    element.appendChild(canvas);
  } // element.appendChild(bg)
  // element.appendChild(fg)


  const {
    top,
    left
  } = canvas.getBoundingClientRect();
  return {
    element: canvas,
    background: {
      canvas: bg,
      ctx: bg.getContext('2d')
    },
    foreground: {
      canvas: fg,
      ctx: fg.getContext('2d'),
      pos: {
        x: null,
        y: null
      }
    },
    ctx,
    pos: {
      x: left,
      y: top
    },
    width: canvas.width,
    height: canvas.height,
    DPI
  };
};

exports.makeCanvas = makeCanvas;
},{}],"src/lib/canvas/load-image.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadImage = void 0;

const loadImage = src => new Promise(resolve => {
  var image = new Image();

  image.onload = () => resolve({
    image,
    width: image.width,
    height: image.height
  });

  image.src = src;
});

exports.loadImage = loadImage;
},{}],"src/lib/core/make-puzzle.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makePuzzle = void 0;

const makePuzzle = (ps, img, attraction, container, size, draggable, onComplete) => {
  const {
    width,
    height
  } = getComputedStyle(container);
  const isPortrait = img.width < img.height;
  const DPI = window.devicePixelRatio;
  const scale = parseInt([isPortrait ? height : width], 0) / img[isPortrait ? "height" : "width"];
  return {
    timeStamp: Date.now(),
    done: false,
    cols: ps.x,
    rows: ps.y,
    width: img.width * scale * DPI,
    height: img.height * scale * DPI,
    attraction,
    scale,
    occupy: size,
    draggable,
    onComplete
  };
};

exports.makePuzzle = makePuzzle;
},{}],"src/utils/object-helpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.same = exports.removeNull = exports.isTruthy = void 0;

const isTruthy = prop => obj => obj[prop]; // rm keys with value null from obj


exports.isTruthy = isTruthy;

const removeNull = obj => {
  let newObj = {};
  Object.keys(obj).forEach(prop => {
    if (obj[prop] !== null) {
      newObj[prop] = obj[prop];
    }
  });
  return newObj;
};

exports.removeNull = removeNull;

const same = (val, prop) => obj => obj[val] === prop;

exports.same = same;
},{}],"src/utils/get-neighbors.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNeighbors = void 0;

var _objectHelpers = require("./object-helpers.js");

// calculates which pieces are next to given piece
// breaks if rows/cols are 1
const getNeighbors = (i, rows, cols) => {
  const slot = i + 1;
  const neighbors = {
    top: slot > cols ? i - cols : null,
    right: slot % cols !== 0 ? i + 1 : null,
    bottom: slot <= (rows - 1) * cols ? i + cols : null,
    left: slot % cols !== 1 ? i - 1 : null
  };
  return (0, _objectHelpers.removeNull)(neighbors);
};

exports.getNeighbors = getNeighbors;
},{"./object-helpers.js":"src/utils/object-helpers.js"}],"src/utils/sides.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nw = exports.sw = exports.isHorizontal = exports.isVertical = exports.opposite = exports.allSides = void 0;
const allSides = ["top", "right", "bottom", "left"];
exports.allSides = allSides;

const opposite = side => ({
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
})[side];

exports.opposite = opposite;

const isVertical = side => side === "top" || side === "bottom";

exports.isVertical = isVertical;

const isHorizontal = side => !isVertical(side);

exports.isHorizontal = isHorizontal;

const sw = side => side === "bottom" || side === "left";

exports.sw = sw;

const nw = side => side === "top" || side === "left";

exports.nw = nw;
},{}],"src/utils/bezier.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bezierInv = exports.bezier = void 0;

const bezier = (pieceSize = 100, knobSize = 100
/* knobPos = 20 */
) => {
  const scale = knobSize / 110;
  const middle = pieceSize / 2;
  return [{
    cx1: 0,
    cy1: 0,
    cx2: middle - scale * 10,
    cy2: scale * 5,
    ex: middle - scale * 13,
    ey: scale * 0
  }, // left shoulder
  {
    cx1: middle - scale * 13,
    cy1: scale * 0,
    cx2: middle - scale * 10,
    cy2: scale * -2,
    ex: middle - scale * 12,
    ey: scale * -5
  }, // left neck
  {
    cx1: middle - scale * 12,
    cy1: scale * -5,
    cx2: middle - scale * 30,
    cy2: scale * -30,
    ex: middle,
    ey: scale * -30
  }, // left head
  {
    cx1: middle,
    cy1: scale * -30,
    cx2: middle - scale * -30,
    cy2: scale * -31,
    ex: middle - scale * -12,
    ey: scale * -5
  }, // right head
  {
    cx1: middle - scale * -12,
    cy1: scale * -5,
    cx2: middle - scale * -10,
    cy2: scale * -2,
    ex: middle - scale * -13,
    ey: scale * 0
  }, // right neck
  {
    cx1: middle - scale * -13,
    cy1: scale * 0,
    cx2: middle - scale * -10,
    cy2: scale * 5,
    ex: pieceSize,
    ey: scale * 0
  } // right shoulder
  ];
};

exports.bezier = bezier;

const bezierInv = (b, y = 1) => b.map((bb, i) => ({
  cx1: bb.cx1 * y,
  cy1: bb.cy1 * -1,
  cx2: bb.cx2 * y,
  cy2: bb.cy2 * -1,
  ex: bb.ex * y,
  ey: bb.ey * -1
}));

exports.bezierInv = bezierInv;
},{}],"src/utils/random.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.random = void 0;

// random number 0 - 1, based on hash
const random = (hash = Math.random()) => (Math.cos(Math.sin((hash + 69) * 1337.1337) * 6669.1337) + 1) * 0.5;

exports.random = random;
},{}],"src/lib/core/make-shapes.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeShapes = void 0;

var _sides = require("./../../utils/sides.js");

var _bezier = require("./../../utils/bezier.js");

var _random = require("./../../utils/random.js");

const makeShapes = (acc, piece) => {
  const getNeighbor = id => acc.find(piece => piece.id === id);

  const neighborShape = (id, side) => getNeighbor(id) && getNeighbor(id).shapes && getNeighbor(id).shapes[(0, _sides.opposite)(side)]; // 'flat' if no neighbor


  const flatSides = ({
    neighbors
  }) => _sides.allSides.filter(side => !Object.keys(neighbors).includes(side)).reduce((acc, side) => ({
    [side]: "flat",
    ...acc
  }), {}); // a random- or an inverse bezier if the neighbor has a shape


  const shapedSides = ({
    neighbors,
    width,
    height
  }) => Object.keys(neighbors).reduce((acc, side) => ({
    [side]: neighborShape(neighbors[side], side) // neighbor has shape
    ? (0, _bezier.bezierInv)(neighborShape(neighbors[side], side)) // mirror that shape
    : (0, _random.random)() >= 0.5 // else 50/50
    ? (0, _bezier.bezier)((0, _sides.isVertical)(side) ? width : height, Math.min(width, height)) // be 'outy'
    : (0, _bezier.bezierInv)((0, _bezier.bezier)((0, _sides.isVertical)(side) ? width : height, Math.min(width, height))),
    // or 'inny
    ...acc
  }), {});

  const shapes = { ...shapedSides(piece),
    ...flatSides(piece)
  };
  return [{ ...piece,
    shapes
  }, ...acc];
};

exports.makeShapes = makeShapes;
},{"./../../utils/sides.js":"src/utils/sides.js","./../../utils/bezier.js":"src/utils/bezier.js","./../../utils/random.js":"src/utils/random.js"}],"src/lib/core/make-pieces.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makePieces = void 0;

var _getNeighbors = require("./../../utils/get-neighbors.js");

var _makeShapes = require("./make-shapes.js");

const makePieces = puzzle => {
  const piecesAmount = [...Array(puzzle.rows * puzzle.cols)];
  const width = puzzle.width / puzzle.cols * puzzle.occupy;
  const height = puzzle.height / puzzle.rows * puzzle.occupy;
  const pieces = piecesAmount.map((x, i) => ({
    id: i,
    orgPos: {
      x: i % puzzle.cols * width,
      y: Math.floor(i / puzzle.cols) * height
    },
    curPos: {
      x: 0,
      y: 0
    },
    width,
    height,
    neighbors: (0, _getNeighbors.getNeighbors)(i, puzzle.rows, puzzle.cols),
    active: false,
    // if clicked/dragged
    connections: [] // every other piece this one is snapped together with

  })).reduce(_makeShapes.makeShapes, []);
  return pieces;
};

exports.makePieces = makePieces;
},{"./../../utils/get-neighbors.js":"src/utils/get-neighbors.js","./make-shapes.js":"src/lib/core/make-shapes.js"}],"src/lib/core/shuffle.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shuffle = void 0;

var _random = require("./../../utils/random.js");

const shuffle = state => ({ ...state,
  pieces: state.pieces.map((piece, i) => ({ ...piece,
    connections: [],
    curPos: {
      x: (0, _random.random)() * (state.canvas.width - state.pieces[0].width),
      y: (0, _random.random)() * (state.canvas.height - state.pieces[0].height)
    }
  }))
});

exports.shuffle = shuffle;
},{"./../../utils/random.js":"src/utils/random.js"}],"src/utils/array-helpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sort = exports.mapReverse = exports.map = exports.reverse = exports.connectedFirst = exports.activeLast = exports.randomElement = exports.filterUniqe = exports.shuffle = void 0;
const {
  floor,
  random
} = Math;

const shuffle = xs => xs.map(x => [random(), x]).sort((x, y) => x[0] - y[0]).map(x => x[1]); // shallow filtering


exports.shuffle = shuffle;

const filterUniqe = xs => [...new Set(xs)];

exports.filterUniqe = filterUniqe;

const randomElement = xs => xs[floor(random() * xs.length)];

exports.randomElement = randomElement;

const activeLast = (x, y) => y.active ? -1 : 1;

exports.activeLast = activeLast;

const connectedFirst = (x, y) => x.connections.length > y.connections.length ? -1 : 1;

exports.connectedFirst = connectedFirst;

const reverse = xs => xs.slice(0).reverse();

exports.reverse = reverse;

const map = fn => xs => xs.map(fn);

exports.map = map;

const mapReverse = fn => xs => xs.reduceRight((acc, el, i, arr) => [...acc, fn(el, i, arr, acc)], []);

exports.mapReverse = mapReverse;

const sort = fn => xs => xs.sort(fn);

exports.sort = sort;
},{}],"src/lib/canvas/paint-piece.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.paintPiece = void 0;

var _sides = require("../../utils/sides.js");

const paintPiece = (state, customContext) => piece => {
  const {
    image
  } = state.image;
  const {
    ctx,
    DPI = 2
  } = customContext || state.canvas;
  const {
    scale,
    occupy
  } = state.puzzle;
  const shapeOffset = Math.max(piece.width, piece.height);
  ctx.save();
  ctx.beginPath();
  ctx.translate(piece.curPos.x, piece.curPos.y + piece.height);

  _sides.allSides.forEach(side => {
    drawSide(ctx, piece.shapes[side], {
      x: side === 'top' || side === 'bottom' ? -piece.height : -piece.width,
      y: side === 'top' || side === 'bottom' ? piece.width : piece.height
    });
  });

  ctx.closePath();
  ctx.clip();
  ctx.drawImage(image, // image
  (piece.orgPos.x - shapeOffset) / scale / DPI / occupy, // what part of image
  (piece.orgPos.y - shapeOffset) / scale / DPI / occupy, // what part of image
  (piece.width + shapeOffset * 2) / scale / DPI / occupy, // how much of image
  (piece.height + shapeOffset * 2) / scale / DPI / occupy, // how much of image
  piece.curPos.x / state.canvas.width - shapeOffset, // where on canvas
  piece.curPos.y / state.canvas.height - shapeOffset - piece.height, // where on canvas
  piece.width + shapeOffset * 2, // how big on canvas
  piece.height + shapeOffset * 2 // how big on canvas
  );
  ctx.restore();
  const highlight = !state.puzzle.done && (piece.active || piece.alsoActive);
  ctx.shadowColor = highlight ? 'rgba(100, 100, 100, 1)' : 'rgba(50, 50, 50, 1)';
  ctx.strokeStyle = highlight ? 'rgba(225, 225, 225, 1)' : 'rgba(220, 220, 220, 1)';
  ctx.shadowBlur = highlight ? 2 : 1;
  ctx.lineWidth = highlight ? 2 : 1;
  ctx.shadowOffsetX = ctx.shadowOffsetY = -1;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
};

exports.paintPiece = paintPiece;

function drawSide(ctx, side, size) {
  ctx.translate(0, size.x);

  if (side === 'flat') {
    ctx.lineTo(size.y, 0);
  } else {
    side.forEach(b => {
      ctx.bezierCurveTo(b.cx1, b.cy1, b.cx2, b.cy2, b.ex, b.ey);
    });
  }

  ctx.rotate(Math.PI / 2);
}
},{"../../utils/sides.js":"src/utils/sides.js"}],"src/lib/canvas/clear-canvas.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearCanvas = void 0;

const clearCanvas = (state, ctx) => {
  ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
  return ctx;
};

exports.clearCanvas = clearCanvas;
},{}],"src/lib/canvas/paint-layers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.paintLayers = void 0;

var _arrayHelpers = require("../../utils/array-helpers");

var _paintPiece = require("./paint-piece");

const paintLayers = state => {
  state.canvas.ctx.drawImage(state.canvas.background.canvas, 0, 0); //   state.canvas.ctx.drawImage(
  //     state.canvas.foreground.canvas,
  //     state.canvas.foreground.pos.x * state.canvas.DPI,
  //     state.canvas.foreground.pos.y * state.canvas.DPI
  //   )

  const activePieces = state.pieces.filter(({
    active
  }) => active);
  (0, _arrayHelpers.map)((0, _paintPiece.paintPiece)(state))(activePieces);
};

exports.paintLayers = paintLayers;
},{"../../utils/array-helpers":"src/utils/array-helpers.js","./paint-piece":"src/lib/canvas/paint-piece.js"}],"src/lib/canvas/paint.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.paint = void 0;

var _arrayHelpers = require("../../utils/array-helpers.js");

var _tap = require("../../utils/tap.js");

var _paintPiece = require("./paint-piece.js");

var _clearCanvas = require("./clear-canvas.js");

var _paintLayers = require("./paint-layers.js");

// export const paint = (state) => ({
//   ...state,
//   canvas: {
//     ...state.canvas,
//     ctx: clearCanvas(state, state.canvas.ctx),
//   },
//   pieces: map(tap(paintPiece(state)))(state.pieces),
// });
const paint = (0, _tap.tap)(state => {
  (0, _clearCanvas.clearCanvas)(state, state.canvas.ctx);
  (0, _paintLayers.paintLayers)(state); // state.pieces = map(tap(paintPiece(state)))(state.pieces)
});
exports.paint = paint;
},{"../../utils/array-helpers.js":"src/utils/array-helpers.js","../../utils/tap.js":"src/utils/tap.js","./paint-piece.js":"src/lib/canvas/paint-piece.js","./clear-canvas.js":"src/lib/canvas/clear-canvas.js","./paint-layers.js":"src/lib/canvas/paint-layers.js"}],"src/utils/run-if.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runIf = void 0;

// ex. runIf(console.log)(true)('foo') -> prints 'foo'
// ex. runIf(console.log)(false)('bar') -> returns 'bar'
// ex. runIf(console.log)(x => x === 'bar'))('bar') -> prints 'bar'
const runIf = fn => x => y => (typeof x === "function" ? x(y) : x) ? fn(y) : y;

exports.runIf = runIf;
},{}],"src/utils/is-under-cursor.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isUnderCursor = exports.isWithinY = exports.isWithinX = void 0;

const isWithinX = (state, piece, e) => (e.clientX - state.canvas.pos.x) * state.canvas.DPI >= piece.curPos.x && (e.clientX - state.canvas.pos.x) * state.canvas.DPI <= piece.curPos.x + piece.width;

exports.isWithinX = isWithinX;

const isWithinY = (state, piece, e) => (e.clientY - state.canvas.pos.y) * state.canvas.DPI >= piece.curPos.y && (e.clientY - state.canvas.pos.y) * state.canvas.DPI <= piece.curPos.y + piece.height;

exports.isWithinY = isWithinY;

const isUnderCursor = (state, piece, e) => isWithinX(state, piece, e) && isWithinY(state, piece, e);

exports.isUnderCursor = isUnderCursor;
},{}],"src/lib/core/activate.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.activate = void 0;

var _arrayHelpers = require("../../utils/array-helpers.js");

var _objectHelpers = require("../../utils/object-helpers.js");

var _runIf = require("../../utils/run-if.js");

var _pipe = require("../../utils/pipe.js");

var _isUnderCursor = require("../../utils/is-under-cursor.js");

const getPiecePos = (state, piece, e) => ({
  x: (e.clientX - state.canvas.pos.x) * state.canvas.DPI - piece.curPos.x,
  y: (e.clientY - state.canvas.pos.y) * state.canvas.DPI - piece.curPos.y
}); // pieces gets painted bottom to top, we need to check in reverse order


const activate = e => state => ({ ...state,
  pieces: (0, _pipe.pipe)( // activate clicked piece (first occurence)
  (0, _arrayHelpers.mapReverse)((piece, i, arr, acc) => ({ ...piece,
    active: !acc.find((0, _objectHelpers.isTruthy)("active")) && (0, _isUnderCursor.isUnderCursor)(state, piece, e) ? getPiecePos(state, piece, e) : false
  })), (0, _arrayHelpers.mapReverse)((piece, i, arr) => ({ ...piece,
    // activate the active piece's connections
    active: arr.find(p => p.active && p.connections.includes(piece.id)) ? getPiecePos(state, piece, e) : // activate all pieces if none was clicked (and puzzle is draggable)
    !arr.find((0, _objectHelpers.isTruthy)("active")) && state.puzzle.draggable ? getPiecePos(state, piece, e) : piece.active
  })), // put the active piece(s) on top
  // if puzzle isn't done or not all pieces are active (puzzle dragged)
  (0, _runIf.runIf)((0, _arrayHelpers.sort)(_arrayHelpers.activeLast))(ps => !state.puzzle.done && ps.filter(p => p.active).length !== state.pieces.length))(state.pieces)
});

exports.activate = activate;
},{"../../utils/array-helpers.js":"src/utils/array-helpers.js","../../utils/object-helpers.js":"src/utils/object-helpers.js","../../utils/run-if.js":"src/utils/run-if.js","../../utils/pipe.js":"src/utils/pipe.js","../../utils/is-under-cursor.js":"src/utils/is-under-cursor.js"}],"src/lib/core/deactivate.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deactivate = void 0;

const deactivate = state => ({ ...state,
  pieces: state.pieces // .sort(connectedFirst)
  .map(piece => ({ ...piece,
    active: false
  }))
});

exports.deactivate = deactivate;
},{}],"src/lib/core/move.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.move = void 0;

const move = ({
  clientX,
  clientY
}) => state => ({ ...state,
  pieces: state.pieces.map(piece => ({ ...piece,
    curPos: piece.active ? {
      x: (clientX - state.canvas.pos.x) * state.canvas.DPI - piece.active.x,
      y: (clientY - state.canvas.pos.y) * state.canvas.DPI - piece.active.y
    } : piece.curPos
  }))
});

exports.move = move;
},{}],"src/lib/core/share-connections.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shareConnections = void 0;

var _arrayHelpers = require("./../../utils/array-helpers.js");

// should return, not modify
const shareConnections = (state, piece, newPiece) => {
  piece.connections = (0, _arrayHelpers.filterUniqe)([piece.id, newPiece.id, ...piece.connections, ...newPiece.connections]);
  piece.connections.forEach(id => {
    const connection = state.pieces.find(piece => piece.id === id);
    connection.connections = (0, _arrayHelpers.filterUniqe)(piece.connections);
  });
  newPiece.connections.forEach(id => {
    const connection = state.pieces.find(piece => piece.id === id);
    connection.connections = (0, _arrayHelpers.filterUniqe)(piece.connections);
  });
};

exports.shareConnections = shareConnections;
},{"./../../utils/array-helpers.js":"src/utils/array-helpers.js"}],"src/lib/core/is-close.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isClose = void 0;

var _sides = require("./../../utils/sides.js");

// is piece1 close to piece2
const isClose = (p1, p2, state, side) => {
  const {
    attraction
  } = state.puzzle;
  const XY = (0, _sides.isVertical)(side) ? "y" : "x";
  const invXY = XY === "x" ? "y" : "x";
  const positive = (0, _sides.nw)(side) ? false : true;
  const size = p1[XY === "y" ? "height" : "width"];
  const offset = positive ? p2.curPos[XY] + size : p2.curPos[XY] - size;
  return p1.curPos[XY] <= offset + attraction && p1.curPos[XY] >= offset - attraction && p1.curPos[invXY] <= p2.curPos[invXY] + attraction && p1.curPos[invXY] >= p2.curPos[invXY] - attraction;
};

exports.isClose = isClose;
},{"./../../utils/sides.js":"src/utils/sides.js"}],"src/lib/core/snap.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.snap = void 0;

var _shareConnections = require("./share-connections.js");

var _isClose = require("./is-close.js");

var _objectHelpers = require("./../../utils/object-helpers.js");

const moveConnections = (state, [...pieceIds], distance) => {
  pieceIds.forEach(id => {
    const piece = state.pieces.find((0, _objectHelpers.same)("id", id));
    piece.curPos = {
      x: piece.curPos.x + distance.x,
      y: piece.curPos.y + distance.y
    };
  });
}; // export const snapNew = (state) => ({
//   ...state,
//   pieces: state.pieces.map((piece) => ({
//     ...piece,
//     curPos:
//       !piece.active ||
//       !Object.entries(piece.neighbors).find(([side, id]) =>
//         isClose(state.pieces.find(same("id", id)), piece, state, side)
//       )
//         ? piece.curPos
//         : { x: 10, y: 20 }
//   }))
// });


const snap = state => {
  const activePieces = state.pieces.filter(piece => piece.active);

  if (!activePieces.length || activePieces.length === state.pieces.length) {
    return state;
  }

  activePieces.forEach(piece => {
    Object.entries(piece.neighbors).forEach(([side, id]) => {
      const neighbor = state.pieces.find((0, _objectHelpers.same)("id", id));

      if ((0, _isClose.isClose)(neighbor, piece, state, side)) {
        const newPos = {
          x: neighbor.curPos.x + (side === "right" ? -neighbor.width : side === "left" ? +neighbor.width : 0),
          y: neighbor.curPos.y + (side === "top" ? neighbor.height : side === "bottom" ? -neighbor.height : 0)
        }; // order is important

        moveConnections(state, piece.connections, {
          x: newPos.x - piece.curPos.x,
          y: newPos.y - piece.curPos.y
        });
        piece.curPos = newPos; // piece.connections = neighbor.connections = shareConnections(state, piece, neighbor);

        (0, _shareConnections.shareConnections)(state, piece, neighbor);
      }
    });
  });
  return state;
};

exports.snap = snap;
},{"./share-connections.js":"src/lib/core/share-connections.js","./is-close.js":"src/lib/core/is-close.js","./../../utils/object-helpers.js":"src/utils/object-helpers.js"}],"src/lib/core/status.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.status = void 0;

const status = state => {
  if (state.pieces[0].connections.length === state.puzzle.rows * state.puzzle.cols && !state.puzzle.done) {
    state.puzzle.done = true;
    state.puzzle.onComplete(state);
  }

  return state;
};

exports.status = status;
},{}],"src/lib/core/gather.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gather = void 0;

const gather = state => {
  /**
   * map pieces and move them onto the board after window resize
   */
  state.pieces = state.pieces.map(piece => ({ ...piece,
    curPos: {
      x: piece.curPos.x - piece.width > state.canvas.width * state.canvas.DPI ? state.canvas.width - piece.width : piece.curPos.x,
      y: piece.curPos.y - piece.height > state.canvas.height * state.canvas.DPI ? state.canvas.height - piece.height : piece.curPos.y
    }
  }));
  return state;
};

exports.gather = gather;
},{}],"src/lib/core/clone.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clone = void 0;

const clone = state => ({
  image: state.image,
  canvas: state.canvas,
  pieces: JSON.parse(JSON.stringify(state.pieces)),
  puzzle: JSON.parse(JSON.stringify(state.puzzle))
});

exports.clone = clone;
},{}],"src/lib/canvas/make-layers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeLayers = void 0;

var _paintPiece = require("./paint-piece.js");

var _clearCanvas = require("./clear-canvas.js");

var _arrayHelpers = require("../../utils/array-helpers.js");

var _tap = require("../../utils/tap.js");

const makeLayers = (0, _tap.tap)(state => {
  state.canvas.background.ctx = (0, _clearCanvas.clearCanvas)(state, state.canvas.background.ctx);
  state.canvas.foreground.ctx = (0, _clearCanvas.clearCanvas)(state, state.canvas.foreground.ctx);
  (0, _arrayHelpers.map)((0, _paintPiece.paintPiece)(state, {
    ctx: state.canvas.background.ctx
  }))(state.pieces.filter(({
    active
  }) => !active));
  (0, _arrayHelpers.map)((0, _paintPiece.paintPiece)(state, {
    ctx: state.canvas.foreground.ctx
  }))(state.pieces.filter(({
    active
  }) => active));
});
exports.makeLayers = makeLayers;
},{"./paint-piece.js":"src/lib/canvas/paint-piece.js","./clear-canvas.js":"src/lib/canvas/clear-canvas.js","../../utils/array-helpers.js":"src/utils/array-helpers.js","../../utils/tap.js":"src/utils/tap.js"}],"src/lib/canvas/cursor.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setCursor = exports.getCursor = void 0;

var _isUnderCursor = require("../../utils/is-under-cursor.js");

var _tap = require("../../utils/tap.js");

const getCursor = e => (0, _tap.tap)(state => {
  const hovered = state.pieces.find(piece => (0, _isUnderCursor.isUnderCursor)(state, piece, e));
  const active = state.pieces.find(piece => piece.active);
  const allActive = state.pieces.every(piece => piece.active);

  if (active && !allActive) {
    state.canvas.cursor = 'grabbing';
    return;
  }

  if (hovered && !active) {
    state.canvas.cursor = 'grab';
    return;
  }

  if (state.puzzle.draggable) {
    state.canvas.cursor = 'move';
    return;
  }
});

exports.getCursor = getCursor;
const setCursor = (0, _tap.tap)(state => {
  state.canvas.element.style.cursor = state.canvas.cursor;
});
exports.setCursor = setCursor;
},{"../../utils/is-under-cursor.js":"src/utils/is-under-cursor.js","../../utils/tap.js":"src/utils/tap.js"}],"src/lib/core/move-foreground.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.moveForeground = void 0;

var _tap = require("./../../utils/tap.js");

const moveForeground = ({
  clientX,
  clientY
}) => (0, _tap.tap)(state => {
  state.canvas.foreground.pos = {
    x: (clientX - state.canvas.pos.x) * state.canvas.DPI - state.canvas.foreground.pos.x,
    y: (clientY - state.canvas.pos.y) * state.canvas.DPI - state.canvas.foreground.pos.y
  };
});

exports.moveForeground = moveForeground;
},{"./../../utils/tap.js":"src/utils/tap.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.puzzle = void 0;

var _dom = require("./utils/dom.js");

var _pipe = require("./utils/pipe.js");

var _tap = require("./utils/tap.js");

var _eventListeners = require("./utils/event-listeners.js");

var _makeCanvas = require("./lib/canvas/make-canvas.js");

var _loadImage = require("./lib/canvas/load-image.js");

var _makePuzzle = require("./lib/core/make-puzzle.js");

var _makePieces = require("./lib/core/make-pieces.js");

var _shuffle = require("./lib/core/shuffle.js");

var _paint = require("./lib/canvas/paint.js");

var _activate = require("./lib/core/activate.js");

var _deactivate = require("./lib/core/deactivate.js");

var _move = require("./lib/core/move.js");

var _snap = require("./lib/core/snap.js");

var _status = require("./lib/core/status.js");

var _gather = require("./lib/core/gather.js");

var _clone = require("./lib/core/clone.js");

var _makeLayers = require("./lib/canvas/make-layers.js");

var _cursor = require("./lib/canvas/cursor.js");

var _moveForeground = require("./lib/core/move-foreground.js");

const puzzle = async ({
  element,
  restore = {},
  image: img = '',
  pieces: ps = {
    x: 6,
    y: 4
  },
  attraction = 20,
  size = 0.8,
  draggable = false,
  onComplete = () => {},
  onChange: changecb = () => {}
}) => {
  // game board
  const container = typeof element === 'string' ? (0, _dom.$)(element) : element;

  if (!container) {
    console.warn(`Couldn't find element: ${element}`);
    return;
  } // initial setup ---------------------------------------------


  const canvas = (0, _makeCanvas.makeCanvas)(container);
  const image = restore.image || (await (0, _loadImage.loadImage)(img));

  const puzzle = () => restore.puzzle || (0, _makePuzzle.makePuzzle)(ps, image, attraction, container, size, draggable, onComplete);

  const pieces = restore.pieces || (0, _makePieces.makePieces)(puzzle()); // passed on-change callback ---------------------------------

  const onChange = typeof changecb === 'function' && (0, _tap.tap)((0, _pipe.pipe)(_clone.clone, changecb)); // initial state ---------------------------------------------

  const initState = () => ({
    image,
    canvas,
    pieces,
    puzzle: puzzle()
  }); // 'global' game state ---------------------------------------


  let state = initState(); // initial paint ---------------------------------------------

  state = restore.puzzle ? (0, _pipe.pipe)(_paint.paint)(state) : (0, _pipe.pipe)(_shuffle.shuffle, _makeLayers.makeLayers, _paint.paint)(state); // user interactions -----------------------------------------

  const eventListeners = [(0, _eventListeners.event)(window).resize(e => state = (0, _pipe.pipe)(_makeCanvas.updCanvas, _gather.gather, _paint.paint)(state)), (0, _eventListeners.event)(window).scroll(e => state = (0, _pipe.pipe)(_makeCanvas.updCanvas)(state)), (0, _eventListeners.event)(state.canvas).mousedown(e => state = (0, _pipe.pipe)((0, _activate.activate)(e), (0, _cursor.getCursor)(e), _cursor.setCursor, _makeLayers.makeLayers, _paint.paint)(state)), (0, _eventListeners.event)(state.canvas).mousemove(e => {
    state = (0, _pipe.pipe)((0, _cursor.getCursor)(e), (0, _move.move)(e), (0, _moveForeground.moveForeground)(e), _paint.paint, _cursor.setCursor)(state);
  }), (0, _eventListeners.event)(document.body).mouseup(e => state = (0, _pipe.pipe)(_snap.snap, _deactivate.deactivate, _makeLayers.makeLayers, (0, _cursor.getCursor)(e), _paint.paint, _cursor.setCursor, onChange, _status.status)(state))]; // exposed api -----------------------------------------------

  return {
    newGame: () => state = (0, _pipe.pipe)(_shuffle.shuffle, _paint.paint)(initState()),
    getState: () => (0, _clone.clone)(state),
    setState: newState => state = (0, _pipe.pipe)(_clone.clone, _paint.paint)(newState),
    update: () => state = (0, _pipe.pipe)(_makeCanvas.updCanvas, _paint.paint)(state),
    destroy: () => {
      if (element.tagName !== 'CANVAS') {
        state.canvas.element.remove();
      }

      state = null;
      eventListeners.map(listener => listener.remove());
    }
  };
};

exports.puzzle = puzzle;
var _default = puzzle;
exports.default = _default;
},{"./utils/dom.js":"src/utils/dom.js","./utils/pipe.js":"src/utils/pipe.js","./utils/tap.js":"src/utils/tap.js","./utils/event-listeners.js":"src/utils/event-listeners.js","./lib/canvas/make-canvas.js":"src/lib/canvas/make-canvas.js","./lib/canvas/load-image.js":"src/lib/canvas/load-image.js","./lib/core/make-puzzle.js":"src/lib/core/make-puzzle.js","./lib/core/make-pieces.js":"src/lib/core/make-pieces.js","./lib/core/shuffle.js":"src/lib/core/shuffle.js","./lib/canvas/paint.js":"src/lib/canvas/paint.js","./lib/core/activate.js":"src/lib/core/activate.js","./lib/core/deactivate.js":"src/lib/core/deactivate.js","./lib/core/move.js":"src/lib/core/move.js","./lib/core/snap.js":"src/lib/core/snap.js","./lib/core/status.js":"src/lib/core/status.js","./lib/core/gather.js":"src/lib/core/gather.js","./lib/core/clone.js":"src/lib/core/clone.js","./lib/canvas/make-layers.js":"src/lib/canvas/make-layers.js","./lib/canvas/cursor.js":"src/lib/canvas/cursor.js","./lib/core/move-foreground.js":"src/lib/core/move-foreground.js"}],"demo.js":[function(require,module,exports) {
"use strict";

var _index = require("./src/index.js");

var _dom = require("./src/utils/dom.js");

const init = async () => {
  const solution = (0, _dom.$)("#solution");
  const newGame = (0, _dom.$)("#new-game");
  const saveGame = (0, _dom.$)("#save-game");
  const loadGame = (0, _dom.$)("#load-game");
  const source = (0, _dom.$)("#source");
  const X = (0, _dom.$)("#x");
  const Y = (0, _dom.$)("#y");
  const images = ['https://artsourceinternational.com/wp-content/uploads/2018/04/WOR0006.jpg'];

  const onComplete = state => {
    const done = (0, _dom.$)("#done");
    done.innerHTML = `Done! In ${((Date.now() - state.puzzle.timeStamp) / 1000).toFixed(1)}s`;
    done.style.display = "block";
  };

  const onChange = state => {};

  const options = {
    element: "#app",
    image: images[Math.floor(Date.now() / 1000 % images.length)],
    pieces: {
      x: 50,
      y: 40
    },
    attraction: 40,
    size: 0.8,
    draggable: true,
    onComplete,
    onChange
  };
  let saveFile = {};
  let image = options.image;
  let pieces = options.pieces;
  solution.src = image;
  X.value = options.pieces.x;
  Y.value = options.pieces.y;
  source.value = options.image;
  let p = await (0, _index.puzzle)(options);
  newGame.addEventListener("click", async () => p.newGame());
  saveGame.addEventListener("click", () => {
    saveFile = p.getState();
  });
  loadGame.addEventListener("click", () => p.setState(saveFile));
  source.addEventListener("change", async e => {
    image = e.target.value;
    p.destroy();
    p = await (0, _index.puzzle)({ ...options,
      image
    });
    solution.src = image;
  });
  X.addEventListener("change", async e => {
    if (e.target.value < 2) return;
    pieces = { ...pieces,
      x: parseInt(e.target.value, 0)
    };
    p.destroy();
    p = await (0, _index.puzzle)({ ...options,
      image,
      pieces
    });
  });
  Y.addEventListener("change", async e => {
    if (e.target.value < 2) return;
    pieces = { ...pieces,
      y: parseInt(e.target.value, 0)
    };
    p.destroy();
    p = await (0, _index.puzzle)({ ...options,
      image,
      pieces
    });
  });
};

init();
},{"./src/index.js":"src/index.js","./src/utils/dom.js":"src/utils/dom.js"}],"../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62699" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","demo.js"], null)
//# sourceMappingURL=/demo.d3b53871.js.map