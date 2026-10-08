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
  const shopRef = useRef(null)

  // Close the menus whenever the page changes.
  useEffect(() => {
    setNavOpen(false)
    setShopOpen(false)
  }, [routeKey])

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
          <button className="menu-btn" aria-expanded={navOpen} aria-controls="mnav" aria-label="Menu" onClick={() => setNavOpen((o) => !o)}>
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
          <button className="cart-btn" aria-label="Open cart" onClick={openCart}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M5 8h14l-1 12H6L5 8z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            <span className="lbl">Cart</span>
            <span className="count">{count}</span>
          </button>
        </div>
      </div>
      <div id="mnav" hidden={!navOpen}>
        <ul>
          <li><a href="#/">Home</a></li>
          <li><a href="#/collection/all-products">Shop</a></li>
          {SHOP_LINKS.slice(0, 5).map(([handle, label]) => (
            <li key={handle} className="sub"><a href={`#/collection/${handle}`}>{label}</a></li>
          ))}
          <li><a href="#/about">About me</a></li>
        </ul>
        <CurrencySwitcher variant="pills" />
      </div>
    </header>
  )
}
