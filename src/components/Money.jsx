import { formatMoney } from '../context/ShopContext.jsx'

export default function Money({ amount }) {
  const formatted = formatMoney(amount)

  return (
    <span className="money" aria-label={formatted}>
      <span className="sym">₦</span>
      {formatted.replace(/^₦\s*/u, '')}
    </span>
  )
}
