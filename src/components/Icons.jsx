const base = { width: 20, height: 20, viewBox: '0 0 24 24', 'aria-hidden': true, focusable: 'false' }

export function WhatsAppIcon() {
  return (
    <svg {...base} fill="currentColor">
      <path d="M20.52 3.48A11.9 11.9 0 0 0 12.04 0C5.46 0 .1 5.36.1 11.94c0 2.1.55 4.15 1.6 5.96L0 24l6.25-1.64a11.9 11.9 0 0 0 5.79 1.47h.01C18.63 23.83 24 18.47 24 11.9c0-3.18-1.24-6.17-3.48-8.42ZM12.05 21.8h-.01a9.88 9.88 0 0 1-5.03-1.37l-.36-.21-3.71.97.99-3.62-.24-.37a9.83 9.83 0 0 1-1.5-5.26c0-5.46 4.44-9.9 9.91-9.9 2.65 0 5.14 1.03 7.01 2.91a9.84 9.84 0 0 1 2.9 7.01c0 5.46-4.44 9.9-9.96 9.9Zm5.44-7.41c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.16-.17.2-.34.22-.64.07-.3-.15-1.26-.46-2.4-1.47-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.66-1.6-.91-2.2-.24-.58-.48-.5-.66-.51h-.57c-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.21 5.08 4.5.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.08 1.75-.72 2-1.42.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  )
}

export function OrderBagIcon() {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  )
}

export function MakeAndDeliverIcon() {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 12 9-8 9 8v8H3v-8Z" />
      <path d="M9 20v-5h6v5M7 12h.01M17 12h.01" />
    </svg>
  )
}

export function SocialIcon({ id }) {
  if (id === 'x') {
    return (
      <svg {...base} fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  }
  if (id === 'linkedin') {
    return (
      <svg {...base} fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
      </svg>
    )
  }
  if (id === 'instagram') {
    return (
      <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </svg>
  )
}
