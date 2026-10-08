// Site-wide settings. Change the brand name, social links or delivery fees here.
export const BRAND = 'Folarin’s Canvas'
export const EMAIL = 'peaceofolarin@gmail.com'

// Tracking parameters (?s=11, utm_*, stkn=...) were removed from the shared links.
export const SOCIALS = [
  { id: 'linkedin', label: 'LinkedIn', handle: 'peace-folarin', href: 'https://www.linkedin.com/in/peace-folarin-870990220' },
  { id: 'x', label: 'X', handle: '@folarin_peace', href: 'https://x.com/folarin_peace' },
  { id: 'instagram', label: 'Instagram', handle: '@_folarinpeace', href: 'https://www.instagram.com/_folarinpeace' },
]

// Delivery fees in naira. Orders at or above `freeOver` ship free.
// The server (api/*.js) reads these too, so the amount charged can never be set by the browser.
export const SHIPPING = { lagos: 3500, other: 6500, freeOver: 150000 }

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta',
  'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT (Abuja)', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]
