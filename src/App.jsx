import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { ShopProvider, useShop } from './context/ShopContext.jsx'
import { useHashRoute } from './hooks/useHashRoute.js'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Toast from './components/Toast.jsx'
import CookieNotice from './components/CookieNotice.jsx'
import FloatingWhatsApp from './components/FloatingWhatsApp.jsx'
import Home from './pages/Home.jsx'
import Product from './pages/Product.jsx'
import NotFound from './pages/NotFound.jsx'

const Collection = lazy(() => import('./pages/Collection.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const InfoPage = lazy(() => import('./pages/InfoPage.jsx'))
const CartDrawer = lazy(() => import('./components/CartDrawer.jsx'))
const Checkout = lazy(() => import('./components/Checkout.jsx'))

function SkeletonFallback({ overlay = false, label = 'Loading page' }) {
  return (
    <div className={overlay ? 'overlay-skeleton' : 'route-skeleton'} role="status" aria-label={label}>
      <div className="skeleton-media"><span className="image-skeleton" aria-hidden="true" /></div>
      {!overlay && <span className="skeleton-lines" aria-hidden="true"><i /><i /><i /></span>}
    </div>
  )
}

function Page({ route }) {
  switch (route.name) {
    case 'home':
      return <Home />
    case 'collection':
      return <Collection key={route.param} handle={route.param} />
    case 'product':
      return <Product key={route.param} id={route.param} />
    case 'about':
      return <About />
    case 'page':
      return <InfoPage slug={route.param} />
    default:
      return <NotFound />
  }
}

function AppContent({ loadingScreen }) {
  const route = useHashRoute()
  const { drawerOpen, checkoutOpen } = useShop()
  const mainRef = useRef(null)
  const firstRender = useRef(true)
  const [ready, setReady] = useState(!loadingScreen.show)
  const [cartWasOpened, setCartWasOpened] = useState(false)
  const [checkoutWasOpened, setCheckoutWasOpened] = useState(false)

  useEffect(() => {
    if (drawerOpen) setCartWasOpened(true)
    if (checkoutOpen) setCheckoutWasOpened(true)
  }, [drawerOpen, checkoutOpen])

  useEffect(() => {
    if (!loadingScreen.show) {
      document.documentElement.classList.remove('app-booting')
      return undefined
    }

    let cancelled = false
    const reveal = async () => {
      let fontTimeout
      await Promise.race([
        document.fonts?.ready,
        new Promise((resolve) => { fontTimeout = window.setTimeout(resolve, 1500) }),
      ])
      window.clearTimeout(fontTimeout)

      const remaining = Math.max(0, 400 - (performance.now() - loadingScreen.startedAt))
      if (remaining) await new Promise((resolve) => window.setTimeout(resolve, remaining))
      if (cancelled) return

      setReady(true)
      const loader = loadingScreen.loader
      if (!loader) return
      loader.classList.add('app-loader-leaving')
      await new Promise((resolve) => {
        let timer
        const finish = (event) => {
          if (event && (event.target !== loader || event.propertyName !== 'opacity')) return
          window.clearTimeout(timer)
          loader.removeEventListener('transitionend', finish)
          resolve()
        }
        loader.addEventListener('transitionend', finish)
        timer = window.setTimeout(finish, 400)
      })
      loader.remove()
    }

    void reveal()
    return () => { cancelled = true }
  }, [loadingScreen])

  // After every navigation: back to the top, and move focus to the page for keyboard and screen reader users.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
    mainRef.current?.focus({ preventScroll: true })
  }, [route.key])

  return (
    <div className={`app-content${ready ? ' app-content-ready' : ''}`} aria-busy={!ready} inert={!ready}>
      <a
        className="skip"
        href="#main"
        onClick={(e) => {
          e.preventDefault()
          mainRef.current?.focus()
        }}
      >
        Skip to content
      </a>
      <Header routeKey={route.key} />
      <main id="main" tabIndex={-1} ref={mainRef}>
        <div key={route.key} className="route-enter">
          <Suspense fallback={<SkeletonFallback />}>
            <Page route={route} />
          </Suspense>
        </div>
      </main>
      <Footer />
      {cartWasOpened && (
        <Suspense fallback={<SkeletonFallback overlay label="Loading cart" />}>
          <CartDrawer />
        </Suspense>
      )}
      {checkoutWasOpened && (
        <Suspense fallback={<SkeletonFallback overlay label="Loading checkout" />}>
          <Checkout />
        </Suspense>
      )}
      <Toast />
      <CookieNotice />
      <FloatingWhatsApp />
    </div>
  )
}

export default function App({ loadingScreen }) {
  return (
    <ShopProvider>
      <AppContent loadingScreen={loadingScreen} />
    </ShopProvider>
  )
}
