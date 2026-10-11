import { BRAND } from '../data/site.js'
import { useShop } from '../context/ShopContext.jsx'
import { whatsappLink } from '../utils/whatsapp.js'
import { WhatsAppIcon } from './Icons.jsx'

export default function FloatingWhatsApp() {
  const { drawerOpen, checkoutOpen, toast } = useShop()
  if (drawerOpen || checkoutOpen || toast) return null

  return (
    <a
      className="whatsapp-float"
      href={whatsappLink(`Hello ${BRAND}, I have a question.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Folarin’s Canvas on WhatsApp"
    >
      <WhatsAppIcon />
    </a>
  )
}
