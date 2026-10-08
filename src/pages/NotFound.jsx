import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { BRAND } from '../data/site.js'

export default function NotFound() {
  useDocumentTitle(`Not found | ${BRAND}`)
  return (
    <article className="page">
      <h1>Page not found</h1>
      <p>That page does not exist. Try the shop instead.</p>
      <p><a className="btn" href="#/collection/all-products">Shop all</a></p>
    </article>
  )
}
