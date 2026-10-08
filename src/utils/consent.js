const CONSENT_KEY = 'fc:consent'
const CONSENT_VERSION = 1

function readConsent() {
  try {
    const value = JSON.parse(localStorage.getItem(CONSENT_KEY))
    if (
      value?.version === CONSENT_VERSION
      && (value.choice === 'all' || value.choice === 'essential')
      && typeof value.timestamp === 'string'
    ) return value
  } catch {
    return null
  }
  return null
}

export function hasConsent(category) {
  const consent = readConsent()
  if (!consent) return false
  if (category === 'essential') return true
  return (category === 'analytics' || category === 'ads') && consent.choice === 'all'
}

export function saveConsent(choice) {
  if (choice !== 'all' && choice !== 'essential') return false
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      version: CONSENT_VERSION,
      choice,
      timestamp: new Date().toISOString(),
    }))
    return true
  } catch {
    return false
  }
}
