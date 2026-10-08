// A button that looks like a link. Opens the cookie choices again (CookieNotice listens for this event).
export default function CookieSettingsButton({ className = 'link-button', children = 'Cookie settings' }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event('fc:open-cookie-settings'))}>
      {children}
    </button>
  )
}
