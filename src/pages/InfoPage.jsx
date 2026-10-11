import { useState } from 'react'
import { BRAND, EMAIL, SHIPPING, WHATSAPP_NUMBER, LEAD_TIME_TEXT } from '../data/site.js'
import { validEmail } from '../utils/validators.js'
import { whatsappLink } from '../utils/whatsapp.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import Money from '../components/Money.jsx'
import CookieSettingsButton from '../components/CookieSettingsButton.jsx'
import { WhatsAppIcon } from '../components/Icons.jsx'
import NotFound from './NotFound.jsx'

function ContactForm() {
  const [message, setMessage] = useState('')
  const [whatsappHref, setWhatsappHref] = useState('')
  function onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const text = String(data.get('message') || '').trim()
    const ok = validEmail(email) && name && text
    if (!ok) {
      setMessage('Fill in your name, a valid email and a message.')
      setWhatsappHref('')
      return
    }
    const href = whatsappLink(`Hello Folarin’s Canvas, my name is ${name}.\n\n${text}\n\nYou can reply to me at ${email}.`)
    setWhatsappHref(href)
    setMessage('Opening WhatsApp with your message. If it does not open, use the link below.')
    window.open(href, '_blank', 'noopener,noreferrer')
  }
  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="field"><label htmlFor="c-name">Name</label><input id="c-name" name="name" autoComplete="name" required /></div>
      <div className="field"><label htmlFor="c-email">Email</label><input id="c-email" name="email" type="email" autoComplete="email" required /></div>
      <div className="field"><label htmlFor="c-msg">Message</label><textarea id="c-msg" name="message" rows="5" required /></div>
      <button className="btn" type="submit"><WhatsAppIcon /> Send message on WhatsApp</button>
      <p className="note">Prefer email? <a href={`mailto:${EMAIL}`}>{EMAIL}</a> · WhatsApp: +{WHATSAPP_NUMBER.replace(/^(\d{3})(\d{3})(\d{3})(\d{4})$/, '$1 $2 $3 $4')}</p>
      {whatsappHref && <p><a className="btn-line" href={whatsappHref} target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> Open WhatsApp message</a></p>}
      <p className="form-msg note" role="status" aria-live="polite">{message}</p>
    </form>
  )
}

const PAGES = {
  contact: { title: 'Get in touch', body: () => (<><p>Questions about an order or a product? Send a message.</p><ContactForm /></>) },
  'shipping-and-returns': {
    title: 'Shipping and returns',
    body: () => (
      <>
        <h2>Delivery</h2>
        <p>Every piece is made to order and ships within {LEAD_TIME_TEXT}. Delivery is <Money amount={SHIPPING.lagos} currency="NGN" /> in Lagos and <Money amount={SHIPPING.other} currency="NGN" /> to other states, and free on orders of <Money amount={SHIPPING.freeOver} currency="NGN" /> or more. Your final delivery fee is confirmed with you on WhatsApp before payment.</p>
        <h2>Returns and remakes</h2>
        <p>If an item is faulty or differs from what you ordered, contact us within 7 days of delivery so we can arrange a remake or another appropriate resolution.</p>
      </>
    ),
  },
  'our-promise': {
    title: 'Our promise',
    body: () => (
      <>
        <p>Every piece is checked by hand before it leaves us. If something is wrong when it arrives, tell us and we will put it right.</p>
        <p>We make each order with care, confirm details with you before production, and stay available to help with delivery or fit questions.</p>
      </>
    ),
  },
  'privacy-policy': {
    title: 'Privacy policy',
    body: () => (
      <>
        <p>Last updated: 10 October 2026</p>
        <h2>Who we are</h2>
        <p>Folarin’s Canvas is a Nigerian fashion label run by Folarin Peace Omowunmi. We handle your personal information in line with the Nigeria Data Protection Act 2023 (NDPA). Contact us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>

        <h2>What we collect and why</h2>
        <ul>
          <li><strong>Orders:</strong> your name, email if provided, phone number, delivery address, order details and measurements you choose to send, so we can confirm, make and deliver your order. You choose what to share with us through WhatsApp.</li>
          <li><strong>Measurements:</strong> any body measurements or notes you choose to provide, so we can make your garment to size.</li>
          <li><strong>Contact messages:</strong> your name, email and message so we can reply in WhatsApp or by email.</li>
          <li><strong>WhatsApp updates:</strong> your WhatsApp contact and request for updates, if you ask us to include you.</li>
          <li><strong>Browser storage:</strong> cart contents and your chosen currency are stored locally on your device to keep the shop working as you expect.</li>
        </ul>

        <h2>Our legal bases</h2>
        <p>We process order and delivery details to perform our contract with you. We use consent for mailing-list messages and any optional future analytics or advertising. We may rely on legitimate interests to answer enquiries, protect the shop and improve its services, while respecting your rights.</p>

        <h2>Who we share information with</h2>
        <p>Order details you choose to send are shared with the business through WhatsApp, a Meta service with its own privacy practices. Payment is arranged directly with the seller. Vercel hosts this website and may process technical information needed to provide that service. We share delivery details with delivery partners when needed to fulfil an order.</p>

        <h2>How long we keep it</h2>
        <p>We keep order and payment records only as long as needed to fulfil orders, handle support and meet legal or accounting obligations. We keep contact messages until the enquiry is resolved and for a reasonable follow-up period. Mailing-list details remain until you unsubscribe or withdraw consent. Measurements are kept only while needed to make and support your order, then deleted when no longer necessary.</p>

        <h2>International transfers</h2>
        <p>Some service providers may process information outside Nigeria. Where personal data is transferred internationally, we use the safeguards and protections required by the NDPA.</p>

        <h2>Security</h2>
        <p>We use reasonable technical and organisational measures to protect personal information. No online service can guarantee absolute security, so please contact us promptly if you have a concern.</p>

        <h2>Your rights</h2>
        <p>Subject to the NDPA, you may request access to or correction or deletion of your personal data, object to certain processing, or withdraw consent where processing relies on consent. Contact <a href={`mailto:${EMAIL}`}>{EMAIL}</a> to make a request. You may also complain to the Nigeria Data Protection Commission.</p>

        <h2>Children</h2>
        <p>This shop is not intended for children under 18, and we do not knowingly collect their personal data. If you believe a child has provided information, contact us so we can remove it.</p>

        <h2>Changes to this policy</h2>
        <p>We may update this policy as our services or legal obligations change. The latest version and its update date will appear on this page.</p>
      </>
    ),
  },
  'cookie-policy': {
    title: 'Cookie policy',
    body: () => (
      <>
        <p>Last updated: 10 October 2026</p>
        <p>Cookies are small files a website or service can store in your browser. Local storage is browser storage that keeps information on your device between visits. We use local storage for essential shop features. We do not currently use analytics or advertising.</p>

        <h2>What this site uses</h2>
        <div className="policy-table-wrap">
          <table className="policy-table">
            <thead>
              <tr><th scope="col">Name</th><th scope="col">Purpose</th><th scope="col">Duration</th><th scope="col">Essential?</th></tr>
            </thead>
            <tbody>
              <tr><td><code>fc:cart</code></td><td>Remembers cart items.</td><td>Until browser storage is cleared.</td><td>Yes</td></tr>
              <tr><td><code>fc:currency</code></td><td>Remembers your chosen display currency.</td><td>Until browser storage is cleared.</td><td>Yes</td></tr>
              <tr><td><code>fc:consent</code></td><td>Remembers your cookie choice, version and choice date.</td><td>Until you change it or clear browser storage.</td><td>Yes</td></tr>
              <tr><td>fc:pending-order</td><td>Keeps an order message available so you can resend it after a refresh.</td><td>Until you mark the order as sent or clear browser storage.</td><td>Yes</td></tr>
              <tr><td><code>fc:profile</code></td><td>Remembers your name, phone and delivery details to speed up future orders. You can forget these details in checkout.</td><td>Until you forget them or clear browser storage.</td><td>Yes</td></tr>
            </tbody>
          </table>
        </div>

        <h2>Third parties</h2>
        <p>If you choose to open WhatsApp, order details you send are processed by Meta under WhatsApp’s own privacy practices. Payment is arranged directly with the seller; this website does not collect payment card data.</p>

        <h2>Change or withdraw your choice</h2>
        <p>Choose “Essential only” to decline optional uses, or “Accept all” to allow any optional categories we may add later. There are no analytics or advertising tools on the site now. Use <CookieSettingsButton /> in the footer to reopen your choice. You can also clear this site’s local storage and cookies in your browser settings; essential cart and currency preferences will then be forgotten.</p>
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
