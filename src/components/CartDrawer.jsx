import { useEffect, useRef, useState } from 'react'
import { FEATURED, byId, sizesFor } from '../data/catalog.js'
import { LEAD_TIME_TEXT, SHIPPING } from '../data/site.js'
import { useShop } from '../context/ShopContext.jsx'
import ProductVisual from './ProductVisual.jsx'
import Money from './Money.jsx'
import { whatsappLink } from '../utils/whatsapp.js'
import { WhatsAppIcon } from './Icons.jsx'

export default function CartDrawer() {
  const { cart, drawerOpen, closeCart, step, remove, changeSize, subtotal, currency, openCheckout, pendingOrder } = useShop()
  const [removing, setRemoving] = useState('')
  const drawerRef = useRef(null)
  const closeRef = useRef(null)
  const removeTimer = useRef(null)

  useEffect(() => () => clearTimeout(removeTimer.current), [])

  function animateRemove(id, size) {
    const key = `${id}:${size}`
    setRemoving(key)
    clearTimeout(removeTimer.current)
    removeTimer.current = setTimeout(() => {
      remove(id, size)
      setRemoving('')
    }, 240)
  }

  // Focus handling while the drawer is open: move focus in, trap Tab, close on Escape, lock page scroll.
  useEffect(() => {
    if (!drawerOpen) return undefined
    const previous = document.activeElement
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') {
        closeCart()
        return
      }
      if (e.key !== 'Tab' || !drawerRef.current) return
      const items = [...drawerRef.current.querySelectorAll('button,a[href],input')].filter((n) => n.offsetParent !== null)
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      if (previous && previous.focus) previous.focus()
    }
  }, [drawerOpen, closeCart])

  return (
    <>
      <div className={'backdrop' + (drawerOpen ? ' show' : '')} onClick={closeCart} />
      <aside className={'drawer' + (drawerOpen ? ' open' : '')} ref={drawerRef} aria-label="Cart" aria-hidden={!drawerOpen}>
        <div className="drawer-head">
          <h2>Cart</h2>
          <button className="x" ref={closeRef} onClick={closeCart}>Close</button>
        </div>
        <ul className="cart-list">
          {cart.map((item, index) => {
            const p = byId(item.id)
            return (
              <li className={`crow${removing === `${p.id}:${item.size}` ? ' removing' : ''}`} key={p.id + item.size} style={{ '--i': index }}>
                <div className="crow-inner">
                  <div className="cthumb"><ProductVisual product={p} decorative /></div>
                  <div>
                    <a className="ctitle" href={`#/product/${p.id}`} onClick={closeCart}>{p.title}</a>
                    <div className="cprice"><Money amount={p.price} currency={currency} /></div>
                    {sizesFor(p).length > 1 ? (
                    <label className="cart-size">
                      <span className="sr">Size for {p.title}</span>
                      <select value={item.size} onChange={(event) => changeSize(p.id, item.size, event.target.value)}>
                        {sizesFor(p).map((size) => <option key={size} value={size}>{size}</option>)}
                      </select>
                    </label>
                    ) : <div className="cprice">One size</div>}
                    <div className="qty" role="group" aria-label={`Quantity for ${p.title}, ${item.size}`}>
                      <button aria-label={`Decrease quantity of ${p.title}`} onClick={() => step(p.id, item.size, -1)}>&minus;</button>
                      <span className="quantity-tick" key={item.qty}>{item.qty}</span>
                      <button aria-label={`Increase quantity of ${p.title}`} onClick={() => step(p.id, item.size, 1)}>+</button>
                    </div>
                  </div>
                  <button className="rm" aria-label={`Remove ${p.title}`} onClick={() => animateRemove(p.id, item.size)}>Remove</button>
                </div>
              </li>
            )
          })}
        </ul>
        {cart.length === 0 ? (
          <div className="empty">
            <h3>Your cart is taking a little rest</h3>
            <p>Find something made for you and add it here.</p>
            <a className="btn" href="#/collection/all-products" onClick={closeCart}>Shop all</a>
            <div className="empty-suggested" aria-label="Suggested pieces">
              {FEATURED.slice(0, 3).map((id) => {
                const product = byId(id)
                return (
                  <a className="empty-suggestion" key={id} href={`#/product/${id}`} onClick={closeCart}>
                    <span className="empty-suggestion-image"><ProductVisual product={product} decorative /></span>
                    <span>{product.title}</span>
                  </a>
                )
              })}
            </div>
            {pendingOrder && <a className="btn-line pending-resend" href={whatsappLink(pendingOrder.message)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> Resend your last order</a>}
          </div>
        ) : (
          <div className="drawer-foot">
            <div className="cart-ordering">
              <strong>Next steps</strong>
              <p>Send your order on WhatsApp. We’ll confirm availability, delivery and payment, then make your pieces in {LEAD_TIME_TEXT}.</p>
            </div>
            <div className="delivery-progress">
              <div className="sub-row"><span>{subtotal >= SHIPPING.freeOver ? 'Free delivery unlocked' : 'Progress to free delivery'}</span><span>{subtotal >= SHIPPING.freeOver ? '✓' : <Money amount={SHIPPING.freeOver - subtotal} currency="NGN" />}</span></div>
              <div className="progress-track" role="progressbar" aria-label="Progress toward free delivery" aria-valuemin="0" aria-valuemax={SHIPPING.freeOver} aria-valuenow={Math.min(subtotal, SHIPPING.freeOver)}>
                <span className="progress-fill" style={{ transform: `scaleX(${Math.min(subtotal / SHIPPING.freeOver, 1)})` }} />
              </div>
            </div>
            <div className="sub-row"><span>Subtotal</span><span><Money amount={subtotal} currency={currency} /></span></div>
            <small>Delivery is estimated at checkout and confirmed on WhatsApp.</small>
            {pendingOrder && <a className="btn-line pending-resend" href={whatsappLink(pendingOrder.message)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> Resend your last order</a>}
            <button className="btn block" onClick={openCheckout}><WhatsAppIcon /> Checkout on WhatsApp</button>
          </div>
        )}
      </aside>
    </>
  )
}
