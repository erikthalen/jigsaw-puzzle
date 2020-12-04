// ex. runIf(console.log)(true)('foo') -> prints 'foo'
// ex. runIf(console.log)(false)('bar') -> returns 'bar'
// ex. runIf(console.log)(x => x === 'bar'))('bar') -> prints 'bar'
export const runIf = (fn) => (x) => (y) =>
  (typeof x === "function" ? x(y) : x) ? fn(y) : y;
