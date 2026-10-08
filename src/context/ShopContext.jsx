import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { CURRENCIES, byId, sizesFor } from '../data/catalog.js'

const ShopContext = createContext(null)
const KEY_CURRENCY = 'fc:currency'
const KEY_CART = 'fc:cart'

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}
function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage can be blocked; the shop still works without it */
  }
}

// A cart line is one product in one size: { id, size, qty }.
const same = (i, id, size) => i.id === id && i.size === size

function cartReducer(cart, action) {
  switch (action.type) {
    case 'add': {
      const found = cart.find((i) => same(i, action.id, action.size))
      if (found) return cart.map((i) => (same(i, action.id, action.size) ? { ...i, qty: Math.min(99, i.qty + action.qty) } : i))
      return [...cart, { id: action.id, size: action.size, qty: Math.min(99, action.qty) }]
    }
    case 'step':
      return cart
        .map((i) => (same(i, action.id, action.size) ? { ...i, qty: Math.max(0, Math.min(99, i.qty + action.delta)) } : i))
        .filter((i) => i.qty > 0)
    case 'remove':
      return cart.filter((i) => !same(i, action.id, action.size))
    case 'clear':
      return []
    default:
      return cart
  }
}
function initCart() {
  const saved = readStorage(KEY_CART, [])
  if (!Array.isArray(saved)) return []
  return saved.filter((i) => i && byId(i.id) && i.qty > 0 && sizesFor(byId(i.id)).includes(i.size))
}

export function formatMoney(ngn, currency) {
  const c = CURRENCIES[currency]
  const v = ngn * c.rate
  if (c.decimals === 0) return c.symbol + Math.round(v).toLocaleString('en-NG')
  return c.symbol + v.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function ShopProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    const saved = readStorage(KEY_CURRENCY, 'NGN')
    return CURRENCIES[saved] ? saved : 'NGN'
  })
  const [cart, dispatch] = useReducer(cartReducer, undefined, initCart)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [toast, setToast] = useState('')
  const toastTimer = useRef(0)

  useEffect(() => writeStorage(KEY_CURRENCY, currency), [currency])
  useEffect(() => writeStorage(KEY_CART, cart), [cart])
  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const money = useCallback((ngn) => formatMoney(ngn, currency), [currency])
  const showToast = useCallback((message) => {
    setToast(message)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 5200)
  }, [])
  const add = useCallback((id, size, qty = 1) => {
    dispatch({ type: 'add', id, size, qty })
    setDrawerOpen(true)
  }, [])
  const step = useCallback((id, size, delta) => dispatch({ type: 'step', id, size, delta }), [])
  const remove = useCallback((id, size) => dispatch({ type: 'remove', id, size }), [])
  const clearCart = useCallback(() => dispatch({ type: 'clear' }), [])
  const openCart = useCallback(() => setDrawerOpen(true), [])
  const closeCart = useCallback(() => setDrawerOpen(false), [])
  const openCheckout = useCallback(() => {
    setDrawerOpen(false)
    setCheckoutOpen(true)
  }, [])
  const closeCheckout = useCallback(() => setCheckoutOpen(false), [])

  const count = cart.reduce((n, i) => n + i.qty, 0)
  const subtotal = cart.reduce((s, i) => s + byId(i.id).price * i.qty, 0)

  const value = useMemo(
    () => ({
      currency, setCurrency, money, cart, count, subtotal, add, step, remove, clearCart,
      drawerOpen, openCart, closeCart, checkoutOpen, openCheckout, closeCheckout, toast, showToast,
    }),
    [currency, money, cart, count, subtotal, add, step, remove, clearCart, drawerOpen, openCart, closeCart, checkoutOpen, openCheckout, closeCheckout, toast, showToast],
  )
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const value = useContext(ShopContext)
  if (!value) throw new Error('useShop must be used inside <ShopProvider>')
  return value
}
