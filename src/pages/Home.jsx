import { COLLECTIONS, FEATURED, byId } from '../data/catalog.js'
import { BRAND } from '../data/site.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { HeroArt } from '../components/Art.jsx'
import ProductVisual from '../components/ProductVisual.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Newsletter from '../components/Newsletter.jsx'

export default function Home() {
  useDocumentTitle(`${BRAND} | Nigerian fashion, made to order`)
  const featured = FEATURED.map(byId)
  const tiles = ['trousers', 'skirts', 'sets']
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="wrap hero-in">
          <div className="hero-copy">
            <h1 id="hero-title">Cut for the way we dress</h1>
            <p>Trousers, skirts, kaftans and traditional sets in Ankara, adire and aso-oke, made to your measurements.</p>
            <a className="btn btn-light" href="#/collection/all-products">Shop now</a>
          </div>
          <div className="hero-art"><HeroArt /></div>
        </div>
      </section>

      <div className="strip">
        Made to order in 7 to 10 days, delivered to every state
        <a href="#/collection/all-products">Shop all</a>
      </div>

      <section className="wrap sec" aria-labelledby="featured-title">
        <div className="sec-head">
          <h2 id="featured-title">Popular right now</h2>
          <a className="link" href="#/collection/all-products">Shop all</a>
        </div>
        <div className="grid five">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="wrap sec" style={{ paddingTop: 0 }} aria-labelledby="sets-title">
        <div className="sec-head"><h2 id="sets-title">Shop by piece</h2></div>
        <div className="tiles">
          {tiles.map((handle) => {
            const c = COLLECTIONS[handle]
            return (
              <a key={handle} className="tile" href={`#/collection/${handle}`}>
                <span className="card-media"><ProductVisual product={byId(c.pick)} view={1} decorative /></span>
                <h3>{c.title}</h3>
                <p>{c.blurb}</p>
              </a>
            )
          })}
        </div>
      </section>

      <Newsletter />
    </>
  )
}
