import { BRAND, whatsappLink } from '../data/site.js'
import { formatMoney } from '../context/ShopContext.jsx'

export { whatsappLink }

export function buildOrderMessage({ ref, customer, priced }) {
  const note = String(customer.note || '').trim().slice(0, 300) || "I'll send my measurements here"
  const itemLines = priced.lines.map((line, index) => (
    `${index + 1}. ${line.title} (${line.size}) x ${line.qty} - ${formatMoney(line.total, 'NGN')}`
  ))
  const header = [
    `Hello ${BRAND} 👋 I'd like to place an order.`,
    '',
    `Order ref: ${ref}`,
    `Name: ${customer.name}`,
    customer.email ? `Email: ${customer.email}` : '',
    `Phone: ${customer.phone}`,
    `Delivery: ${customer.address}, ${customer.city}, ${customer.state}`,
    '',
    'Items:',
  ].filter(Boolean)
  const totals = [
    '',
    `Subtotal: ${formatMoney(priced.subtotal, 'NGN')}`,
    `Delivery (estimate): ${priced.shipping === 0 ? 'Free' : formatMoney(priced.shipping, 'NGN')}`,
    `Total: ${formatMoney(priced.total, 'NGN')}`,
    '',
    `Measurements / notes: ${note}`,
  ]
  const message = [...header, ...itemLines, ...totals].join('\n')
  if (message.length <= 1500) return message

  const compactLines = priced.lines.map((line, index) => (
    `${index + 1}. ${line.qty}x ${line.title} (${line.size})`
  ))
  const compactMessage = [...header, ...compactLines, ...totals].join('\n')
  if (compactMessage.length <= 1500) return compactMessage

  const shortTotals = totals.slice(0, -1).concat(`Measurements / notes: ${note.slice(0, 100) || 'None'}`)
  const included = []
  for (const line of compactLines) {
    const candidate = [...header, ...included, line, `... ${compactLines.length - included.length - 1} more item lines are in cart`, ...shortTotals].join('\n')
    if (candidate.length > 1500) break
    included.push(line)
  }
  return [...header, ...included, `... see remaining items in cart (${priced.lines.length} lines total)`, ...shortTotals].join('\n').slice(0, 1500)
}

export const newOrderReference = () => `FC-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase()

export function whatsappLinkForProduct(product, size) {
  return whatsappLink(`Hi, I'd like to ask about the ${product.title} (${size}). ${window.location.href}`)
}
