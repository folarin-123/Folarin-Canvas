// Vercel serverless function. Creates the Paystack transaction on the server so the price cannot be edited in the browser.
// Needs PAYSTACK_SECRET_KEY in the host's environment variables (never in the React code).
import { priceOrder, validEmail, validPhone } from '../src/data/pricing.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) return res.status(500).json({ error: 'PAYSTACK_SECRET_KEY is not set on the server.' })

  const { customer = {}, items } = req.body || {}
  if (!validEmail(String(customer.email || ''))) return res.status(400).json({ error: 'Enter a valid email.' })
  if (!validPhone(customer.phone || '')) return res.status(400).json({ error: 'Enter a valid Nigerian phone number.' })
  const priced = priceOrder(items, customer.state)
  if (!priced.ok) return res.status(400).json({ error: priced.error })

  const reference = `FC-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase()
  const r = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: customer.email,
      amount: priced.kobo,
      currency: 'NGN',
      reference,
      metadata: {
        custom_fields: [
          { display_name: 'Name', variable_name: 'name', value: String(customer.name || '') },
          { display_name: 'Phone', variable_name: 'phone', value: String(customer.phone) },
          { display_name: 'Delivery', variable_name: 'delivery', value: `${customer.address}, ${customer.city}, ${customer.state}` },
          { display_name: 'Items', variable_name: 'items', value: priced.lines.map((l) => `${l.qty} x ${l.title} (${l.size})`).join('; ') },
          { display_name: 'Notes', variable_name: 'notes', value: String(customer.note || 'None').slice(0, 500) },
        ],
      },
    }),
  })
  const data = await r.json().catch(() => ({}))
  if (!r.ok || !data.status) return res.status(502).json({ error: data.message || 'Paystack could not start the payment.' })
  return res.status(200).json({ access_code: data.data.access_code, reference: data.data.reference })
}
