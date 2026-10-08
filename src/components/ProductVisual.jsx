import { useState } from 'react'
import { ProductArt } from './Art.jsx'

export default function ProductVisual({ product, view = 1, className, decorative = false }) {
  const source = view === 2 ? (product.detailImage || product.image) : product.image
  const [loadedSource, setLoadedSource] = useState('')
  const [failedSource, setFailedSource] = useState('')
  const loaded = loadedSource === source
  const failed = failedSource === source

  if (!source || failed) {
    return <ProductArt product={product} view={view} className={className} decorative={decorative} />
  }

  return (
    <>
      {!loaded && <span className="image-skeleton" aria-hidden="true" />}
      <img
        className={`product-image${className ? ` ${className}` : ''}`}
        src={source}
        alt={decorative ? '' : product.title}
        aria-hidden={decorative || undefined}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoadedSource(source)}
        onError={() => setFailedSource(source)}
      />
    </>
  )
}
