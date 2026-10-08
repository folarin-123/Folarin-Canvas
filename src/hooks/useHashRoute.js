import { useEffect, useState } from 'react'

// Tiny hash router: "#/product/forest" -> { name: 'product', param: 'forest' }.
// Hash routes need no server setup, so the built site works on any static host.
function parse() {
  const raw = window.location.hash.replace(/^#\/?/, '')
  const parts = raw.split('/').filter(Boolean)
  return { name: parts[0] || 'home', param: parts[1] || null, key: raw }
}

export function useHashRoute() {
  const [route, setRoute] = useState(parse)
  useEffect(() => {
    const onChange = () => setRoute(parse())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
