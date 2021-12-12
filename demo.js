import { puzzle } from "./src/index.js";
import { $ } from "./src/utils/dom.js";

const init = async () => {
  const solution = $("#solution");
  const newGame = $("#new-game");
  const saveGame = $("#save-game");
  const loadGame = $("#load-game");
  const source = $("#source");
  const X = $("#x");
  const Y = $("#y");

  const images = [
    'https://artsourceinternational.com/wp-content/uploads/2018/04/WOR0006.jpg',
  ]

  const onComplete = (state) => {
    const done = $("#done");
    done.innerHTML = `Done! In ${(
      (Date.now() - state.puzzle.timeStamp) /
      1000
    ).toFixed(1)}s`;
    done.style.display = "block";
  };

  const onChange = (state) => {};

  const options = {
    element: "#app",
    image: images[Math.floor((Date.now() / 1000) % images.length)],
    pieces: { x: 3, y: 2 },
    attraction: 40,
    size: 0.8,
    draggable: true,
    aligned: false,
    onComplete,
    onChange,
  };

  let saveFile = {};
  let image = options.image;
  let pieces = options.pieces;
  solution.src = image;
  X.value = options.pieces.x;
  Y.value = options.pieces.y;
  source.value = options.image;

  let p = await puzzle(options);

  newGame.addEventListener("click", async () => p.newGame());
  saveGame.addEventListener("click", () => {
    saveFile = p.getState();
  });
  loadGame.addEventListener("click", () => p.setState(saveFile));
  source.addEventListener("change", async (e) => {
    image = e.target.value;
    p.destroy();
    p = await puzzle({ ...options, image });
    solution.src = image;
  });
  X.addEventListener("change", async (e) => {
    if (e.target.value < 2) return;
    pieces = { ...pieces, x: parseInt(e.target.value, 0) };
    p.destroy();
    p = await puzzle({ ...options, image, pieces });
  });
  Y.addEventListener("change", async (e) => {
    if (e.target.value < 2) return;
    pieces = { ...pieces, y: parseInt(e.target.value, 0) };
    p.destroy();
    p = await puzzle({ ...options, image, pieces });
  });
};

init();
