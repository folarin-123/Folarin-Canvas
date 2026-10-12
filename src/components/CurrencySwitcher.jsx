import { useEffect, useRef, useState } from 'react'
import { CURRENCIES } from '../data/currency.js'
import { useShop } from '../context/ShopContext.jsx'

export default function CurrencySwitcher({ variant = 'menu' }) {
  const { currency, setCurrency } = useShop()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const buttonRef = useRef(null)
  const itemRefs = useRef([])

  const currencyCodes = Object.keys(CURRENCIES)

  useEffect(() => {
    if (!isOpen) return undefined

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // Focus active or first menu item when menu opens
  useEffect(() => {
    if (isOpen) {
      const activeIndex = currencyCodes.indexOf(currency)
      const targetIndex = activeIndex >= 0 ? activeIndex : 0
      requestAnimationFrame(() => {
        itemRefs.current[targetIndex]?.focus()
      })
    }
  }, [isOpen, currency, currencyCodes])

  const handleMenuKeyDown = (event, index) => {
    let nextIndex = index
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      nextIndex = (index + 1) % currencyCodes.length
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      nextIndex = (index - 1 + currencyCodes.length) % currencyCodes.length
    } else if (event.key === 'Home') {
      event.preventDefault()
      nextIndex = 0
    } else if (event.key === 'End') {
      event.preventDefault()
      nextIndex = currencyCodes.length - 1
    } else if (event.key === 'Tab') {
      setIsOpen(false)
      return
    } else {
      return
    }
    itemRefs.current[nextIndex]?.focus()
  }

  if (variant === 'pills') {
    return (
      <div className="currency-pills" role="group" aria-label="Select currency">
        {currencyCodes.map((code) => {
          const info = CURRENCIES[code]
          const active = code === currency
          return (
            <button
              key={code}
              type="button"
              className={`currency-pill${active ? ' active' : ''}`}
              aria-pressed={active}
              onClick={() => setCurrency(code)}
            >
              {info.label}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="currency-menu-container" ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        className="currency-menu-btn"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Select currency, current: ${currency}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{CURRENCIES[currency]?.label || currency}</span>
        <svg
          className={`currency-chevron${isOpen ? ' open' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="currency-menu-dropdown" role="menu" aria-label="Currency options">
          {currencyCodes.map((code, index) => {
            const info = CURRENCIES[code]
            const active = code === currency
            return (
              <button
                key={code}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                tabIndex={isOpen ? 0 : -1}
                className={`currency-menu-item${active ? ' active' : ''}`}
                onClick={() => {
                  setCurrency(code)
                  setIsOpen(false)
                  buttonRef.current?.focus()
                }}
                onKeyDown={(e) => handleMenuKeyDown(e, index)}
              >
                <span>{info.label}</span>
                {active && <span className="currency-check" aria-hidden="true">✓</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
