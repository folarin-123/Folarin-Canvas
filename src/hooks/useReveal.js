import { useCallback, useRef } from 'react'

let revealObserver

function getRevealObserver() {
  if (revealObserver) return revealObserver
  if (typeof IntersectionObserver === 'undefined') return null
  revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const element = entry.target
      if (element.classList.contains('pause-when-out')) {
        element.classList.toggle('paused', !entry.isIntersecting)
      }
      if (!entry.isIntersecting) continue
      element.classList.add('in')
      element.classList.remove('reveal-pending')
      if (!element.classList.contains('pause-when-out')) revealObserver.unobserve(element)
    }
  }, { threshold: 0.15 })
  return revealObserver
}

export function useReveal({ pauseWhenOut = false } = {}) {
  const current = useRef(null)
  return useCallback((element) => {
    const observer = getRevealObserver()
    if (current.current && observer) observer.unobserve(current.current)
    current.current = element
    if (!element || !observer) return
    if (!element.classList.contains('in')) element.classList.add('reveal-pending')
    if (pauseWhenOut) element.classList.add('pause-when-out')
    observer.observe(element)
  }, [pauseWhenOut])
}
