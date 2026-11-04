# VEXO

A full-stack e-commerce platform built as a monorepo: a customer storefront, a merchant admin panel, a platform super-admin panel, and the API behind all three.

Built end to end as a personal project — every app, the API, the data model and the deployment setup.

```
┌─────────────┐  ┌─────────────┐  ┌──────────────┐
│   client    │  │    admin    │  │ super-admin  │
│  storefront │  │  merchant   │  │   platform   │
└──────┬──────┘  └──────┬──────┘  └──────┬───────┘
       └────────────────┼────────────────┘
                        │  REST / JSON
                 ┌──────┴───────┐
                 │    server    │  Express · TypeScript
                 └──────┬───────┘
                        │
                 ┌──────┴───────┐
                 │   MongoDB    │  Mongoose
                 └──────────────┘
```

---

## Stack

| | |
|---|---|
| Monorepo | Turborepo, pnpm workspaces |
| Frontend | React 18, Vite, TypeScript, Tailwind, Zustand, TanStack Query, React Hook Form |
| Backend | Node.js, Express, TypeScript, Mongoose |
| Database | MongoDB |
| Auth | JWT access + refresh tokens over httpOnly cookies, bcrypt |
| Payments | Razorpay, with webhook signature verification |
| Media | Cloudinary, multer |
| Validation | zod — shared schemas package consumed by the API |
| Deployment | Docker, Render (API), Netlify (front ends) |

---

## Apps and packages

```
apps/
  client/        Customer storefront — browse, cart, wishlist, checkout, orders, profile
  admin/         Merchant panel — products, orders, customers, coupons, dashboard
  super-admin/   Platform panel — admins, users, orders, products, coupons
  server/        Express API
packages/
  shared-types/  TypeScript types, consumed by the API
  validators/    zod request schemas, consumed by the API
```

---

## Access model

Three roles, enforced server-side on every protected route.

| Role | Can do |
|---|---|
| `customer` | Browse, cart, wishlist, place orders, write reviews, manage own profile |
| `admin` | Everything above, plus manage products, orders, coupons and customers |
| `superadmin` | Everything above, plus manage admin accounts and platform-wide data |

Authentication uses a short-lived access token with a longer-lived refresh token, both set as httpOnly cookies so they are not readable from JavaScript. Cross-site cookie settings are configured for production, where the front ends and the API are on different origins.

---

## Data model

Seven Mongoose models: `User`, `Product`, `Order`, `Cart`, `Wishlist`, `Coupon`, `Review`.

---

## API

All routes are mounted under `/api`.

| Route group | Covers |
|---|---|
| `/auth` | Register, login, refresh, logout |
| `/products` | Listing, search, detail, admin CRUD |
| `/cart` | Add, update quantity, remove |
| `/wishlist` | Add, remove, list |
| `/orders` | Place, list own, admin view and status updates |
| `/payment` | Razorpay order creation, verification, webhook |
| `/coupons` | Validate at checkout, admin CRUD |
| `/reviews` | Create, list by product, moderate |
| `/admin` | Dashboard metrics, user and admin management |

---

## Running it locally

**Requirements:** Node 20+, pnpm 9, and a MongoDB instance (local or Atlas).

```bash
pnpm install
cp .env.example .env     # then fill in the values below
pnpm seed                # optional: seed sample products and an admin user
pnpm dev                 # runs all apps via Turborepo
```

Individual apps:

```bash
pnpm dev:server
pnpm dev:client
pnpm dev:admin
pnpm dev:super-admin
```

### Environment

Copy `.env.example` and fill it in. Nothing in this repo contains real credentials, and nothing should.

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Signs access tokens |
| `JWT_REFRESH_SECRET` | Signs refresh tokens |
| `JWT_EXPIRE` / `JWT_REFRESH_EXPIRE` | Token lifetimes (default `15m` / `7d`) |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Razorpay API credentials |
| `RAZORPAY_WEBHOOK_SECRET` | Verifies incoming webhook signatures |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Image uploads |
| `PORT` | API port (default `5000` in dev, `8080` in the container) |
| `CLIENT_URL` / `ADMIN_URL` | Allowed CORS origins |

---

## Deployment

The API ships as a Docker image. The build uses Turborepo so workspace dependencies are compiled in the right order:

```bash
docker build -t vexo-api .
docker run -p 8080:8080 --env-file .env vexo-api
```

**Secrets are never baked into the image.** The Dockerfile sets only `NODE_ENV` and `PORT`; everything else is supplied at runtime by the host — Render's environment variables in production, `--env-file` locally.

The three front ends are static Vite builds. Each has a `public/_redirects` so client-side routes resolve on Netlify, and each reads its API base URL from `VITE_API_URL` at build time.

---

## Notes on a few decisions

**A monorepo rather than separate repositories.** Three front ends and one API are developed together, so they live together. Turborepo builds the workspace packages before the app that depends on them, and `pnpm dev` runs all four apps at once — which matters when a change touches the API and a front end in the same sitting.

**Shared packages for types and validation.** `shared-types` and `validators` are workspace packages linked with `workspace:*`, so the API imports them directly with no publish step. Today only the API consumes them; the three front ends validate their own forms with their own zod schemas. Pulling the front ends onto the same shared schemas is the next refactor — it would stop client and server validation drifting apart.

**Cookies rather than localStorage for tokens.** httpOnly cookies aren't readable by scripts, which closes off token theft via XSS. The trade-off is CORS and cross-site cookie configuration, which took some work to get right in production.

**Razorpay webhooks are signature-verified.** Payment confirmation comes from the verified webhook, not from the browser reporting success.

---

## Status

A personal project, not a commercial product. There is no automated test suite — the next thing I would add, starting with the payment and auth routes.
