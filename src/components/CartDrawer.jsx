import { useEffect, useRef } from 'react'
import { byId } from '../data/catalog.js'
import { useShop } from '../context/ShopContext.jsx'
import { ProductArt } from './Art.jsx'
import Money from './Money.jsx'

export default function CartDrawer() {
  const { cart, drawerOpen, closeCart, step, remove, subtotal, currency, openCheckout } = useShop()
  const drawerRef = useRef(null)
  const closeRef = useRef(null)

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
          {cart.map((item) => {
            const p = byId(item.id)
            return (
              <li className="crow" key={p.id + item.size}>
                <div className="cthumb"><ProductArt product={p} decorative /></div>
                <div>
                  <a className="ctitle" href={`#/product/${p.id}`} onClick={closeCart}>{p.title}</a>
                  <div className="cprice"><Money amount={p.price} currency={currency} />{item.size !== 'One size' && <> · {item.size}</>}</div>
                  <div className="qty" role="group" aria-label={`Quantity for ${p.title}, ${item.size}`}>
                    <button aria-label={`Decrease quantity of ${p.title}`} onClick={() => step(p.id, item.size, -1)}>&minus;</button>
                    <span>{item.qty}</span>
                    <button aria-label={`Increase quantity of ${p.title}`} onClick={() => step(p.id, item.size, 1)}>+</button>
                  </div>
                </div>
                <button className="rm" aria-label={`Remove ${p.title}`} onClick={() => remove(p.id, item.size)}>Remove</button>
              </li>
            )
          })}
        </ul>
        {cart.length === 0 ? (
          <div className="empty">
            <p>Your cart is empty.</p>
            <a className="btn" href="#/collection/all-products" onClick={closeCart}>Shop all</a>
          </div>
        ) : (
          <div className="drawer-foot">
            <div className="sub-row"><span>Subtotal</span><span><Money amount={subtotal} currency={currency} /></span></div>
            <small>Delivery is calculated at checkout.</small>
            <button className="btn block" onClick={openCheckout}>Checkout</button>
          </div>
        )}
      </aside>
    </>
  )
}
