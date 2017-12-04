export function createRange(min, max) {
  const range = []
  for (let val = min; val < max + 1; val++) {
    range.push(val)
  }
  return range
}
