import { formatMoney } from '../data/currency.js'
import { useShop } from '../context/ShopContext.jsx'

export default function Money({ amount, currency: forcedCurrency }) {
  const { currency: contextCurrency } = useShop()
  const code = forcedCurrency || contextCurrency || 'NGN'
  const formatted = formatMoney(amount, code)

  return (
    <span className="money" aria-label={formatted}>
      {formatted}
    </span>
  )
}
