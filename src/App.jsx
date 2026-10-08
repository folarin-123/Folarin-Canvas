import { useEffect, useRef } from 'react'
import { ShopProvider } from './context/ShopContext.jsx'
import { useHashRoute } from './hooks/useHashRoute.js'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import Toast from './components/Toast.jsx'
import Checkout from './components/Checkout.jsx'
import CookieNotice from './components/CookieNotice.jsx'
import Home from './pages/Home.jsx'
import Collection from './pages/Collection.jsx'
import Product from './pages/Product.jsx'
import About from './pages/About.jsx'
import InfoPage from './pages/InfoPage.jsx'
import NotFound from './pages/NotFound.jsx'

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
          <Page route={route} />
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <Checkout />
      <Toast />
      <CookieNotice />
    </ShopProvider>
  )
}
