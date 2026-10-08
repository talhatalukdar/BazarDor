# 🛒 বাজার দর (BazarDor)

**প্রয়োজনীয় পণ্যের দাম এক নজরে।** BazarDor is a Bangladeshi essentials price-tracking website. It shows today's market price of rice, lentils, oil, vegetables, fish, meat, dairy and spices, how much each price moved since yesterday, and a market-by-market breakdown for every product.

Built for **Programming Hero – Batch 14, Assignment 7**.

- 🌐 **Live site:** _add your Vercel URL here_
- 📦 **Repository:** _add your GitHub URL here_

## ✨ Key Features

1. **Live price board** – a home page with an infinite-scrolling price ticker, the top 6 risers (▲), the top 6 fallers (▼) and a responsive grid of all products, with Bengali numerals and green / red / gray change badges.
2. **Category browsing** – a category page for every product group, with an active-link navbar, a numeric price sort (ডিফল্ট / কম থেকে বেশি / বেশি থেকে কম) and skeleton loaders while data loads.
3. **Protected product details** – `/product/[slug]` requires login and shows min / max / average price plus market-wise prices grouped by division. The guard runs on the server (real `307` redirect), not just in the UI.
4. **Authentication with Better Auth** – email + password, Google and GitHub sign-in, validation, toast feedback, a profile page, and a name-update route.
5. **Resilient and responsive** – works from 320px phones to desktops, friendly 404 / error states, automatic fallback to a second API host, and dynamic routes that survive a hard refresh on Vercel.

## 🧰 Technologies

| Area | Tech |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, Hind Siliguri (Bengali font) |
| Auth | Better Auth + MongoDB adapter |
| UI | react-hot-toast, lucide-react |
| Data | BazarDor REST API (Cloudflare Workers) |

## 🗺️ Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Hero, risers, fallers, all products (`#সব-পণ্য`) |
| `/category/[slug]` | Public | Products of one category with sorting |
| `/product/[slug]` | **Login required** | Price summary and market-wise prices |
| `/signin`, `/signup` | Public (redirects if signed in) | Email + Google + GitHub auth |
| `/profile` | **Login required** | Account info and sign-out |
| `/profile/update` | **Login required** | Update display name |
| any other URL | – | Friendly 404 with "হোম পেজে ফিরে যান" |

## 🚀 Getting Started

```bash
git clone <your-repo-url>
cd bazardor
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev                  # http://localhost:3000
```

Other commands:

```bash
npm run lint    # ESLint
npm run build   # production build
npm run start   # run the production build
```

### Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `BETTER_AUTH_SECRET` | ✅ | Random string, e.g. `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | ✅ | `http://localhost:3000` locally, your Vercel URL in production |
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string (free tier is enough) |
| `MONGODB_DB` | – | Database name, defaults to `bazardor` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | for Google login | Redirect URI: `{BETTER_AUTH_URL}/api/auth/callback/google` |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | for GitHub login | Callback URL: `{BETTER_AUTH_URL}/api/auth/callback/github` |
| `BAZARDOR_API_URL`, `BAZARDOR_API_FALLBACK_URL` | – | Override the API hosts |

Never commit `.env.local`; only `.env.example` is tracked.

## 🔌 API

Base URL: `https://api.api-store.workers.dev/api/bazardor` (fallback: `https://api.abcz.workers.dev/api/bazardor`)

| Endpoint | Description |
| --- | --- |
| `/categories` | All categories |
| `/categories/:id` | One category |
| `/products` | All products |
| `/products?category=chal` | Products of a category |
| `/products/:id` | One product |

All requests go through `src/lib/api.ts`, which validates responses, caches for 5 minutes and switches to the fallback host if the primary one fails.

## 🔐 Authentication notes

- Better Auth handles sessions with secure cookies; the handler lives at `/api/auth/[...all]`.
- Protected pages call `requireSession()` (`src/lib/session.ts`) on the server and redirect to `/signin?callbackUrl=…`, where a toast explains that login is required.
- After sign-up the user is signed out and sent to `/signin`, as the assignment asks.
- Email verification and forgot-password are intentionally not implemented.

## ☁️ Deployment (Vercel)

1. Push the repo to GitHub and import it in Vercel.
2. Add the environment variables above (set `BETTER_AUTH_URL` to the deployed URL).
3. In Google / GitHub OAuth settings, add the production callback URLs.
4. In MongoDB Atlas, allow network access from Vercel (`0.0.0.0/0` for a student project).
5. Deploy, then check `/`, a category, a product (signed in), `/signin`, `/profile`, a hard refresh on `/product/peyaj`, and mobile view.

## 📁 Project structure

```
src/
  app/            routes (home, category, product, signin, signup, profile, api/auth)
  components/     Navbar, PriceTicker, Hero, ProductCard, forms, skeletons, …
  lib/            api.ts, auth.ts, auth-client.ts, session.ts, format.ts (Bengali numerals, sorting)
```

## 🧮 Notes on the numbers

- Prices are stored and sorted as real numbers; Bengali digits are applied only when formatting.
- On the detail page, **min** is the lowest market minimum, **max** the highest market maximum, and **average** the mean of each market's midpoint price.
