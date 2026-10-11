import { useEffect, useRef, useState } from 'react'
import { CATEGORIES } from '../data/catalog.js'
import { BRAND } from '../data/site.js'
import { useShop } from '../context/ShopContext.jsx'
import CurrencySwitcher from './CurrencySwitcher.jsx'

export default function Header({ routeKey }) {
  const { count, openCart } = useShop()
  const [navOpen, setNavOpen] = useState(false)
  const [compact, setCompact] = useState(false)
  const [cartBumped, setCartBumped] = useState(false)
  const sentinelRef = useRef(null)
  const menuButtonRef = useRef(null)
  const mobileNavRef = useRef(null)
  const currentRouteKey = useRef(routeKey)
  const previousCount = useRef(count)
  const bumpTimer = useRef(0)
  currentRouteKey.current = routeKey

  useEffect(() => {
    if (!sentinelRef.current || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(([entry]) => setCompact(!entry.isIntersecting), { rootMargin: '-24px 0px 0px 0px' })
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (count <= previousCount.current) {
      previousCount.current = count
      return undefined
    }
    previousCount.current = count
    setCartBumped(false)
    const frame = requestAnimationFrame(() => setCartBumped(true))
    clearTimeout(bumpTimer.current)
    bumpTimer.current = setTimeout(() => setCartBumped(false), 500)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(bumpTimer.current)
    }
  }, [count])

  // Close the menus whenever the page changes.
  useEffect(() => {
    setNavOpen(false)
  }, [routeKey])

  useEffect(() => {
    if (!navOpen) return undefined

    const scrollY = window.scrollY
    const previousBodyStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    }
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'

    const focusable = () => mobileNavRef.current?.querySelectorAll(
      'a[href], button:not([disabled]):not([tabindex="-1"])',
    ) ?? []
    const first = focusable()[0]
    first?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setNavOpen(false)
        return
      }
      if (event.key !== 'Tab') return

      const items = focusable()
      if (!items.length) {
        event.preventDefault()
        return
      }
      const firstItem = items[0]
      const lastItem = items[items.length - 1]
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault()
        lastItem.focus()
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault()
        firstItem.focus()
      }
    }
    const onResize = () => {
      if (window.matchMedia('(min-width: 860px)').matches) setNavOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
      document.body.style.position = previousBodyStyles.position
      document.body.style.top = previousBodyStyles.top
      document.body.style.width = previousBodyStyles.width
      if (currentRouteKey.current === routeKey) window.scrollTo(0, scrollY)
      menuButtonRef.current?.focus()
    }
  }, [navOpen])

  const shopActive = routeKey.startsWith('collection/') || routeKey.startsWith('product/')

  return (
    <>
    <span className="header-sentinel" ref={sentinelRef} aria-hidden="true" />
    <header className={`site-header${compact ? ' compact' : ''}`}>
      <div className="hdr">
        <div className="left">
          <button ref={menuButtonRef} className="menu-btn" aria-expanded={navOpen} aria-controls="mobile-nav" aria-label={navOpen ? 'Close menu' : 'Open menu'} onClick={() => setNavOpen((o) => !o)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M3 7h18M3 12h18M3 17h18" />
            </svg>
          </button>
          <nav className="nav" aria-label="Main">
            <a href="#/" aria-current={routeKey === '' ? 'page' : undefined}>Home</a>
            <a href="#/collection/all-products" aria-current={shopActive ? 'page' : undefined}>Shop</a>
            <a href="#/about" aria-current={routeKey === 'about' ? 'page' : undefined}>About me</a>
            <a href="#/page/contact" aria-current={routeKey === 'page/contact' ? 'page' : undefined}>Contact</a>
          </nav>
        </div>
        <a className="wordmark" href="#/" aria-label={`${BRAND}, home`}>{BRAND}</a>
        <div className="util">
          <div className="desktop-currency"><CurrencySwitcher variant="menu" /></div>
          <button className={`cart-btn${cartBumped ? ' bumped' : ''}`} aria-label="Open cart" onClick={openCart}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M5 8h14l-1 12H6L5 8z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            <span className="lbl">Cart</span>
            <span className="count">{count}</span>
          </button>
        </div>
      </div>
    </header>
    <div className={`mobile-nav-backdrop${navOpen ? ' open' : ''}`}>
        <button
          className="mobile-nav-scrim"
          type="button"
          tabIndex={navOpen ? 0 : -1}
          aria-label="Close navigation menu"
          onClick={() => setNavOpen(false)}
        />
        <nav
          id="mobile-nav"
          ref={mobileNavRef}
          className={`mobile-nav${navOpen ? ' open' : ''}`}
          role="dialog"
          aria-label="Mobile navigation"
          aria-modal={navOpen ? 'true' : undefined}
          aria-hidden={!navOpen}
          inert={!navOpen}
        >
          <div className="mobile-nav-head">
            <span className="mobile-nav-brand">{BRAND}</span>
            <button className="mobile-nav-close" type="button" aria-label="Close menu" onClick={() => setNavOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="m5 5 14 14M19 5 5 19" />
              </svg>
            </button>
          </div>
          <div className="mobile-nav-content">
            <a className="mobile-nav-primary" href="#/" onClick={() => setNavOpen(false)}>Home</a>
            <div className="mobile-nav-shop">
              <a className="mobile-nav-primary" href="#/collection/all-products" onClick={() => setNavOpen(false)}>Shop all</a>
              <span className="mobile-nav-label">Shop by category</span>
              {CATEGORIES.map(({ handle, label }) => (
                <a key={handle} className="mobile-nav-category" href={`#/collection/${handle}`} onClick={() => setNavOpen(false)}>{label}</a>
              ))}
            </div>
            <a className="mobile-nav-primary" href="#/about" onClick={() => setNavOpen(false)}>About me</a>
          </div>
          <div className="mobile-nav-currency">
            <CurrencySwitcher variant="pills" />
          </div>
        </nav>
    </div>
    </>
  )
}
