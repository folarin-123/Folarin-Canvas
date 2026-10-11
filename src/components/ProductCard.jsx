import { useEffect, useRef, useState } from 'react'
import ProductVisual from './ProductVisual.jsx'
import { useShop } from '../context/ShopContext.jsx'
import { needsSize, sizesFor } from '../data/catalog.js'
import Money from './Money.jsx'
import { useReveal } from '../hooks/useReveal.js'

export default function ProductCard({ product: p }) {
  const { add, currency } = useShop()
  const [added, setAdded] = useState(false)
  const feedbackTimer = useRef(0)
  const revealRef = useReveal()

  useEffect(() => () => clearTimeout(feedbackTimer.current), [])

  function addToCart() {
    add(p.id, sizesFor(p)[0], 1)
    setAdded(true)
    clearTimeout(feedbackTimer.current)
    feedbackTimer.current = setTimeout(() => setAdded(false), 1400)
  }

  return (
    <article className="card reveal" ref={revealRef}>
      <a className="card-media" href={`#/product/${p.id}`} aria-label={p.title}>
        {p.tag && <span className="badge">{p.tag}</span>}
        <ProductVisual product={p} view={1} className="v1" decorative />
        {(!p.image || p.detailImage) && <ProductVisual product={p} view={2} className="v2" decorative />}
        <span className="card-quick-view" aria-hidden="true">View piece</span>
      </a>
      <div className="card-info">
        <a className="card-title" href={`#/product/${p.id}`}>{p.title}</a>
        <span className="price"><Money amount={p.price} currency={currency} /></span>
      </div>
      {needsSize(p) ? (
        <a className="btn btn-line block" href={`#/product/${p.id}`}>Choose size</a>
      ) : (
        <button className={`btn btn-line block${added ? ' added' : ''}`} onClick={addToCart} aria-live="polite">
          {added ? <><span aria-hidden="true">✓</span> Added!</> : 'Add to cart'}
        </button>
      )}
    </article>
  )
}
