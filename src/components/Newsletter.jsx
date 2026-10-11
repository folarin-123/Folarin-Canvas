import { BRAND } from '../data/site.js'
import { whatsappLink } from '../utils/whatsapp.js'
import { WhatsAppIcon } from './Icons.jsx'

export default function Newsletter() {
  return (
    <section className="news" aria-labelledby="news-title">
      <div className="wrap">
        <h2 id="news-title">Order updates and new fabrics on WhatsApp</h2>
        <p>Ask to hear about new fabrics, restocks and offers.</p>
        <a className="btn" href={whatsappLink(`Hello ${BRAND}, please add me to your updates list.`)} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon /> Message us on WhatsApp
        </a>
      </div>
    </section>
  )
}
