import { useEffect, useRef, useState } from 'react'
import { byId } from '../data/catalog.js'
import { NIGERIAN_STATES, PAYMENT_NOTE, SHIPPING } from '../data/site.js'
import { priceOrder, shippingFee } from '../data/pricing.js'
import { formatMoney, useShop } from '../context/ShopContext.jsx'
import { buildOrderMessage, newOrderReference, whatsappLink } from '../utils/whatsapp.js'
import { validEmail, validPhone } from '../utils/validators.js'
import { WhatsAppIcon } from './Icons.jsx'
import Money from './Money.jsx'

const naira = (n) => formatMoney(n, 'NGN')
const EMPTY = { name: '', email: '', phone: '', address: '', city: '', state: '', note: '' }
const MEASUREMENTS_NOTE = "I'll send my measurements on WhatsApp"

export default function Checkout() {
  const {
    cart, subtotal, checkoutOpen, closeCheckout, clearCart, pendingOrder,
    savePendingOrder, clearPendingOrder, openCart, profile, saveProfile, clearProfile,
  } = useShop()
  const [form, setForm] = useState(() => ({ ...EMPTY, ...profile }))
  const [measurementsOnWhatsApp, setMeasurementsOnWhatsApp] = useState(false)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')
  const [reviewOrder, setReviewOrder] = useState(null)
  const [done, setDone] = useState(null)
  const [copied, setCopied] = useState(false)
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const previewRef = useRef(null)

  useEffect(() => {
    if (!checkoutOpen) return undefined
    const previous = document.activeElement
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') {
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
  }, [checkoutOpen, closeCheckout])

  useEffect(() => {
    if (!checkoutOpen && done) {
      setDone(null)
      setReviewOrder(null)
      setForm({ ...EMPTY, ...profile })
      setMeasurementsOnWhatsApp(false)
    }
  }, [checkoutOpen, done, profile])

  useEffect(() => {
    if (reviewOrder) previewRef.current?.focus()
  }, [reviewOrder])

  if (!checkoutOpen) return null

  const set = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }))
  const fee = form.state ? shippingFee(form.state, subtotal) : null
  const total = fee === null ? null : subtotal + fee

  function validate() {
    const nextErrors = {}
    if (form.name.trim().length < 2) nextErrors.name = 'Enter your full name.'
    if (form.email.trim() && !validEmail(form.email.trim())) nextErrors.email = 'Enter a valid email, like name@example.com.'
    if (!validPhone(form.phone)) nextErrors.phone = 'Enter a Nigerian phone number, like 0803 123 4567.'
    if (form.address.trim().length < 6) nextErrors.address = 'Enter your delivery address.'
    if (!form.city.trim()) nextErrors.city = 'Enter your city or town.'
    if (!form.state) nextErrors.state = 'Choose your state.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function onSubmit(ev) {
    ev.preventDefault()
    setNotice('')
    if (!validate()) return

    const customer = Object.fromEntries(Object.entries({
      ...form,
      note: measurementsOnWhatsApp ? MEASUREMENTS_NOTE : form.note,
    }).map(([key, value]) => [key, value.trim()]))
    const items = cart.map(({ id, size, qty }) => ({ id, size, qty }))
    const priced = priceOrder(items, customer.state)
    if (!priced.ok) {
      setNotice(priced.error)
      return
    }
    const order = {
      ref: newOrderReference(),
      customer,
      items,
      priced,
    }
    order.message = buildOrderMessage(order)
    if (!savePendingOrder(order)) {
      setNotice('Your browser could not save this order. Check your storage settings and try again.')
      return
    }
    setReviewOrder({ ...order, priced })
  }

  async function copyOrder() {
    const text = reviewOrder?.message || pendingOrder?.message
    if (!text) return
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        throw new Error('Clipboard API unavailable')
      }
    } catch {
      const input = document.createElement('textarea')
      input.value = text
      input.setAttribute('readonly', '')
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.append(input)
      input.select()
      const copiedSuccessfully = document.execCommand('copy')
      input.remove()
      if (!copiedSuccessfully) {
        setNotice('Could not copy the order details. You can select and copy them from the preview.')
        return
      }
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  function confirmSent(order) {
    if (!order) return
    if (!clearPendingOrder()) {
      setNotice('Your order was not marked as sent because this browser could not update local storage.')
      return
    }
    clearCart()
    const profileSaved = saveProfile(order.customer)
    setDone({ ref: order.ref, name: order.customer.name.trim().split(/\s+/)[0], profileSaved })
    setReviewOrder(null)
    setNotice('')
  }

  const err = (name) => (errors[name] ? <span className="ferr" id={`e-${name}`}>{errors[name]}</span> : null)
  const inv = (name) => ({ 'aria-invalid': errors[name] ? true : undefined, 'aria-describedby': errors[name] ? `e-${name}` : undefined })
  const activeOrder = reviewOrder || pendingOrder
  return (
    <>
      <div className="backdrop show" onClick={closeCheckout} />
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="co-title" ref={dialogRef}>
        <div className="drawer-head">
          <h2 id="co-title">{done ? 'Thank you' : reviewOrder ? 'Review your order' : 'Checkout on WhatsApp'}</h2>
          <button className="x" ref={closeRef} onClick={closeCheckout}>Close</button>
        </div>

        {done ? (
          <div className="co-body">
            <div className="thank-you-mark" aria-hidden="true">
              <svg viewBox="0 0 64 64" fill="none">
                <circle className="thank-you-ring" cx="32" cy="32" r="28" />
                <path className="thank-you-check" d="m19 33 9 9 18-20" />
              </svg>
            </div>
            <p>Thank you, {done.name}. Your order {done.ref} is waiting for us on WhatsApp. We’ll reply to confirm.</p>
            {!done.profileSaved && <p className="notice">Your order was marked as sent, but this browser could not save your contact details for next time.</p>}
            <button className="btn block" onClick={closeCheckout}>Continue shopping</button>
          </div>
        ) : cart.length === 0 && !activeOrder ? (
          <div className="co-body"><p>Your cart is empty.</p><a className="btn" href="#/collection/all-products" onClick={closeCheckout}>Shop all</a></div>
        ) : reviewOrder ? (
          <div className="co-body">
            {pendingOrder && (
              <p className="pending-order">A previous order is saved. You can resend it from <a href={whatsappLink(pendingOrder.message)} target="_blank" rel="noopener noreferrer">WhatsApp</a>.</p>
            )}
            <div className="co-summary">
              <ul className="co-lines">
                {reviewOrder.priced.lines.map((line) => (
                  <li key={line.id + line.size}><span>{line.qty} × {line.title} <span>({line.size})</span></span><b><Money amount={line.total} currency="NGN" /></b></li>
                ))}
              </ul>
              <div className="sub-row"><span>Subtotal</span><span><Money amount={reviewOrder.priced.subtotal} currency="NGN" /></span></div>
              <div className="sub-row light"><span>Delivery (estimate)</span><span>{reviewOrder.priced.shipping === 0 ? 'Free' : <Money amount={reviewOrder.priced.shipping} currency="NGN" />}</span></div>
              <div className="sub-row big"><span>Total</span><span><Money amount={reviewOrder.priced.total} currency="NGN" /></span></div>
            </div>
            <label className="message-label" htmlFor="order-message">Order message preview</label>
            <textarea id="order-message" className="order-preview" ref={previewRef} readOnly value={reviewOrder.message} rows={12} />
            <p className="notice">{PAYMENT_NOTE}</p>
            <a className="btn block whatsapp-send" href={whatsappLink(reviewOrder.message)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon /> Send order on WhatsApp
            </a>
            <button className={`btn-line block copy-button${copied ? ' copied' : ''}`} type="button" onClick={copyOrder}>{copied ? 'Copied' : 'Copy order details'}</button>
            <button className="x back-cart" type="button" onClick={() => setReviewOrder(null)}>Back to edit details</button>
            <button className="confirm-sent" type="button" onClick={() => confirmSent(reviewOrder)}>I’ve sent my order</button>
            {notice && <p className="notice" role="alert">{notice}</p>}
          </div>
        ) : (
          <form className="co-body" onSubmit={onSubmit} noValidate>
            {pendingOrder && (
              <p className="pending-order">You have an order in progress. <a href={whatsappLink(pendingOrder.message)} target="_blank" rel="noopener noreferrer">Resend your last order on WhatsApp</a>.</p>
            )}
            {profile && (
              <div className="saved-profile">
                <span>Your contact and delivery details are saved on this device.</span>
                <button type="button" className="link-button" onClick={() => {
                  if (!clearProfile()) {
                    setNotice('Your saved details could not be removed. Check this browser’s storage settings.')
                    return
                  }
                  setForm(EMPTY)
                  setNotice('Saved details forgotten.')
                }}>Forget my details</button>
              </div>
            )}
            <fieldset>
              <legend>Contact</legend>
              <div className="field"><label htmlFor="co-name">Full name</label><input id="co-name" autoComplete="name" value={form.name} onChange={set('name')} {...inv('name')} />{err('name')}</div>
              <div className="field"><label htmlFor="co-email">Email (optional)</label><input id="co-email" type="email" autoComplete="email" value={form.email} onChange={set('email')} {...inv('email')} />{err('email')}</div>
              <div className="field">
                <label htmlFor="co-phone">Phone</label>
                <input id="co-phone" type="tel" autoComplete="tel" placeholder="0803 123 4567" value={form.phone} onChange={set('phone')} {...inv('phone')} />
                <small>We’ll use this to confirm your order.</small>{err('phone')}
              </div>
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
                    {NIGERIAN_STATES.map((state) => <option key={state} value={state}>{state}</option>)}
                  </select>
                  {err('state')}
                </div>
              </div>
              <div className="field">
                <label htmlFor="co-note">Measurements or notes (optional)</label>
                <textarea id="co-note" rows="3" placeholder="Bust, waist, hip, length, or anything we should know" value={form.note} onChange={set('note')} />
              </div>
              <label className="check-field">
                <input
                  type="checkbox"
                  checked={measurementsOnWhatsApp}
                  onChange={(event) => {
                    setMeasurementsOnWhatsApp(event.target.checked)
                    if (event.target.checked) setForm((current) => ({ ...current, note: MEASUREMENTS_NOTE }))
                    else setForm((current) => ({ ...current, note: current.note === MEASUREMENTS_NOTE ? '' : current.note }))
                  }}
                />
                <span>I’ll send my measurements on WhatsApp</span>
              </label>
            </fieldset>

            <div className="co-summary" aria-live="polite">
              <ul className="co-lines">
                {cart.map((item) => {
                  const product = byId(item.id)
                  return <li key={item.id + item.size}><span className="co-line-name">{item.qty} × {product.title} <span>({item.size})</span></span><b><Money amount={product.price * item.qty} currency="NGN" /></b></li>
                })}
              </ul>
              <div className="sub-row"><span>Subtotal</span><span><Money amount={subtotal} currency="NGN" /></span></div>
              <div className="sub-row light"><span>Delivery (estimate)</span><span>{fee === null ? 'Choose a state' : fee === 0 ? 'Free' : <Money amount={fee} currency="NGN" />}</span></div>
              <div className="sub-row big"><span>Total</span><span><Money amount={total === null ? subtotal : total} currency="NGN" /></span></div>
              <small>Free delivery over {naira(SHIPPING.freeOver)}.</small>
            </div>

            {notice && <p className="notice" role="alert">{notice}</p>}
            <p className="co-policy">By placing your order, you acknowledge our <a href="#/page/privacy-policy">Privacy policy</a> and <a href="#/page/cookie-policy">Cookie policy</a>.</p>
            <button className="btn block pay-button" type="submit">Review order</button>
            <button type="button" className="x back-cart" onClick={() => { closeCheckout(); openCart() }}>Back to cart</button>
          </form>
        )}
      </div>
    </>
  )
}
