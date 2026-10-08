import { SOCIALS, EMAIL } from '../data/site.js'
import { SocialIcon } from './Icons.jsx'

export default function SocialLinks({ withEmail = false }) {
  return (
    <ul className="social">
      {SOCIALS.map((s) => (
        <li key={s.id}>
          <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (${s.handle}), opens in a new tab`}>
            <SocialIcon id={s.id} />
            <span>{s.label}</span>
          </a>
        </li>
      ))}
      {withEmail && (
        <li>
          <a href={`mailto:${EMAIL}`} aria-label={`Email ${EMAIL}`}>
            <SocialIcon id="email" />
            <span>Email</span>
          </a>
        </li>
      )}
    </ul>
  )
}
