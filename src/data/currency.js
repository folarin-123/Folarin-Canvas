// UPDATE THESE RATES MANUALLY; display only
export const CURRENCIES = {
  NGN: { symbol: '₦', rate: 1,       decimals: 0, label: 'NGN ₦' },
  USD: { symbol: '$', rate: 0.00065, decimals: 2, label: 'USD $' },
  GBP: { symbol: '£', rate: 0.00049, decimals: 2, label: 'GBP £' },
  EUR: { symbol: '€', rate: 0.00056, decimals: 2, label: 'EUR €' },
}

export const RATES_UPDATED = '2026-10-12'
export const DEFAULT_CURRENCY = 'NGN'

export function formatMoney(ngnAmount, code = DEFAULT_CURRENCY) {
  const validCode = CURRENCIES[code] ? code : DEFAULT_CURRENCY
  const info = CURRENCIES[validCode]
  const converted = (Number(ngnAmount) || 0) * info.rate

  const numFormatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: info.decimals,
    maximumFractionDigits: info.decimals,
  }).format(converted)

  const formatted = `${info.symbol}${numFormatted}`
  return validCode === 'NGN' ? formatted : `≈${formatted}`
}
