# Fleuraya — UAE Flower Shop

A full e-commerce storefront and admin panel for a Dubai flower and gifting boutique. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS and Zustand. The site runs entirely on a browser-persisted data layer with rich sample data, so it deploys anywhere with zero backend setup and is structured for a clean swap to PostgreSQL, Stripe and real auth later.

Brand name, colors and copy live in `lib/config.ts` and `tailwind.config.ts`.

## Deploy to Netlify

1. Push this folder to a GitHub repository.
2. In Netlify: **Add new site → Import an existing project → GitHub** and pick the repo.
3. Netlify detects Next.js automatically; `netlify.toml` already sets the build command (`npm run build`), publish directory (`.next`) and Node 20. Just click **Deploy**.
4. After the first deploy, set your site name in Netlify, then update `SITE_URL` in `lib/config.ts` to match and push again so social preview tags resolve correctly.

Before showing anyone: put your real number in `WHATSAPP_NUMBER` (`lib/config.ts`) so the WhatsApp buttons open a live chat.

Local development:

```bash
npm install
npm run dev
```

## Logins

| Where | Login |
|---|---|
| Customer account (`/account` or checkout) | `amira@example.com` / `demo123` |
| More sample customers | `khalid@example.com`, `sofia@example.com` (same password) |
| Admin panel (`/admin`) | `admin@fleuraya.ae` / `admin123` |

Live promo codes: `WELCOME10` (10% off), `LOVE50` (AED 50 off orders over AED 300). `RAMADAN15` is expired on purpose, to show validation.

The credentials are intentionally not shown anywhere on the site itself. Share them privately with whoever needs to explore the admin.

## What's inside

**Storefront**
- Home: hero, occasion tiles, featured and best-seller rows, trust strip, category shortcuts, reviews
- Shop: filters (occasion, category, color, price), sorting, search and pagination, all URL-driven so filtered views are shareable
- Product page: gallery, Standard/Deluxe/Premium pricing, add-ons (cake, chocolates, balloons, card, teddy), 200-character gift message, delivery date and time slots including 1-hour Express for Dubai
- Cart with promo codes, persisted across sessions
- Checkout: guest or sign-in, UAE address fields per emirate, payment method selection (Card, Apple Pay, Google Pay, Tabby, Tamara), order confirmation with order number
- Account: order history with live statuses, saved addresses, loyalty points with a progress bar (1 point per AED 10, reward at 500)
- Pages: About, Contact (form + WhatsApp), Delivery zones, FAQ, Terms, Privacy
- English/Arabic toggle with real RTL layout flipping, mobile-first, AED throughout

**Admin (`/admin`)**
- Dashboard: revenue, order count, average order value, 7-day revenue chart, orders by status, low-stock alerts
- Products: full CRUD with size pricing, stock, occasions, active and best-seller flags
- Categories and occasions management
- Orders: filter by status, update status inline, order detail with a print-ready delivery slip
- Customers: lifetime spend, order history, loyalty points
- Promo codes: CRUD with type, minimum order, expiry, usage limits
- Delivery zones: fees, free-delivery thresholds, areas and slots per emirate
- Content: edit the hero, announcement bar and featured products with live preview

Anything changed in the admin shows up on the storefront immediately and survives a refresh. The **Restore sample data** button in the admin sidebar resets everything to the original seed, useful between viewings.

## Architecture

There is no server yet by design. The data layer is a persisted Zustand store shaped exactly like a real backend:

```
lib/types.ts         All domain models (Product, Order, Customer, PromoCode, DeliveryZone, ...)
lib/data/seed.ts     Sample data: 34 products, 9 orders, customers, promos, zones, reviews
lib/data/db.ts       The data store with typed CRUD actions, persisted to localStorage
lib/data/api.ts      Async facade (validatePromo, placeOrder, login, register) mimicking API latency
lib/store/cart.ts    Cart state
lib/store/session.ts Customer and admin session
```

Because storefront and admin read from the same store, admin edits reflect instantly. Each visitor's browser holds its own copy of the data, which is exactly what you want when several people are exploring the same deployment: nobody can break the site for anyone else.

## Going to production

The data layer is deliberately shaped so the swap is mechanical:

1. **Database.** Mirror `lib/types.ts` as a Prisma schema on PostgreSQL. Each action in `lib/data/db.ts` maps 1:1 to a Prisma call behind an API route or server action. Components never touch storage directly, so the UI does not change. Look for `TODO: integrate Postgres/Prisma` comments.
2. **Payments.** `placeOrder()` in `lib/data/api.ts` currently simulates the charge. Replace it with a Stripe PaymentIntent (cards, Apple Pay and Google Pay come with Stripe) plus Tabby/Tamara checkout sessions, creating the order only after the webhook confirms. Look for `TODO: integrate Stripe`. Until then, no card is ever charged and card details never leave the visitor's browser.
3. **Auth.** Swap the sample `login`/`register` in `lib/data/api.ts` for NextAuth.js or Clerk. Sessions are read only through `lib/store/session.ts`, so the change is contained.
4. **Email.** The simulated receipt in `placeOrder()` becomes a transactional email (Resend, SES).
5. **Images.** Product photos are Unsplash URLs with a styled fallback (`components/site/product-image.tsx`). Replace with the shop's photography on S3/Cloudinary and remove `unoptimized` in `next.config.mjs` to enable Next image optimization.

## Notes

- Fonts (Fraunces, Inter, Tajawal) load from Google Fonts at runtime via `app/globals.css`. Swapping to `next/font` is a quick change worth making alongside the production work above.
- Arabic strings are working translations; have a native speaker review before a public launch.
- Sample account passwords are plain text on purpose; real auth replaces them entirely (step 3).
