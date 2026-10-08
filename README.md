# Folarin’s Canvas

A React + Vite demo store for Nigerian fashion (trousers, skirts, kaftans, senator and agbada sets, fila caps and gele), with Paystack checkout and an About me page.

## Run it on localhost

Needs Node.js 20.19+ (or 22.12+).

```bash
npm install
cp .env.example .env     # then paste your Paystack TEST public key into .env
npm run dev
```

Open the address it prints (usually http://localhost:5173). Restart `npm run dev` after editing `.env`.

## Deploy to Vercel

Import this GitHub repository into Vercel. The included `vercel.json` configures Vite's production build (`npm run build`) and output directory (`dist`); Vercel also deploys the `api/` serverless functions. Add the required environment variables in the Vercel project settings before enabling server-mode checkout (see below). Local `.env` files are excluded from Git.

## Set up Paystack

1. Create an account at paystack.com and finish business verification (needed to go live; test mode works straight away).
2. In the dashboard, switch to **Test mode**, then go to **Settings > API Keys & Webhooks**.
3. Copy the **Public key** (`pk_test_...`) into `.env` as `VITE_PAYSTACK_PUBLIC_KEY`.
4. Add something to the cart, press Checkout, fill the form, and pay with the test card: `4084 0840 8408 4081`, any future expiry, CVV `408`.

Paystack charges Nigerian accounts in naira, so checkout is always in NGN even if a visitor browses in USD, GBP or EUR.

### Before you take real money: use server mode

In browser mode the amount is sent from the visitor’s browser, which a technical person can edit. Server mode fixes that: the server works out the price from `src/data/catalog.js`, creates the transaction with your secret key, and confirms the payment afterwards.

1. Deploy to Vercel (it picks up the `api/` folder automatically).
2. In Vercel > Settings > Environment Variables add:
   - `PAYSTACK_SECRET_KEY` = your `sk_...` key (never put this in a `VITE_` variable or in the React code)
   - `VITE_PAYSTACK_PUBLIC_KEY` = your `pk_...` key
   - `VITE_USE_SERVER` = `true`
3. Swap to your **live** keys only after a full test-mode order works.
4. Recommended: in Paystack > Settings > API Keys & Webhooks, add a webhook URL for `charge.success` so orders are recorded even if a customer closes the tab after paying. (Not built yet; `api/verify.js` is the starting point.)

To test server mode on your computer: `npx vercel dev` (needs a free Vercel account).

## Where to edit things

| What | File |
| --- | --- |
| Brand name, email, social links, delivery fees, states | `src/data/site.js` |
| Products, prices, sizes, collections, currencies | `src/data/catalog.js` |
| Colours of the garments and fabric patterns | `src/components/Art.jsx` |
| Paystack code | `src/payments/paystack.js`, `src/components/Checkout.jsx`, `api/` |
| About me text | `src/data/profile.js` and `src/pages/About.jsx` |
| Site colours and spacing | top of `src/styles/index.css` |

Product pictures are drawn in code (SVG) so the demo needs no photos. To use real photos, add an `image` field to each product and swap `<ProductArt>` for an `<img>` in `ProductCard.jsx`, `Product.jsx` and `CartDrawer.jsx`.

## Still to do

- Orders are not stored anywhere. Paystack’s dashboard shows each payment with the customer’s delivery details and items; add a webhook or database when volume grows.
- The mailing list and contact forms do not send anywhere yet.
- The shipping, promise and privacy pages are placeholder text.
- Exchange rates in `catalog.js` are illustrative.
