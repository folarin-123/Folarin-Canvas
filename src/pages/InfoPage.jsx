import { useState } from 'react'
import { BRAND, SHIPPING } from '../data/site.js'
import { formatMoney } from '../context/ShopContext.jsx'
import { validEmail } from '../utils/shade.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import NotFound from './NotFound.jsx'

function ContactForm() {
  const [message, setMessage] = useState('')
  function onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const ok = validEmail(String(data.get('email') || '').trim()) && String(data.get('name') || '').trim() && String(data.get('message') || '').trim()
    setMessage(ok ? 'Thanks, your message is ready to send. (Demo: connect this form to your inbox.)' : 'Fill in your name, a valid email and a message.')
    if (ok) form.reset()
  }
  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="field"><label htmlFor="c-name">Name</label><input id="c-name" name="name" autoComplete="name" required /></div>
      <div className="field"><label htmlFor="c-email">Email</label><input id="c-email" name="email" type="email" autoComplete="email" required /></div>
      <div className="field"><label htmlFor="c-msg">Message</label><textarea id="c-msg" name="message" rows="5" required /></div>
      <button className="btn" type="submit">Send message</button>
      <p className="form-msg note" role="status" aria-live="polite">{message}</p>
    </form>
  )
}

const note = (what) => <p className="note">Placeholder text. Replace it with your own {what} before launch.</p>

const PAGES = {
  contact: { title: 'Get in touch', body: () => (<><p>Questions about an order or a product? Send a message.</p><ContactForm /></>) },
  'shipping-and-returns': {
    title: 'Shipping and returns',
    body: () => (
      <>
        <h2>Delivery</h2>
        <p>Every piece is made to order and ships within 7 to 10 working days. Delivery is {formatMoney(SHIPPING.lagos, 'NGN')} in Lagos and {formatMoney(SHIPPING.other, 'NGN')} to other states, and free on orders of {formatMoney(SHIPPING.freeOver, 'NGN')} or more.</p>
        <h2>Returns and remakes</h2>
        <p>Because pieces are cut to your measurements, we cannot take back items made to your size unless they are faulty or not as ordered. If that happens, tell us within 7 days of delivery and we will remake or refund.</p>
        {note('policy')}
      </>
    ),
  },
  'our-promise': {
    title: 'Our promise',
    body: () => (
      <>
        <p>Every piece is checked by hand before it leaves us. If something is wrong when it arrives, tell us and we will put it right.</p>
        {note('promise')}
      </>
    ),
  },
  'privacy-policy': {
    title: 'Privacy policy',
    body: () => (
      <>
        <p>We collect only what we need to take and ship your order and, if you sign up, to send you the mailing list. Payments are processed by Paystack, so we never see or store your card details.</p>
        {note('privacy policy')}
      </>
    ),
  },
}

export default function InfoPage({ slug }) {
  const page = PAGES[slug]
  useDocumentTitle(`${page ? page.title : 'Not found'} | ${BRAND}`)
  if (!page) return <NotFound />
  return (
    <article className="page">
      <h1>{page.title}</h1>
      {page.body()}
    </article>
  )
}
