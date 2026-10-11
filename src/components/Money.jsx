import { CURRENCIES } from '../data/catalog.js'
import { formatMoney, useShop } from '../context/ShopContext.jsx'

export default function Money({ amount, currency }) {
  const { currency: selectedCurrency } = useShop()
  const code = currency || selectedCurrency
  const symbol = CURRENCIES[code].symbol
  const formatted = formatMoney(amount, code)

  return (
    <span className="money" aria-label={code === 'NGN' ? formatted : `Approximately ${formatted} ${code}`} title={code === 'NGN' ? undefined : 'Approximate display conversion; order and payment are confirmed in naira.'}>
      {code !== 'NGN' && <span className="approx" aria-hidden="true">≈</span>}
      <span className="sym">{symbol}</span>
      {formatted.slice(symbol.length)}
    </span>
  )
}
