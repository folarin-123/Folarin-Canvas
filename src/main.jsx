import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/bodoni-moda/latin-400.css'
import '@fontsource/bodoni-moda/latin-500.css'
import '@fontsource/hanken-grotesk/latin-400.css'
import '@fontsource/hanken-grotesk/latin-500.css'
import '@fontsource/hanken-grotesk/latin-600.css'
import './styles/index.css'
import App from './App.jsx'

const loader = document.getElementById('app-loader')
let showLoader = true

try {
  if (sessionStorage.getItem('fc:loader-seen')) {
    showLoader = false
  } else {
    sessionStorage.setItem('fc:loader-seen', '1')
  }
} catch {
  showLoader = true
}

if (loader && showLoader) {
  document.body.append(loader)
} else {
  loader?.remove()
  document.documentElement.classList.add('app-booting')
}

const loadingScreen = {
  loader: showLoader ? loader : null,
  show: showLoader,
  startedAt: performance.now(),
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App loadingScreen={loadingScreen} />
  </StrictMode>,
)
