import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { BRAND } from '../data/site.js'

export default function NotFound() {
  useDocumentTitle(`Not found | ${BRAND}`)
  return (
    <article className="page">
      <p className="eyebrow">404 · Not found</p>
      <h1>We couldn’t find that page</h1>
      <p>The link may be out of date, or the page may have moved. You can browse the shop or head back home.</p>
      <p className="not-found-actions"><a className="btn" href="#/collection/all-products">Shop all</a><a className="btn-line" href="#/">Go home</a></p>
      <p className="note">Still stuck? <a href="#/page/contact">Get in touch</a>.</p>
    </article>
  )
}
