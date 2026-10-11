import { BRAND, SOCIALS } from '../data/site.js'
import CurrencySwitcher from './CurrencySwitcher.jsx'
import CookieSettingsButton from './CookieSettingsButton.jsx'
import { whatsappLink } from '../utils/whatsapp.js'
import { SocialIcon, WhatsAppIcon } from './Icons.jsx'
import { useReveal } from '../hooks/useReveal.js'

export default function Footer() {
  const year = new Date().getFullYear()
  const brandRef = useReveal()
  const helpRef = useReveal()
  const socialRef = useReveal()
  return (
    <footer className="site-footer">
      <div className="wrap foot">
        <div className="reveal" ref={brandRef}>
          <a className="wordmark" href="#/">{BRAND}</a>
          <p>Trousers, skirts, kaftans and traditional wear, made to order.</p>
        </div>
        <nav className="reveal" ref={helpRef} aria-label="Help">
          <h2>Help</h2>
          <ul>
            <li><a href="#/about">About me</a></li>
            <li><a href="#/page/contact">Get in touch</a></li>
            <li><a href="#/page/shipping-and-returns">Shipping and returns</a></li>
            <li><a href="#/page/our-promise">Our promise</a></li>
            <li><a href="#/page/privacy-policy">Privacy policy</a></li>
            <li><a href="#/page/cookie-policy">Cookie policy</a></li>
            <li><CookieSettingsButton /></li>
          </ul>
        </nav>
        <nav className="reveal" ref={socialRef} aria-label="Social">
          <h2>Follow</h2>
          <ul>
            <li><a className="footer-social-link" href={whatsappLink(`Hello ${BRAND}, I have a question.`)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> WhatsApp</a></li>
            {SOCIALS.map((s) => (
              <li key={s.id}>
                <a className="footer-social-link" href={s.href} target="_blank" rel="noopener noreferrer"><SocialIcon id={s.id} /> {s.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="wrap footer-currency">
        <CurrencySwitcher variant="pills" />
      </div>
      <div className="wrap legal">&copy; {year} {BRAND}. Orders and payments handled on WhatsApp.</div>
    </footer>
  )
}
