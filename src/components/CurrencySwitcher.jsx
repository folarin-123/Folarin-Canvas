import { useEffect, useRef, useState } from 'react'
import { CURRENCIES } from '../data/catalog.js'
import { useShop } from '../context/ShopContext.jsx'

const CODES = Object.keys(CURRENCIES)

function currencySymbol(code) {
  return code === 'NGN' ? '₦' : CURRENCIES[code].symbol
}

export default function CurrencySwitcher({ variant }) {
  const { currency, setCurrency } = useShop()
  const [open, setOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(() => CODES.indexOf(currency))
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const optionRefs = useRef([])

  useEffect(() => {
    if (variant !== 'menu' || !open) return undefined
    const closeOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
    }
    const closeOnFocusLeave = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('focusin', closeOnFocusLeave)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('focusin', closeOnFocusLeave)
    }
  }, [open, variant])

  useEffect(() => {
    if (variant === 'menu' && open) optionRefs.current[focusedIndex]?.focus()
  }, [focusedIndex, open, variant])

  function moveFocus(event, currentIndex) {
    let nextIndex
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % CODES.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + CODES.length) % CODES.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = CODES.length - 1
    else return
    event.preventDefault()
    if (variant === 'pills') {
      setCurrency(CODES[nextIndex])
      optionRefs.current[nextIndex]?.focus()
    } else {
      setFocusedIndex(nextIndex)
    }
  }

  if (variant === 'pills') {
    return (
      <section className="currency-pills">
        <h2>Currency</h2>
        <div className="pill-group" role="radiogroup" aria-label="Currency">
          {CODES.map((code, index) => (
            <button
              key={code}
              ref={(node) => { optionRefs.current[index] = node }}
              type="button"
              role="radio"
              aria-checked={currency === code}
              tabIndex={currency === code ? 0 : -1}
              className={currency === code ? 'currency-pill selected' : 'currency-pill'}
              onClick={() => setCurrency(code)}
              onKeyDown={(event) => moveFocus(event, index)}
            >
              {code}
            </button>
          ))}
        </div>
      </section>
    )
  }

  if (variant !== 'menu') throw new Error(`Unsupported currency switcher variant: ${variant}`)

  return (
    <div className="currency-menu-wrap" ref={rootRef}>
      <button
        className="currency-menu-trigger"
        type="button"
        ref={triggerRef}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          setFocusedIndex(CODES.indexOf(currency))
          setOpen((value) => !value)
        }}
        onKeyDown={(event) => {
          if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && !open) {
            event.preventDefault()
            setFocusedIndex(CODES.indexOf(currency))
            setOpen(true)
          }
        }}
      >
        <span>{currencySymbol(currency)} {currency}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <path d="M1 3l4 4 4-4" />
        </svg>
      </button>
      {open && (
        <div className="currency-menu" role="menu" aria-label="Choose currency">
          {CODES.map((code, index) => (
            <button
              key={code}
              ref={(node) => { optionRefs.current[index] = node }}
              type="button"
              role="menuitemradio"
              aria-checked={currency === code}
              className="currency-menu-option"
              onClick={() => {
                setCurrency(code)
                setOpen(false)
                triggerRef.current?.focus()
              }}
              onKeyDown={(event) => moveFocus(event, index)}
            >
              <span>{currencySymbol(code)} {code}</span>
              {currency === code && <span aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
