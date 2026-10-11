import { LEAD_TIME_TEXT } from './site.js'

// Prices are in naira (NGN). Static indicative conversion rates; review before relying on them. Orders and payment are in naira.
export const CURRENCIES = {
  NGN: { symbol: '₦', rate: 1, label: 'NGN ₦', decimals: 0 },
  USD: { symbol: '$', rate: 0.00065, label: 'USD $', decimals: 2 },
  GBP: { symbol: '£', rate: 0.00049, label: 'GBP £', decimals: 2 },
  EUR: { symbol: '€', rate: 0.00056, label: 'EUR €', decimals: 2 },
}

export const SIZES = {
  women: ['UK 8', 'UK 10', 'UK 12', 'UK 14', 'UK 16', 'UK 18'],
  men: ['S', 'M', 'L', 'XL', 'XXL'],
  unisex: ['S', 'M', 'L', 'XL', 'XXL'],
  one: ['One size'],
}

// kind    = which drawing and detail text to use
// fabric  = plain | ankara | adire | asooke (drives the pattern in the picture)
// color   = main fabric colour, alt = pattern accent colour
export const PRODUCTS = [
  // Photo example: { id: 'ankara-wrap', image: '/products/ankara-wrap.jpg', detailImage: '/products/ankara-wrap-detail.jpg' }
  // Trousers
  { id: 'lagos-tailored', kind: 'trousers', variant: 'tailored', fabric: 'plain', col: 'trousers', fit: 'men', title: 'Lagos Tailored Trousers', price: 38000, color: '#1f2430', material: 'Stretch cotton twill', tag: 'Bestseller', blurb: 'A clean, tapered trouser for the office, church and everything after. Flat front, side pockets, and a crease that holds through Lagos traffic.' },
  { id: 'ankara-palazzo', kind: 'trousers', variant: 'palazzo', fabric: 'ankara', col: 'trousers', fit: 'women', title: 'Ankara Palazzo Trousers', price: 32000, color: '#c2491d', alt: '#f3c14b', material: 'Ankara (African wax print cotton)', tag: 'New', blurb: 'High-waisted and wide in the leg, cut from bold wax print with a plain waistband. Dress it up with a fitted top or wear it with a tee.' },
  { id: 'adire-straight', kind: 'trousers', variant: 'straight', fabric: 'adire', col: 'trousers', fit: 'unisex', title: 'Adire Straight-leg Trousers', price: 35000, color: '#1b2f5e', material: 'Hand-dyed adire cotton', blurb: 'Straight-leg trousers in indigo adire, the resist-dyed cloth of Abeokuta. Each pair carries a slightly different dye pattern.' },
  { id: 'linen-wide', kind: 'trousers', variant: 'palazzo', fabric: 'plain', col: 'trousers', fit: 'women', title: 'Linen Wide-leg Trousers', price: 36000, color: '#cdbb97', material: 'Linen blend', blurb: 'Light, breathable and easy in the heat. A relaxed wide leg with an elasticated back waist.' },

  // Skirts
  { id: 'ankara-wrap', kind: 'skirt', variant: 'wrap', fabric: 'ankara', col: 'skirts', fit: 'women', title: 'Ankara Wrap Skirt', price: 28000, color: '#0f6b6f', alt: '#f2a93b', material: 'Ankara (African wax print cotton)', tag: 'Bestseller', blurb: 'A midi wrap skirt that ties at the waist and moves when you do. The overlap is cut so the print falls on the diagonal.' },
  { id: 'office-pencil', kind: 'skirt', variant: 'pencil', fabric: 'plain', col: 'skirts', fit: 'women', title: 'Office Pencil Skirt', price: 25000, color: '#164a37', material: 'Stretch crepe', blurb: 'A knee-length pencil skirt with a back slit and a smooth, wrinkle-resistant finish for long workdays.' },
  { id: 'pleated-midi', kind: 'skirt', variant: 'pleated', fabric: 'plain', col: 'skirts', fit: 'women', title: 'Pleated Midi Skirt', price: 30000, color: '#6b1f2e', material: 'Satin-back crepe', blurb: 'Knife pleats from waist to hem in a deep oxblood. Lightweight, with an elastic waist for comfort.' },
  { id: 'adire-maxi', kind: 'skirt', variant: 'maxi', fabric: 'adire', col: 'skirts', fit: 'women', title: 'Adire Maxi Skirt', price: 33000, color: '#17356e', material: 'Hand-dyed adire cotton', blurb: 'A full, tiered maxi in indigo adire. Roomy enough to dance in.' },

  // Tops
  { id: 'senator-shirt', kind: 'senator', fabric: 'plain', col: 'tops', fit: 'men', title: 'Senator Shirt', price: 42000, color: '#e9e2d0', material: 'Cotton-linen blend', tag: 'Bestseller', blurb: 'The classic long senator top with a mandarin collar and hand-finished chest embroidery. Pair with the matching trousers or your own.' },
  { id: 'embroidered-kaftan', kind: 'kaftan', fabric: 'plain', col: 'tops', fit: 'unisex', title: 'Embroidered Kaftan', price: 48000, color: '#12392c', material: 'Soft cotton', blurb: 'A loose, long kaftan with wide sleeves and gold-thread embroidery at the neck and cuffs. Easy to wear and hard to forget.' },
  { id: 'ankara-buba', kind: 'buba', fabric: 'ankara', col: 'tops', fit: 'women', title: 'Ankara Buba Blouse', price: 22000, color: '#7a2a6b', alt: '#f4d35e', material: 'Ankara (African wax print cotton)', blurb: 'A relaxed buba blouse with bell sleeves and a round neckline. Wear it with an iro, a skirt or trousers.' },

  // Complete outfits
  { id: 'iro-buba', kind: 'irobuba', fabric: 'asooke', col: 'sets', fit: 'women', title: 'Iro and Buba Set', price: 65000, color: '#7b2434', alt: '#c4a15c', material: 'Aso-oke (handwoven)', tag: 'Made to order', blurb: 'A buba and iro wrapper in handwoven aso-oke, made for weddings, naming ceremonies and other days that deserve it.' },
  { id: 'senator-set', kind: 'senatorset', fabric: 'plain', col: 'sets', fit: 'men', title: 'Senator Set', price: 78000, color: '#2b303d', material: 'Premium cashmere-feel suiting', tag: 'Made to order', blurb: 'A senator top with matching trousers, finished with gold-thread embroidery. Cut to your measurements.' },
  { id: 'agbada-set', kind: 'agbada', fabric: 'plain', col: 'sets', fit: 'men', title: 'Three-piece Agbada Set', price: 135000, color: '#26407e', material: 'Guinea brocade', tag: 'Made to order', blurb: 'The full agbada: wide-sleeved outer robe, inner top and matching trousers, with heavy embroidery across the chest and hem.' },

  // Caps and gele
  { id: 'fila-wine', kind: 'fila', fabric: 'asooke', col: 'accessories', fit: 'one', family: 'fila', title: 'Aso-oke Fila Cap, Wine', price: 9500, color: '#7b2434', alt: '#c4a15c', material: 'Aso-oke (handwoven)', blurb: 'A structured fila cap in handwoven aso-oke. Fold the cuff to the side the way you like it.' },
  { id: 'fila-blue', kind: 'fila', fabric: 'asooke', col: 'accessories', fit: 'one', family: 'fila', title: 'Aso-oke Fila Cap, Blue', price: 9500, color: '#243f7a', alt: '#c4a15c', material: 'Aso-oke (handwoven)', blurb: 'A structured fila cap in handwoven aso-oke. Fold the cuff to the side the way you like it.' },
  { id: 'gele-gold', kind: 'gele', fabric: 'asooke', col: 'accessories', fit: 'one', family: 'gele', title: 'Pre-tied Gele, Gold', price: 15000, color: '#b98a2e', alt: '#f1d98a', material: 'Aso-oke blend', tag: 'New', blurb: 'A pre-tied gele that sits perfectly in seconds. No pins, no practice, no stress before the photographer arrives.' },
  { id: 'gele-teal', kind: 'gele', fabric: 'asooke', col: 'accessories', fit: 'one', family: 'gele', title: 'Pre-tied Gele, Teal', price: 15000, color: '#0f6b6f', alt: '#c4a15c', material: 'Aso-oke blend', blurb: 'A pre-tied gele that sits perfectly in seconds. No pins, no practice, no stress before the photographer arrives.' },
]

export const COLLECTIONS = {
  sets: { title: 'Complete outfits', blurb: 'Iro and buba, senator and agbada sets, made to your measurements.', pick: 'iro-buba' },
  trousers: { title: 'Trousers', blurb: 'Tailored, palazzo, adire and linen cuts.', pick: 'ankara-palazzo' },
  skirts: { title: 'Skirts', blurb: 'Wrap, pencil, pleated and maxi.', pick: 'ankara-wrap' },
  tops: { title: 'Tops and kaftans', blurb: 'Senator shirts, kaftans and buba blouses.', pick: 'embroidered-kaftan' },
  accessories: { title: 'Caps and gele', blurb: 'Aso-oke fila caps and pre-tied gele.', pick: 'fila-wine' },
  'all-products': { title: 'Shop all', blurb: 'Everything we make.', pick: 'ankara-palazzo' },
}

export const CATEGORIES = [
  { handle: 'sets', label: 'Complete outfits' },
  { handle: 'trousers', label: 'Trousers' },
  { handle: 'skirts', label: 'Skirts' },
  { handle: 'tops', label: 'Tops and kaftans' },
  { handle: 'accessories', label: 'Caps and gele' },
]

// Shown in "Popular right now" on the home page.
export const FEATURED = ['ankara-wrap', 'lagos-tailored', 'embroidered-kaftan', 'iro-buba', 'adire-straight']

export const FIT_LABEL = {
  women: 'Cut for women (UK sizes)',
  men: 'Cut for men',
  unisex: 'Unisex fit',
  one: 'One size',
}

export const byId = (id) => PRODUCTS.find((p) => p.id === id)
export const sizesFor = (p) => SIZES[p.fit] || SIZES.one
export const needsSize = (p) => sizesFor(p).length > 1

export function detailsFor(p) {
  const rows = [`Fabric: ${p.material}`, FIT_LABEL[p.fit]]
  if (p.col === 'accessories') rows.push('Handmade, so colour and weave vary slightly')
  else rows.push(`Made to order in ${LEAD_TIME_TEXT}`, 'Need a custom fit? Add your measurements at checkout')
  rows.push(p.fabric === 'plain' ? 'Care: dry clean or gentle hand wash' : 'Care: hand wash cold, dry in the shade')
  return rows
}
