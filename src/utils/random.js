// random number 0 - 1, based on hash
export const random = (hash = Math.random()) =>
  (Math.cos(Math.sin((hash + 69) * 1337.1337) * 6669.1337) + 1) * 0.5;
