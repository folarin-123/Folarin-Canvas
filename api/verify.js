// Vercel serverless function. Confirms with Paystack that a payment really succeeded for the right amount.
// Treat an order as paid only when this returns { ok: true }. For fulfilment, also add a Paystack webhook (see README).
import { priceOrder } from '../src/data/pricing.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) return res.status(500).json({ error: 'PAYSTACK_SECRET_KEY is not set on the server.' })

  const { reference, customer = {}, items } = req.body || {}
  if (typeof reference !== 'string' || !/^[A-Za-z0-9._=-]{6,100}$/.test(reference)) return res.status(400).json({ error: 'Invalid reference.' })
  const priced = priceOrder(items, customer.state)
  if (!priced.ok) return res.status(400).json({ error: priced.error })

  const r = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` },
  })
  const data = await r.json().catch(() => ({}))
  const t = data?.data
  const ok = Boolean(r.ok && data.status && t && t.status === 'success' && t.currency === 'NGN' && t.amount === priced.kobo)
  return res.status(200).json({ ok, reference })
}
