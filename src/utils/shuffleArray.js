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
