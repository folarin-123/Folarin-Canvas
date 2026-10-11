# Folarin’s Canvas

A React + Vite storefront for Nigerian fashion, with made-to-order clothing and WhatsApp checkout.

## Run locally

Needs Node.js 20.19+ (or 22.12+).

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. No environment variables are required.

## Orders and payments

Customers add products to their cart, enter contact and delivery details, review the order message, and choose **Send order on WhatsApp**. The message opens a chat with the shop; the customer confirms when they have sent it. Availability, final delivery costs and payment are arranged directly in WhatsApp.

To change the WhatsApp number or the payment note shown during checkout, edit `WHATSAPP` or `PAYMENT_NOTE` in `src/data/site.js`. Use the international number with digits only for `WHATSAPP.number`; `WHATSAPP.display` is the human-readable number.

## Products and photos

Product data, prices, sizes and collections are in `src/data/catalog.js`. Product artwork uses inline SVG by default. To use a photo, add an `image` URL (and optionally `detailImage`) to a product; see `public/products/README.md`.

## Deploy to Vercel

Import the repository into Vercel. The included `vercel.json` configures the Vite production build and `dist` output. Run `npm run build` to test a production build locally.

## Project map

| What | File |
| --- | --- |
| Brand, WhatsApp number, payment note, delivery fees and states | `src/data/site.js` |
| Products, prices, sizes, collections and currencies | `src/data/catalog.js` |
| Pricing validation and delivery calculations | `src/data/pricing.js` |
| WhatsApp order messages and links | `src/utils/whatsapp.js` |
| Storefront styles | `src/styles/index.css` |
