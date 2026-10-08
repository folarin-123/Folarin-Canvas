import { useEffect, useState } from 'react'
import { BRAND, SOCIALS } from '../data/site.js'

export default function Footer() {
  const [year, setYear] = useState('')
  useEffect(() => setYear(String(new Date().getFullYear())), [])
  return (
    <footer className="site-footer">
      <div className="wrap foot">
        <div>
          <a className="wordmark" href="#/">{BRAND}</a>
          <p>Trousers, skirts, kaftans and traditional wear, made to order.</p>
        </div>
        <nav aria-label="Help">
          <h2>Help</h2>
          <ul>
            <li><a href="#/about">About me</a></li>
            <li><a href="#/page/contact">Get in touch</a></li>
            <li><a href="#/page/shipping-and-returns">Shipping and returns</a></li>
            <li><a href="#/page/our-promise">Our promise</a></li>
            <li><a href="#/page/privacy-policy">Privacy policy</a></li>
            <li><a href="#/page/cookie-policy">Cookie policy</a></li>
            <li><a href="#cookie-settings" onClick={(event) => { event.preventDefault(); window.dispatchEvent(new Event('fc:open-cookie-settings')) }}>Cookie settings</a></li>
          </ul>
        </nav>
        <nav aria-label="Social">
          <h2>Follow</h2>
          <ul>
            {SOCIALS.map((s) => (
              <li key={s.id}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="wrap legal">&copy; {year} {BRAND}. Payments by Paystack. Prices in other currencies are indicative.</div>
    </footer>
  )
}
