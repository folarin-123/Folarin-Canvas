import { useState } from 'react'
import { COLLECTIONS, PRODUCTS, byId, detailsFor, needsSize, sizesFor } from '../data/catalog.js'
import { BRAND } from '../data/site.js'
import { useShop } from '../context/ShopContext.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { ProductArt } from '../components/Art.jsx'
import ProductCard from '../components/ProductCard.jsx'
import NotFound from './NotFound.jsx'

export default function Product({ id }) {
  const p = byId(id)
  const { money, add, showToast } = useShop()
  const [view, setView] = useState(1)
  const [qty, setQty] = useState(1)
  const [size, setSize] = useState('')
  useDocumentTitle(`${p ? p.title : 'Not found'} | ${BRAND}`)
  if (!p) return <NotFound />

  const sizes = sizesFor(p)
  const sized = needsSize(p)
  const family = p.family ? PRODUCTS.filter((x) => x.family === p.family) : []
  const addToCart = () => {
    const chosen = sized ? size : sizes[0]
    if (!chosen) {
      showToast('Choose a size first.')
      return
    }
    add(p.id, chosen, qty)
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
            <ProductArt product={p} view={view} className="on" />
          </div>
          <div className="thumbs">
            {[1, 2].map((v) => (
              <button key={v} className="thumb" aria-pressed={view === v} aria-label={v === 1 ? 'Show main view' : 'Show fabric close-up'} onClick={() => setView(v)}>
                <ProductArt product={p} view={v} decorative />
              </button>
            ))}
          </div>
        </div>

        <div className="pdp-info">
          <h1>{p.title}</h1>
          <p className="price big">{money(p.price)}</p>
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
            <div className="sizes" role="radiogroup" aria-label="Size">
              {sizes.map((s) => (
                <button key={s} type="button" role="radio" aria-checked={size === s} className={'size' + (size === s ? ' on' : '')} onClick={() => setSize(s)}>{s}</button>
              ))}
            </div>
          )}

          <div className="buy">
            <div className="qty">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => clamp(q - 1))}>&minus;</button>
              <input type="number" min="1" max="99" value={qty} aria-label="Quantity" onChange={(e) => setQty(clamp(parseInt(e.target.value, 10) || 1))} />
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => clamp(q + 1))}>+</button>
            </div>
            <button className="btn block" onClick={addToCart}>Add to cart</button>
          </div>

          <details open>
            <summary>Details</summary>
            <ul>{detailsFor(p).map((d) => <li key={d}>{d}</li>)}</ul>
          </details>
          <details>
            <summary>Shipping and returns</summary>
            <p>
              Made-to-order pieces ship in 7 to 10 working days, with delivery across all Nigerian states. Faulty or wrongly made items can be returned or remade.{' '}
              <a href="#/page/shipping-and-returns">Read the full policy</a>.
            </p>
          </details>
        </div>
      </div>

      <section className="related">
        <div className="sec-head"><h2>You may also like</h2></div>
        <div className="grid">
          {related.map((x) => <ProductCard key={x.id} product={x} />)}
        </div>
      </section>
    </div>
  )
}
