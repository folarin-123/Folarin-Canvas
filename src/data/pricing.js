// Pure pricing rules with no React in them, so the browser AND the server (api/*.js) use the same maths.
import { byId, sizesFor } from './catalog.js'
import { NIGERIAN_STATES, SHIPPING } from './site.js'

export function shippingFee(state, subtotal) {
  if (subtotal >= SHIPPING.freeOver) return 0
  return state === 'Lagos' ? SHIPPING.lagos : SHIPPING.other
}

export function cartSubtotal(items) {
  return items.reduce((sum, i) => sum + (byId(i.id)?.price || 0) * i.qty, 0)
}

// Validates a list of { id, size, qty } and returns totals in naira (and kobo, which Paystack wants).
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
  return { ok: true, lines, subtotal, shipping, total, kobo: total * 100 }
}

export const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
// Accepts 0803 123 4567, 08031234567 and +234 803 123 4567.
export const validPhone = (v) => /^(\+234|234|0)[789][01]\d{8}$/.test(String(v).replace(/[\s-]/g, ''))
