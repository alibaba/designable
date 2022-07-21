export function precision(v: number, dot = 4) {
  return parseFloat(v.toPrecision(dot))
}
