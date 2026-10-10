# 🛒 বাজার দর (BazarDor)

**প্রয়োজনীয় পণ্যের দাম এক নজরে।**

BazarDor is a Bangladeshi essentials price-tracking web application that helps users explore current market prices of everyday products, compare price changes, and view market-wise price breakdowns across Bangladesh.

Built for **Programming Hero – Batch 14, Assignment 7**.

- 🌐 **Live Site:** https://bazardor-snowy.vercel.app/
- 📦 **Repository:** https://github.com/talhatalukdar/BazarDor

## ✨ Key Features

1. **Live Price Board** — Browse everyday essentials with an infinite-scrolling price ticker, top price risers and fallers, and a responsive product grid. Price changes use color-coded indicators and Bengali numerals.
2. **Category Browsing** — Explore products by category, navigate with active-link indicators, sort prices from low to high or high to low, and view loading skeletons while data loads.
3. **Protected Product Details** — Authenticated users can view a breadcrumb, today's price with its change, minimum / maximum / average price cards, and a market-wise price table (market, division, minimum, maximum, average). Access is protected through server-side session checks.
4. **Multiple Authentication Options** — Sign up and sign in using email and password, Google, or GitHub, powered by Better Auth.
5. **Profile Management** — View account information, update your display name through a dedicated profile update page using Better Auth's `updateUser`, and sign out securely.
6. **Form Validation and Feedback** — Get validation messages and toast notifications for authentication and profile actions.
7. **Responsive User Interface** — Designed for mobile phones, tablets, and desktops, with friendly error and not-found pages.
8. **Resilient API Integration** — Validates API responses, caches data for five minutes, and supports a fallback API host when the primary host fails.
9. **Production-Ready Routing** — Supports dynamic routes and direct page refreshes on Vercel.

## 🧰 Tech Stack

| Area | Technologies |
|---|---|
| Framework | Next.js 16, App Router |
| UI Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Font | Hind Siliguri |
| Authentication | Better Auth |
| Database | MongoDB Atlas |
| Notifications | react-hot-toast |
| Icons | lucide-react |
| Data Source | BazarDor REST API |
| Deployment | Vercel |

## 🗺️ Application Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Homepage, price ticker, risers, fallers, and all products |
| `/category/[slug]` | Public | Browse and sort products by category |
| `/product/[slug]` | Login required | Product price summary and market-wise price table |
| `/signin` | Public | Sign in with email/password, Google, or GitHub |
| `/signup` | Public | Create an account |
| `/profile` | Login required | View account details and sign out |
| `/profile/update` | Login required | Update your display name |
| Any unmatched route | Public | Custom 404 page with a link back to the homepage |

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm
- MongoDB Atlas account
- Google and/or GitHub OAuth credentials if you want to enable social login locally

### Installation

```bash
git clone https://github.com/talhatalukdar/BazarDor.git
cd BazarDor
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Configure the required environment variables in `.env.local`, then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev     # Start the development server
npm run lint    # Run ESLint
npm run build   # Build for production
npm run start   # Start the production server
```

## ⚙️ Environment Variables

Configure the following variables in `.env.local` for local development and in Vercel for deployment.

| Variable | Required | Description |
|---|---|---|
| `BETTER_AUTH_SECRET` | Yes | Secret used by Better Auth |
| `BETTER_AUTH_URL` | Yes | Application base URL |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `MONGODB_DB` | No | Database name; defaults to `bazardor` |
| `GOOGLE_CLIENT_ID` | For Google login | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | For Google login | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | For GitHub login | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | For GitHub login | GitHub OAuth app client secret |
| `BAZARDOR_API_URL` | No | Override the primary API host |
| `BAZARDOR_API_FALLBACK_URL` | No | Override the fallback API host |

For local development, set `BETTER_AUTH_URL` to:

```env
BETTER_AUTH_URL=http://localhost:3000
```

For production, set it to your deployed application URL:

```env
BETTER_AUTH_URL=https://bazardor-snowy.vercel.app
```

### OAuth Callback URLs

Register the following callback URLs with the corresponding OAuth providers.

**Google OAuth:**

```text
https://bazardor-snowy.vercel.app/api/auth/callback/google
```

**GitHub OAuth:**

```text
https://bazardor-snowy.vercel.app/api/auth/callback/github
```

For local testing, also add the `http://localhost:3000/api/auth/callback/...` equivalents. Replace the domain if your primary production domain changes. Never commit `.env.local` or expose OAuth client secrets in source control.

## 🔌 REST API

**Primary API Base URL:**

`https://api.api-store.workers.dev/api/bazardor`

**Fallback API Base URL:**

`https://api.abcz.workers.dev/api/bazardor`

| Endpoint | Description |
|---|---|
| `/categories` | Retrieve all categories |
| `/categories/:id` | Retrieve a specific category |
| `/products` | Retrieve all products |
| `/products?category=chal` | Retrieve products filtered by category |
| `/products/:id` | Retrieve a specific product |

API requests are handled through `src/lib/api.ts`. The API utility validates responses, caches data for five minutes, and can switch to the fallback host when the primary host fails.

## 🔐 Authentication and Security

- Better Auth manages authentication and sessions through `/api/auth/[...all]`.
- Supported sign-in methods include email/password, Google, and GitHub.
- Protected pages perform server-side session checks through `requireSession()` in `src/lib/session.ts`.
- Unauthenticated users accessing protected pages are redirected to `/signin?callbackUrl=…`, where a toast explains that login is required.
- Signed-in users can view their profile, update their display name on `/profile/update` with Better Auth's `updateUser`, and sign out.
- After registration, users are signed out and redirected to the sign-in page, following the assignment requirements.
- Email verification and password recovery are not implemented.

## ☁️ Deployment on Vercel

1. Push the project to GitHub and import the repository into Vercel.
2. Configure the required environment variables for the appropriate deployment environments.
3. Set `BETTER_AUTH_URL` to the production domain for Production deployments.
4. Register the correct production OAuth callback URLs with Google and GitHub.
5. Configure MongoDB Atlas network access and database permissions appropriately.
6. Deploy the application and verify authentication, profile updates, product browsing, and protected routes.
7. Ensure Production deployment protection is configured to allow public visitors to access the live website.

## 📁 Project Structure

```text
src/
├── app/
│   ├── page.tsx
│   ├── category/[slug]/
│   ├── product/[slug]/
│   ├── signin/
│   ├── signup/
│   ├── profile/
│   ├── profile/update/
│   └── api/auth/[...all]/
├── components/
│   ├── Navbar
│   ├── PriceTicker
│   ├── Hero
│   ├── ProductCard
│   └── Forms, skeletons, and shared UI
└── lib/
    ├── api.ts
    ├── auth.ts
    ├── auth-client.ts
    ├── session.ts
    └── format.ts
```

*Note: The structure above is a high-level overview; exact filenames and nesting may vary.*

## 🧮 Price Calculation and Formatting

- Prices are stored and sorted as numeric values; Bengali numerals are applied only during display formatting.
- **Minimum price:** The lowest reported market minimum.
- **Maximum price:** The highest reported market maximum.
- **Average price:** The mean of the midpoint prices across the reported markets.
- In the market-wise table, each row's **average** is `(minimum + maximum) / 2`, and rows are sorted from the lowest to the highest average.

---

**Developed by Talha Talukdar**  
BSc in Computer Science and Engineering | Software Engineering  
American International University-Bangladesh (AIUB)