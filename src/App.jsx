import { Suspense, lazy, useEffect, useRef } from 'react'
import { ShopProvider } from './context/ShopContext.jsx'
import { useHashRoute } from './hooks/useHashRoute.js'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import Toast from './components/Toast.jsx'
import Checkout from './components/Checkout.jsx'
import CookieNotice from './components/CookieNotice.jsx'
import FloatingWhatsApp from './components/FloatingWhatsApp.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const Collection = lazy(() => import('./pages/Collection.jsx'))
const Product = lazy(() => import('./pages/Product.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const InfoPage = lazy(() => import('./pages/InfoPage.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

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

export default function App() {
  const route = useHashRoute()
  const mainRef = useRef(null)
  const firstRender = useRef(true)

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
    <ShopProvider>
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
          <Suspense fallback={<div className="route-loading" role="status">Loading page…</div>}>
            <Page route={route} />
          </Suspense>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <Checkout />
      <Toast />
      <CookieNotice />
      <FloatingWhatsApp />
    </ShopProvider>
  )
}
