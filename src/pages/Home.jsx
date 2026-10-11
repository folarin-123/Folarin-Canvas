import { COLLECTIONS, FEATURED, byId } from '../data/catalog.js'
import { BRAND, DELIVERY_COVERAGE_TEXT, LEAD_TIME_TEXT } from '../data/site.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { HeroArt } from '../components/Art.jsx'
import ProductVisual from '../components/ProductVisual.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Newsletter from '../components/Newsletter.jsx'
import { useReveal } from '../hooks/useReveal.js'
import { MakeAndDeliverIcon, OrderBagIcon, WhatsAppIcon } from '../components/Icons.jsx'

function CollectionTile({ collection, handle }) {
  const revealRef = useReveal()
  return (
    <a ref={revealRef} className="tile reveal" href={`#/collection/${handle}`}>
      <span className="card-media"><ProductVisual product={byId(collection.pick)} view={1} decorative /></span>
      <h3>{collection.title}</h3>
      <p>{collection.blurb}</p>
    </a>
  )
}

export default function Home() {
  const heroArtRef = useReveal({ pauseWhenOut: true })
  const featuredRef = useReveal()
  const tilesRef = useReveal()
  useDocumentTitle(`${BRAND} | Nigerian fashion, made to order`)
  const featured = FEATURED.map(byId)
  const tiles = ['trousers', 'skirts', 'sets']
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="wrap hero-in">
          <div className="hero-copy">
            <h1 id="hero-title" aria-label="Cut for the way we dress">
              {'Cut for the way we dress'.split(' ').map((word, index) => <span className="hero-word" style={{ '--i': index }} key={word} aria-hidden="true">{word} </span>)}
            </h1>
            <p>Trousers, skirts, kaftans and traditional sets in Ankara, adire and aso-oke, made to your measurements.</p>
            <div className="hero-actions">
              <a className="btn btn-light" href="#/collection/all-products">Shop now</a>
              <a className="btn-line hero-how" href="#how-ordering-works" onClick={(event) => {
                event.preventDefault()
                document.getElementById('how-ordering-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}>How ordering works</a>
            </div>
          </div>
          <div className="hero-art" ref={heroArtRef}><HeroArt /></div>
        </div>
      </section>

      <div className="strip">
        Made to order in {LEAD_TIME_TEXT}, delivered to {DELIVERY_COVERAGE_TEXT}
        <a href="#/collection/all-products">Shop all</a>
      </div>

      <section className="wrap sec reveal" ref={featuredRef} aria-labelledby="featured-title">
        <div className="sec-head">
          <h2 id="featured-title">Popular right now</h2>
          <a className="link" href="#/collection/all-products">Shop all</a>
        </div>
        <div className="grid five">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="wrap sec reveal" ref={tilesRef} style={{ paddingTop: 0 }} aria-labelledby="sets-title">
        <div className="sec-head"><h2 id="sets-title">Shop by piece</h2></div>
        <div className="tiles">
          {tiles.map((handle) => {
            const c = COLLECTIONS[handle]
            return <CollectionTile key={handle} handle={handle} collection={c} />
          })}
        </div>
      </section>

      <section id="how-ordering-works" className="wrap sec how-ordering" aria-labelledby="ordering-title">
        <div className="sec-head"><div><p className="eyebrow">Simple and personal</p><h2 id="ordering-title">How ordering works</h2></div></div>
        <ol className="order-steps">
          <li><span className="order-step-icon"><OrderBagIcon /></span><h3>Choose your pieces</h3><p>Pick your pieces and sizes, then add them to your cart.</p></li>
          <li><span className="order-step-icon"><WhatsAppIcon /></span><h3>Send your order on WhatsApp</h3><p>Review your details and send the ready-to-go order message.</p></li>
          <li><span className="order-step-icon"><MakeAndDeliverIcon /></span><h3>We confirm, make and deliver</h3><p>We confirm availability, delivery and payment. Your made-to-order pieces are ready in {LEAD_TIME_TEXT}.</p></li>
        </ol>
      </section>

      <Newsletter />
    </>
  )
}
