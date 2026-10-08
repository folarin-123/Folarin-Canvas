import { ProductArt } from './Art.jsx'
import { useShop } from '../context/ShopContext.jsx'
import { needsSize, sizesFor } from '../data/catalog.js'

export default function ProductCard({ product: p }) {
  const { money, add } = useShop()
  return (
    <article className="card">
      <a className="card-media" href={`#/product/${p.id}`} aria-label={p.title}>
        {p.tag && <span className="badge">{p.tag}</span>}
        <ProductArt product={p} view={1} className="v1" decorative />
        <ProductArt product={p} view={2} className="v2" decorative />
      </a>
      <div className="card-info">
        <a className="card-title" href={`#/product/${p.id}`}>{p.title}</a>
        <span className="price">{money(p.price)}</span>
      </div>
      {needsSize(p) ? (
        <a className="btn btn-line block" href={`#/product/${p.id}`}>Choose size</a>
      ) : (
        <button className="btn btn-line block" onClick={() => add(p.id, sizesFor(p)[0], 1)}>Add to cart</button>
      )}
    </article>
  )
}
