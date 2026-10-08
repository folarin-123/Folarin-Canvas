import { useState } from 'react'
import { COLLECTIONS, PRODUCTS } from '../data/catalog.js'
import { BRAND } from '../data/site.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import ProductCard from '../components/ProductCard.jsx'
import Newsletter from '../components/Newsletter.jsx'
import NotFound from './NotFound.jsx'

const SORTS = [
  ['featured', 'Featured'],
  ['asc', 'Price, low to high'],
  ['desc', 'Price, high to low'],
]

export default function Collection({ handle }) {
  const collection = COLLECTIONS[handle]
  const [sort, setSort] = useState('featured')
  useDocumentTitle(`${collection ? collection.title : 'Not found'} | ${BRAND}`)
  if (!collection) return <NotFound />

  const items = handle === 'all-products' ? [...PRODUCTS] : PRODUCTS.filter((p) => p.col === handle)
  if (sort === 'asc') items.sort((a, b) => a.price - b.price)
  if (sort === 'desc') items.sort((a, b) => b.price - a.price)

  return (
    <>
      <section className="wrap page-head">
        <h1>{collection.title}</h1>
        <p>{collection.blurb}</p>
      </section>
      <div className="wrap toolbar">
        <span>{items.length} products</span>
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
      </div>
      <Newsletter />
    </>
  )
}
