import PaystackPop from '@paystack/inline-js'

// Two ways to take payment. Pick one with .env (see README):
//
//  1. Browser mode (default): the browser opens Paystack with your PUBLIC key. Fine for test mode and demos.
//     Nothing stops a visitor from editing the amount, so do not ship real orders on this alone.
//
//  2. Server mode (VITE_USE_SERVER=true): api/initialize.js works out the price on the server and api/verify.js
//     confirms the payment with your SECRET key before the order counts. Use this when you go live.
export const PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || ''
export const SERVER_MODE = import.meta.env.VITE_USE_SERVER === 'true'
const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export const paymentsReady = SERVER_MODE || PUBLIC_KEY.startsWith('pk_')
export const isTestKey = PUBLIC_KEY.startsWith('pk_test_')

const newReference = () => `FC-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase()

async function post(path, body) {
  const res = await fetch(`${API}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  let data = {}
  try {
    data = await res.json()
  } catch {
    /* non-JSON error page */
  }
  if (!res.ok) throw new Error(data.error || 'The payment server did not respond. Please try again.')
  return data
}

// order = { customer: { name, email, phone, address, city, state, note }, items: [{ id, size, qty }], priced }
export async function startPayment(order, { onSuccess, onCancel, onError }) {
  const popup = new PaystackPop()
  const { customer, items, priced } = order
  const [firstName, ...rest] = customer.name.trim().split(/\s+/)

  if (SERVER_MODE) {
    const { access_code: accessCode } = await post('/api/initialize', { customer, items })
    popup.resumeTransaction(accessCode, {
      onSuccess: (t) => onSuccess(t.reference),
      onCancel,
      onError: (e) => onError(new Error(e?.message || 'Payment could not start.')),
    })
    return
  }

  const reference = newReference()
  popup.newTransaction({
    key: PUBLIC_KEY,
    email: customer.email,
    amount: priced.kobo,
    currency: 'NGN',
    reference,
    firstName,
    lastName: rest.join(' '),
    phone: customer.phone,
    metadata: {
      custom_fields: [
        { display_name: 'Phone', variable_name: 'phone', value: customer.phone },
        { display_name: 'Delivery', variable_name: 'delivery', value: `${customer.address}, ${customer.city}, ${customer.state}` },
        { display_name: 'Items', variable_name: 'items', value: priced.lines.map((l) => `${l.qty} x ${l.title} (${l.size})`).join('; ') },
        { display_name: 'Notes', variable_name: 'notes', value: customer.note || 'None' },
      ],
    },
    onSuccess: (t) => onSuccess(t.reference || reference),
    onCancel,
    onError: (e) => onError(new Error(e?.message || 'Payment could not start.')),
  })
}

// Server mode only: ask our server to confirm with Paystack that the money arrived and matches the cart.
export async function verifyPayment(reference, order) {
  if (!SERVER_MODE) return { ok: true, unverified: true }
  try {
    const data = await post('/api/verify', { reference, customer: order.customer, items: order.items })
    return { ok: Boolean(data.ok) }
  } catch {
    return { ok: false }
  }
}
