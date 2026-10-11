// Pure pricing rules shared by cart and checkout.
import { byId, sizesFor } from './catalog.js'
import { NIGERIAN_STATES, SHIPPING } from './site.js'

export function shippingFee(state, subtotal) {
  if (subtotal >= SHIPPING.freeOver) return 0
  return state === 'Lagos' ? SHIPPING.lagos : SHIPPING.other
}

export function cartSubtotal(items) {
  return items.reduce((sum, i) => sum + (byId(i.id)?.price || 0) * i.qty, 0)
}

// Validates a list of { id, size, qty } and returns totals in naira.
export function priceOrder(items, state) {
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) return { ok: false, error: 'Your cart is empty.' }
  if (!NIGERIAN_STATES.includes(state)) return { ok: false, error: 'Choose a delivery state.' }
  const lines = []
  for (const item of items) {
    const p = byId(item?.id)
    const qty = Number(item?.qty)
    if (!p) return { ok: false, error: 'An item in your cart is no longer available.' }
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) return { ok: false, error: 'Invalid quantity.' }
    if (!sizesFor(p).includes(item.size)) return { ok: false, error: `Choose a size for ${p.title}.` }
    lines.push({ id: p.id, title: p.title, size: item.size, qty, unit: p.price, total: p.price * qty })
  }
  const subtotal = lines.reduce((s, l) => s + l.total, 0)
  const shipping = shippingFee(state, subtotal)
  const total = subtotal + shipping
  return { ok: true, lines, subtotal, shipping, total }
}
