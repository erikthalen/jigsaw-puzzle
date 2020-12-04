const { floor, random } = Math;

export const shuffle = (xs) =>
  xs
    .map((x) => [random(), x])
    .sort((x, y) => x[0] - y[0])
    .map((x) => x[1]);

// shallow filtering
export const filterUniqe = (xs) => [...new Set(xs)];
export const randomElement = (xs) => xs[floor(random() * xs.length)];
export const activeLast = (x, y) => (y.active ? -1 : 1);
export const connectedFirst = (x, y) =>
  x.connections.length > y.connections.length ? -1 : 1;
export const reverse = (xs) => xs.slice(0).reverse();
export const map = (fn) => (xs) => xs.map(fn);
export const mapReverse = (fn) => (xs) =>
  xs.reduceRight((acc, el, i, arr) => [...acc, fn(el, i, arr, acc)], []);

export const sort = (fn) => (xs) => xs.sort(fn);
