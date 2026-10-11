import { useState } from 'react'
import { CATEGORIES, COLLECTIONS, PRODUCTS } from '../data/catalog.js'
import { BRAND } from '../data/site.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import ProductCard from '../components/ProductCard.jsx'
import Newsletter from '../components/Newsletter.jsx'
import NotFound from './NotFound.jsx'
import { useReveal } from '../hooks/useReveal.js'

const SORTS = [
  ['featured', 'Featured'],
  ['asc', 'Price, low to high'],
  ['desc', 'Price, high to low'],
]

export default function Collection({ handle }) {
  const collection = COLLECTIONS[handle]
  const [sort, setSort] = useState('featured')
  const headingRef = useReveal()
  const toolbarRef = useReveal()
  useDocumentTitle(`${collection ? collection.title : 'Not found'} | ${BRAND}`)
  if (!collection) return <NotFound />

  const items = handle === 'all-products' ? [...PRODUCTS] : PRODUCTS.filter((p) => p.col === handle)
  if (sort === 'asc') items.sort((a, b) => a.price - b.price)
  if (sort === 'desc') items.sort((a, b) => b.price - a.price)

  return (
    <>
      <section className="wrap page-head reveal" ref={headingRef}>
        <h1>{collection.title}</h1>
        <p>{collection.blurb}</p>
      </section>
      <nav className="wrap category-chips" aria-label="Shop categories">
        <a href="#/collection/all-products" aria-current={handle === 'all-products' ? 'page' : undefined}>All</a>
        {CATEGORIES.map(({ handle: category, label }) => (
          <a key={category} href={`#/collection/${category}`} aria-current={handle === category ? 'page' : undefined}>{label}</a>
        ))}
      </nav>
      <div className="wrap toolbar reveal" ref={toolbarRef}>
        <span>{items.length} {items.length === 1 ? 'product' : 'products'}</span>
        <label>
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORTS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
      </div>
      <div className="wrap coll-body">
        <div className="grid">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        {items.length === 0 && <div className="empty-state"><h2>No pieces in this collection yet</h2><p>Try another category or browse everything we make.</p><a className="btn" href="#/collection/all-products">Shop all</a></div>}
      </div>
      <Newsletter />
    </>
  )
}
