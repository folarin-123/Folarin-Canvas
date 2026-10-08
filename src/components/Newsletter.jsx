import { useState } from 'react'
import { validEmail } from '../utils/shade.js'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  function onSubmit(e) {
    e.preventDefault()
    if (validEmail(email.trim())) {
      setMessage('Thanks, you are on the list. (Demo: connect this form to your email provider.)')
      setEmail('')
    } else {
      setMessage('Enter a valid email address, for example name@example.com.')
    }
  }

  return (
    <section className="news" aria-labelledby="news-title">
      <div className="wrap">
        <h2 id="news-title">Mailing list</h2>
        <p>Early access to new fabrics, restocks and offers.</p>
        <form className="news-form" onSubmit={onSubmit} noValidate>
          <label className="sr" htmlFor="news-email">Email</label>
          <input id="news-email" type="email" placeholder="Email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="btn" type="submit">Subscribe</button>
        </form>
        <p className="form-msg" role="status" aria-live="polite">{message}</p>
      </div>
    </section>
  )
}
