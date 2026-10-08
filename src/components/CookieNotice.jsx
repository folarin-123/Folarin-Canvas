import { useEffect, useState } from 'react'
import { hasConsent, saveConsent } from '../utils/consent.js'

export default function CookieNotice() {
  const [open, setOpen] = useState(() => !hasConsent('essential'))
  const [error, setError] = useState('')

  useEffect(() => {
    const reopen = () => {
      setError('')
      setOpen(true)
    }
    window.addEventListener('fc:open-cookie-settings', reopen)
    return () => window.removeEventListener('fc:open-cookie-settings', reopen)
  }, [])

  function choose(choice) {
    if (!saveConsent(choice)) {
      setError('Your browser could not save this choice. Check your storage settings and try again.')
      return
    }
    setError('')
    setOpen(false)
  }

  if (!open) return null

  return (
    <section className="cookie-notice" role="region" aria-label="Cookie and storage choices">
      <div className="cookie-copy">
        <p>We use essential browser storage for your cart and currency. Paystack may use its own cookies when you pay. There are no analytics or advertising cookies.</p>
        <a href="#/page/cookie-policy">Cookie policy</a>
        {error && <p className="cookie-error" role="status" aria-live="polite">{error}</p>}
      </div>
      <div className="cookie-actions">
        <button className="btn cookie-choice" type="button" onClick={() => choose('all')}>Accept all</button>
        <button className="btn cookie-choice" type="button" onClick={() => choose('essential')}>Essential only</button>
      </div>
    </section>
  )
}
