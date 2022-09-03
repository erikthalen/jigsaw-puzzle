// shallow filtering
export const filterUnique = xs => [...new Set(xs)]
export const activeLast = (x, y) => (y.active ? -1 : 1)
export const map = fn => xs => xs.map(fn)
export const mapReverse = fn => xs =>
  xs.reduceRight((acc, el, i, arr) => [...acc, fn(el, i, arr, acc)], [])
export const sort = fn => xs => xs.sort(fn)

export function shuffleArray(array) {
  const suffled = [...array]
  let counter = suffled.length

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter)

    // Decrease counter by 1
    counter--

    // And swap the last element with it
    let temp = suffled[counter]
    suffled[counter] = suffled[index]
    suffled[index] = temp
  }

  return suffled
}
