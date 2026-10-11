// Lighten (positive amount) or darken (negative amount) a #rrggbb colour.
export function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16)
  let r = n >> 16
  let g = (n >> 8) & 255
  let b = n & 255
  const target = amount < 0 ? 0 : 255
  const p = Math.abs(amount)
  r = Math.round((target - r) * p + r)
  g = Math.round((target - g) * p + g)
  b = Math.round((target - b) * p + b)
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
}
