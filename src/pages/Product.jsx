import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { COLLECTIONS, PRODUCTS, byId, detailsFor, needsSize, sizesFor } from '../data/catalog.js'
import { BRAND, DELIVERY_COVERAGE_TEXT, LEAD_TIME_TEXT, SHIPPING } from '../data/site.js'
import { useShop } from '../context/ShopContext.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import ProductVisual from '../components/ProductVisual.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Money from '../components/Money.jsx'
import NotFound from './NotFound.jsx'
import { whatsappLink, whatsappLinkForProduct } from '../utils/whatsapp.js'
import { WhatsAppIcon } from '../components/Icons.jsx'

export default function Product({ id }) {
  const p = byId(id)
  const { currency, add, drawerOpen } = useShop()
  const [view, setView] = useState(1)
  const [qty, setQty] = useState(1)
  const [size, setSize] = useState('')
  const [sizeError, setSizeError] = useState(false)
  const [added, setAdded] = useState(false)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [stickyVisible, setStickyVisible] = useState(false)
  const addedTimer = useRef(0)
  const sizeGroupRef = useRef(null)
  const addButtonRef = useRef(null)
  useEffect(() => () => clearTimeout(addedTimer.current), [])
  useEffect(() => {
    if (!addButtonRef.current || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setStickyVisible(!entry.isIntersecting))
    observer.observe(addButtonRef.current)
    return () => observer.disconnect()
  }, [id])
  useDocumentTitle(`${p ? p.title : 'Not found'} | ${BRAND}`)
  if (!p) return <NotFound />

  const sizes = sizesFor(p)
  const sized = needsSize(p)
  const family = p.family ? PRODUCTS.filter((x) => x.family === p.family) : []
  const addToCart = () => {
    const chosen = sized ? size : sizes[0]
    if (!chosen) {
      setSizeError(true)
      sizeGroupRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      sizeGroupRef.current?.focus()
      return false
    }
    add(p.id, chosen, qty)
    return true
  }
  const handleSizeKeyDown = (event, index) => {
    const offset = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1
      : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1
        : 0
    if (offset === 0) return
    event.preventDefault()
    const next = (index + offset + sizes.length) % sizes.length
    setSize(sizes[next])
    setSizeError(false)
    sizeGroupRef.current?.querySelectorAll('[role="radio"]')[next]?.focus()
  }
  const clamp = (n) => Math.max(1, Math.min(99, n))
  let related = PRODUCTS.filter((x) => x.id !== p.id && x.kind === p.kind)
  if (related.length < 3) {
    related = PRODUCTS.filter((x) => x.id !== p.id && x.col !== p.col).slice(0, 4 - related.length).concat(related)
  }
  related = related.slice(0, 4)

  return (
    <div className="wrap pdp">
      <a className="back" href={`#/collection/${p.col}`}>Back to {COLLECTIONS[p.col].title.toLowerCase()}</a>
      <div className="pdp-grid">
        <div className="gallery">
          <div className="gallery-main">
            <ProductVisual product={p} view={view} className="on" priority />
          </div>
          <div className="thumbs">
            {[1, 2].map((v) => (
              <button key={v} className="thumb" aria-pressed={view === v} aria-label={v === 1 ? 'Show main view' : 'Show fabric close-up'} onClick={() => setView(v)}>
                <ProductVisual product={p} view={v} decorative />
              </button>
            ))}
          </div>
        </div>

        <div className="pdp-info">
          <h1>{p.title}</h1>
          <p className="price big"><Money amount={p.price} currency={currency} /></p>
          <p>{p.blurb}</p>

          {family.length > 1 && (
            <div className="swatches" role="group" aria-label="Colour">
              {family.map((x) => (
                <a
                  key={x.id}
                  className={'sw' + (x.id === p.id ? ' on' : '')}
                  href={`#/product/${x.id}`}
                  style={{ '--c': x.color }}
                  aria-label={x.title}
                  aria-current={x.id === p.id ? 'page' : undefined}
                />
              ))}
            </div>
          )}

          {sized && (
            <>
              <div className="size-guide-row">
                <span>Find your fit</span>
                <button type="button" className="link-button" onClick={() => setSizeGuideOpen(true)}>Size guide</button>
              </div>
              <div
                className={`sizes${sizeError ? ' size-error' : ''}`}
                role="radiogroup"
                aria-label="Size"
                aria-orientation="horizontal"
                aria-invalid={sizeError || undefined}
                aria-describedby={sizeError ? 'size-error' : undefined}
                tabIndex={-1}
                ref={sizeGroupRef}
              >
                {sizes.map((s, index) => (
                  <button key={s} type="button" role="radio" aria-checked={size === s} tabIndex={size === s || (!size && index === 0) ? 0 : -1} className={'size' + (size === s ? ' on' : '')} onKeyDown={(event) => handleSizeKeyDown(event, index)} onClick={() => { setSize(s); setSizeError(false) }}>{s}</button>
                ))}
              </div>
              {sizeError && <p id="size-error" className="size-error-message" role="alert">Choose a size to add this piece to your cart.</p>}
            </>
          )}

          <div className="buy">
            <div className="qty">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => clamp(q - 1))}>&minus;</button>
              <input type="number" min="1" max="99" value={qty} aria-label="Quantity" onChange={(e) => setQty(clamp(parseInt(e.target.value, 10) || 1))} />
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => clamp(q + 1))}>+</button>
            </div>
            <button
              ref={addButtonRef}
              className={`btn block${added ? ' added' : ''}`}
              aria-live="polite"
              onClick={() => {
                if (!addToCart()) return
                setAdded(true)
                clearTimeout(addedTimer.current)
                addedTimer.current = setTimeout(() => setAdded(false), 1400)
              }}
            >
              {added ? <><span aria-hidden="true">✓</span> Added!</> : 'Add to cart'}
            </button>
            <a className="btn-line ask-whatsapp" href={whatsappLinkForProduct(p, size || sizes[0] || 'One size')} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon /> Ask about this piece
            </a>
          </div>

          <details open>
            <summary>Details</summary>
            <ul>{detailsFor(p).map((d) => <li key={d}>{d}</li>)}</ul>
          </details>
          <details>
            <summary>Shipping and returns</summary>
            <p>
              Made-to-order pieces ship in {LEAD_TIME_TEXT}, with delivery to {DELIVERY_COVERAGE_TEXT}. Faulty or wrongly made items can be returned or remade.{' '}
              <a href="#/page/shipping-and-returns">Read the full policy</a>.
            </p>
          </details>
          <p className="shipping-note">Free Nigeria delivery on orders over <Money amount={SHIPPING.freeOver} currency="NGN" />.</p>
        </div>
      </div>

      <section className="related">
        <div className="sec-head"><h2>You may also like</h2></div>
        <div className="grid">
          {related.map((x) => <ProductCard key={x.id} product={x} />)}
        </div>
      </section>
      {sizeGuideOpen && <SizeGuideDialog onClose={() => setSizeGuideOpen(false)} />}
      {stickyVisible && !drawerOpen && createPortal(
        <div className="sticky-add">
          <div><strong>{p.title}</strong><span><Money amount={p.price} currency={currency} /></span></div>
          <button className="btn" onClick={() => {
            if (!addToCart()) return
            setAdded(true)
            clearTimeout(addedTimer.current)
            addedTimer.current = setTimeout(() => setAdded(false), 1400)
          }}>{added ? 'Added!' : 'Add to cart'}</button>
        </div>,
        document.body,
      )}
    </div>
  )
}

function SizeGuideDialog({ onClose }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)

  useEffect(() => {
    const previous = document.activeElement
    const bodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      } else if (event.key === 'Tab') {
        const focusable = [...dialogRef.current.querySelectorAll('a[href], button:not([disabled])')]
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = bodyOverflow
      previous?.focus?.()
    }
  }, [onClose])

  return (
    <div className="size-guide-layer">
      <button className="size-guide-backdrop" aria-label="Close size guide" onClick={onClose} />
      <section className="size-guide-dialog" role="dialog" aria-modal="true" aria-labelledby="size-guide-title" ref={dialogRef}>
        <button className="x" ref={closeRef} onClick={onClose} aria-label="Close size guide">Close</button>
        <h2 id="size-guide-title">Size guide</h2>
        <p>Sizes can vary slightly between styles. If you are between sizes, or would like a closer fit check, send your usual size and measurements to us on WhatsApp.</p>
        <p>For the best fit, measure your bust, waist and hips and compare them with a well-fitting garment. We’ll help you choose before confirming your order.</p>
        <a className="btn-line" href={whatsappLink('Hi, could you help me choose the right size for a piece?')} target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> Ask us about fit</a>
      </section>
    </div>
  )
}
