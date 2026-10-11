import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/bodoni-moda/latin-400.css'
import '@fontsource/bodoni-moda/latin-500.css'
import '@fontsource/hanken-grotesk/latin-400.css'
import '@fontsource/hanken-grotesk/latin-500.css'
import '@fontsource/hanken-grotesk/latin-600.css'
import './styles/index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
