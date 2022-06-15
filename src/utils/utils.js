export const tap = fn => x => {
  fn(x)
  return x
}

// random number 0 - 1, based on hash
export const random = (hash = Math.random()) =>
  (Math.cos(Math.sin((hash + 69) * 1337.1337) * 6669.1337) + 1) * 0.5

// ex. runIf(console.log)(true)('foo') -> prints 'foo'
// ex. runIf(console.log)(false)('bar') -> returns 'bar'
// ex. runIf(console.log)(x => x === 'bar'))('bar') -> prints 'bar'
export const runIf = fn => x => y =>
  (typeof x === 'function' ? x(y) : x) ? fn(y) : y

export const pipe =
  (...fns) =>
  x =>
    [...fns].reduce((acc, f) => f(acc), x)

export const clamp = (min, val, max) => Math.max(Math.min(val, max), min)
