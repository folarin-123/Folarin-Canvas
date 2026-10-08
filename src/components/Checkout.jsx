import { useEffect, useRef, useState } from 'react'
import { byId } from '../data/catalog.js'
import { NIGERIAN_STATES, SHIPPING } from '../data/site.js'
import { priceOrder, shippingFee, validEmail, validPhone } from '../data/pricing.js'
import { formatMoney, useShop } from '../context/ShopContext.jsx'
import { isTestKey, paymentsReady, startPayment, verifyPayment, SERVER_MODE } from '../payments/paystack.js'
import Money from './Money.jsx'

const naira = (n) => formatMoney(n, 'NGN')
const EMPTY = { name: '', email: '', phone: '', address: '', city: '', state: '', note: '' }

export default function Checkout() {
  const { cart, subtotal, checkoutOpen, closeCheckout, clearCart, openCart } = useShop()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [done, setDone] = useState(null) // { reference, verified, lines, total, name }
  const dialogRef = useRef(null)
  const closeRef = useRef(null)

  // Focus handling while the dialog is open: move focus in, trap Tab, close on Escape, lock page scroll.
  useEffect(() => {
    if (!checkoutOpen) return undefined
    const previous = document.activeElement
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape' && !busy) {
        closeCheckout()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const items = [...dialogRef.current.querySelectorAll('button:not([disabled]),a[href],input,select,textarea')].filter((n) => n.offsetParent !== null)
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      if (previous && previous.focus) previous.focus()
    }
  }, [checkoutOpen, closeCheckout, busy])

  // Forget a finished order once the dialog is closed.
  useEffect(() => {
    if (!checkoutOpen && done) {
      setDone(null)
      setForm(EMPTY)
    }
  }, [checkoutOpen, done])

  if (!checkoutOpen) return null

  const set = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }))
  const fee = form.state ? shippingFee(form.state, subtotal) : null
  const total = fee === null ? null : subtotal + fee

  function validate() {
    const e = {}
    if (form.name.trim().split(/\s+/).filter(Boolean).length < 1 || form.name.trim().length < 2) e.name = 'Enter your full name.'
    if (!validEmail(form.email.trim())) e.email = 'Enter a valid email, like name@example.com.'
    if (!validPhone(form.phone)) e.phone = 'Enter a Nigerian phone number, like 0803 123 4567.'
    if (form.address.trim().length < 6) e.address = 'Enter your delivery address.'
    if (!form.city.trim()) e.city = 'Enter your city or town.'
    if (!form.state) e.state = 'Choose your state.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function onSubmit(ev) {
    ev.preventDefault()
    setNotice('')
    if (!validate()) return
    const customer = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()]))
    const items = cart.map(({ id, size, qty }) => ({ id, size, qty }))
    const priced = priceOrder(items, customer.state)
    if (!priced.ok) {
      setNotice(priced.error)
      return
    }
    const order = { customer, items, priced }
    setBusy(true)
    try {
      await startPayment(order, {
        onSuccess: async (reference) => {
          try {
            const check = await verifyPayment(reference, order)
            setDone({ reference, verified: check.ok, lines: priced.lines, total: priced.total, name: customer.name.split(' ')[0] })
            if (check.ok) clearCart()
          } catch {
            setDone({ reference, verified: false, lines: priced.lines, total: priced.total, name: customer.name.split(' ')[0] })
          } finally {
            setBusy(false)
          }
        },
        onCancel: () => {
          setBusy(false)
          setNotice('Payment cancelled. Your cart is still here.')
        },
        onError: (err) => {
          setBusy(false)
          setNotice(err.message)
        },
      })
    } catch (err) {
      setBusy(false)
      setNotice(err.message || 'Something went wrong. Please try again.')
    }
  }

  const err = (name) => (errors[name] ? <span className="ferr" id={`e-${name}`}>{errors[name]}</span> : null)
  const inv = (name) => ({ 'aria-invalid': errors[name] ? true : undefined, 'aria-describedby': errors[name] ? `e-${name}` : undefined })

  return (
    <>
      <div className="backdrop show" onClick={() => !busy && closeCheckout()} />
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="co-title" ref={dialogRef}>
        <div className="drawer-head">
          <h2 id="co-title">{done ? (done.verified ? 'Thank you' : 'Payment status pending') : 'Checkout'}</h2>
          <button className="x" ref={closeRef} onClick={closeCheckout} disabled={busy}>Close</button>
        </div>

        {done ? (
          <div className="co-body">
            <p>
              {done.verified
                ? `Thank you, ${done.name}. Your order is confirmed and we have started on it.`
                : `Thank you, ${done.name}. We could not verify this payment with the server, so your order is not confirmed yet.`}
            </p>
            {!done.verified && <p className="notice">Do not pay again yet. Keep this reference and contact us so we can check the payment status.</p>}
            <dl className="facts co-facts">
              <div><dt>Reference</dt><dd>{done.reference}</dd></div>
              <div><dt>{done.verified ? 'Paid' : 'Order total'}</dt><dd><Money amount={done.total} currency="NGN" /></dd></div>
            </dl>
            <ul className="co-lines">
              {done.lines.map((l) => <li key={l.id + l.size}>{l.qty} × {l.title} <span>({l.size})</span></li>)}
            </ul>
            <p className="note">Paystack emails your receipt. Pieces are made to order and ship in 7 to 10 working days.</p>
            <button className="btn block" onClick={closeCheckout}>Continue shopping</button>
          </div>
        ) : cart.length === 0 ? (
          <div className="co-body"><p>Your cart is empty.</p><a className="btn" href="#/collection/all-products" onClick={closeCheckout}>Shop all</a></div>
        ) : (
          <form className="co-body" onSubmit={onSubmit} noValidate>
            {!paymentsReady && (
              <p className="notice" role="alert">
                {import.meta.env.PROD
                  ? 'Online payments are disabled until server-side payment verification is configured.'
                  : <>Payments are not set up yet. Add <code>VITE_PAYSTACK_PUBLIC_KEY</code> to a <code>.env</code> file and restart (see the README).</>}
              </p>
            )}
            {paymentsReady && isTestKey && !SERVER_MODE && <p className="notice">Test mode: no real money moves. Use Paystack’s test card.</p>}

            <fieldset>
              <legend>Contact</legend>
              <div className="field"><label htmlFor="co-name">Full name</label><input id="co-name" autoComplete="name" value={form.name} onChange={set('name')} {...inv('name')} />{err('name')}</div>
              <div className="field"><label htmlFor="co-email">Email</label><input id="co-email" type="email" autoComplete="email" value={form.email} onChange={set('email')} {...inv('email')} />{err('email')}</div>
              <div className="field"><label htmlFor="co-phone">Phone</label><input id="co-phone" type="tel" autoComplete="tel" placeholder="0803 123 4567" value={form.phone} onChange={set('phone')} {...inv('phone')} />{err('phone')}</div>
            </fieldset>

            <fieldset>
              <legend>Delivery</legend>
              <div className="field"><label htmlFor="co-address">Address</label><input id="co-address" autoComplete="street-address" value={form.address} onChange={set('address')} {...inv('address')} />{err('address')}</div>
              <div className="two">
                <div className="field"><label htmlFor="co-city">City or town</label><input id="co-city" autoComplete="address-level2" value={form.city} onChange={set('city')} {...inv('city')} />{err('city')}</div>
                <div className="field">
                  <label htmlFor="co-state">State</label>
                  <select id="co-state" value={form.state} onChange={set('state')} {...inv('state')}>
                    <option value="">Choose</option>
                    {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {err('state')}
                </div>
              </div>
              <div className="field">
                <label htmlFor="co-note">Measurements or notes (optional)</label>
                <textarea id="co-note" rows="3" placeholder="Bust, waist, hip, length, or anything we should know" value={form.note} onChange={set('note')} />
              </div>
            </fieldset>

            <div className="co-summary" aria-live="polite">
              <ul className="co-lines">
                {cart.map((i) => {
                  const p = byId(i.id)
                  return <li key={i.id + i.size}><span className="co-line-name">{i.qty} × {p.title} <span>({i.size})</span></span><b><Money amount={p.price * i.qty} currency="NGN" /></b></li>
                })}
              </ul>
              <div className="sub-row"><span>Subtotal</span><span><Money amount={subtotal} currency="NGN" /></span></div>
              <div className="sub-row light"><span>Delivery</span><span>{fee === null ? 'Choose a state' : fee === 0 ? 'Free' : <Money amount={fee} currency="NGN" />}</span></div>
              <div className="sub-row big"><span>Total</span><span><Money amount={total === null ? subtotal : total} currency="NGN" /></span></div>
              <small>Free delivery over {naira(SHIPPING.freeOver)}. You pay in naira (₦) by card, bank transfer or USSD on the next screen.</small>
            </div>

            {notice && <p className="notice" role="alert">{notice}</p>}
            <p className="co-policy">By placing your order, you acknowledge our <a href="#/page/privacy-policy">Privacy policy</a> and <a href="#/page/cookie-policy">Cookie policy</a>.</p>
            <button className="btn block pay-button" type="submit" disabled={busy || !paymentsReady}>
              {busy ? 'Opening Paystack…' : `Pay ${naira(total === null ? subtotal : total)} with Paystack`}
            </button>
            <button type="button" className="x back-cart" onClick={() => { closeCheckout(); openCart() }} disabled={busy}>Back to cart</button>
          </form>
        )}
      </div>
    </>
  )
}
