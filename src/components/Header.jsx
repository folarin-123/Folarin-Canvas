import { useEffect, useRef, useState } from 'react'
import { BRAND } from '../data/site.js'
import { useShop } from '../context/ShopContext.jsx'
import CurrencySwitcher from './CurrencySwitcher.jsx'

const SHOP_LINKS = [
  ['sets', 'Complete outfits'],
  ['trousers', 'Trousers'],
  ['skirts', 'Skirts'],
  ['tops', 'Tops and kaftans'],
  ['accessories', 'Caps and gele'],
  ['all-products', 'Shop all'],
]

export default function Header({ routeKey }) {
  const { count, openCart } = useShop()
  const [navOpen, setNavOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [cartBumped, setCartBumped] = useState(false)
  const shopRef = useRef(null)
  const menuButtonRef = useRef(null)
  const mobileNavRef = useRef(null)
  const currentRouteKey = useRef(routeKey)
  const previousCount = useRef(count)
  const bumpTimer = useRef(0)
  currentRouteKey.current = routeKey

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
    setShopOpen(false)
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

  // Close the Shop dropdown on an outside click or Escape.
  useEffect(() => {
    if (!shopOpen) return undefined
    const onClick = (e) => {
      if (shopRef.current && !shopRef.current.contains(e.target)) setShopOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setShopOpen(false)
    }
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [shopOpen])

  return (
    <header className="site-header">
      <div className="hdr">
        <div className="left">
          <button ref={menuButtonRef} className="menu-btn" aria-expanded={navOpen} aria-controls="mobile-nav" aria-label={navOpen ? 'Close menu' : 'Open menu'} onClick={() => setNavOpen((o) => !o)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M3 7h18M3 12h18M3 17h18" />
            </svg>
          </button>
          <nav className="nav" aria-label="Main">
            <a href="#/">Home</a>
            <div className={'has-menu' + (shopOpen ? ' open' : '')} ref={shopRef}>
              <button className="nav-link" aria-haspopup="true" aria-expanded={shopOpen} onClick={() => setShopOpen((o) => !o)}>
                Shop
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                  <path d="M1 3l4 4 4-4" />
                </svg>
              </button>
              <div className="menu">
                {SHOP_LINKS.map(([handle, label]) => (
                  <a key={handle} href={`#/collection/${handle}`}>{label}</a>
                ))}
              </div>
            </div>
            <a href="#/about">About me</a>
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
              {SHOP_LINKS.slice(0, 5).map(([handle, label]) => (
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
    </header>
  )
}
