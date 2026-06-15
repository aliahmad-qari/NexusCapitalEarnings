# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Nexus Capital is a daily-ROI investment platform (Pakistani market, currency PKR). Users deposit via JazzCash/EasyPaisa, upload a payment screenshot, an admin verifies it, and an hourly cron job credits daily profit to the investment. The single React codebase ships three ways: as a Vercel website, a Render-hosted backend, and a Capacitor Android APK/PWA.

## Commands

```bash
npm run dev          # Dev: tsx runs server.ts, which mounts Vite as middleware (single port 3000)
npm run build        # vite build → dist/ (also builds PWA service worker)
npm run start        # Production: serve prebuilt dist/ + API (NODE_ENV=production)
npm run prod         # build + start
npm run lint         # tsc --noEmit && eslint .  (the only check; there are no tests)
npm run clean        # rm -rf dist

# Android APK (see APK_BUILD_GUIDE.md for full flow)
npm run cap:sync     # build + npx cap sync android
npm run apk:debug    # build + sync + gradlew assembleDebug
npm run apk:release  # build + sync + gradlew assembleRelease
```

There is **no test suite**. `npm run lint` (typecheck + eslint) is the validation gate before committing.

## Architecture

### Single-process dev server
`server.ts` is the entry point for both dev and prod. It connects to MongoDB, seeds plans, starts the ROI cron, mounts the Express API under `/api`, and serves `/uploads`. In dev it attaches Vite as connect middleware (`middlewareMode`); in prod it serves static `dist/` and falls back to `index.html` for client-side routes. **One port (3000) serves both frontend and API** — there is no separate API process.

### Backend (`server/`)
Classic Express MVC, all files use explicit `.ts` import extensions (required by the tsx/ESM setup):
- `routes/api.ts` — every route; `auth` and `adminAuth` middleware gate protected/admin endpoints.
- `controllers/` — auth, wallet, investment, admin, analytics.
- `models/` — Mongoose schemas. Note the `(mongoose.models.X || mongoose.model(...))` guard pattern to survive hot-reload. Some models (`PaymentSetting`, `ReferralSetting`) are lazily `await import()`-ed inside route handlers.
- `jobs/profitJob.ts` — the ROI engine.
- `middlewares/auth.ts` — JWT in `Authorization: Bearer`; `req.userId` is set from the token, user is re-fetched each request so `isBlocked`/`isAdmin` changes take effect immediately.

### The core money flow (read this before touching deposits/investments)
1. **`createDepositRequest`** (`investmentController.ts`, multipart upload) atomically creates a **Deposit + Investment + Transaction**, all `status: 'pending'`, cross-linked by ObjectId. One request = one record set; do not create these separately.
2. **`approveManualDeposit`** (`adminController.ts`) flips the deposit to `approved`, activates the linked investment (sets `startDate`/`endDate`/`lastProfitDate = now`, `status: 'active'`), bumps `user.wallet.depositBalance`, and **updates the existing pending Transaction** rather than inserting a new one. Rejection cancels the pending investment.
3. **`processROI`** (`profitJob.ts`) runs **every hour**, but each active investment is individually guarded by a 24h window via `lastProfitDate` (skips if <20h elapsed). It credits `principalAmount * dailyROI / 100` to `wallet.totalBalance` + `wallet.profitBalance`, decrements `remainingDays`, and on completion returns principal to `totalBalance` and marks the investment `completed`. All amounts/ROI/duration come from the Investment document — nothing hardcoded.

### Wallet semantics (`user.wallet`)
- `totalBalance` — available/withdrawable PKR (profit + returned principal).
- `depositBalance` — cumulative invested principal (tracking, **not** spendable).
- `profitBalance` — total ROI earned.
- `referralEarnings` — referral rewards (PKR per referral, default 85, set via `REFERRAL_REWARD_PKR`). This wallet field is the source of truth for referral totals, not a computed sum.

### Plan seeding
`seedPlans()` in `server.ts` runs on every boot: it de-duplicates plans by name and guarantees 5 canonical plans (Starter/Bronze/Silver/Gold/Diamond) exist and are active. Editing canonical plan defaults means editing this function.

### Frontend (`src/`)
- React 19 + React Router 7, Vite, Tailwind v4 (`@tailwindcss/vite`, no separate config), Framer Motion, Recharts, lucide-react.
- `App.tsx` defines all routes. `ProtectedRoute`/`AdminRoute` wrap dashboard/admin pages; unauthenticated users redirect to `/`.
- `hooks/useAuth.tsx` — auth context. On startup it always re-fetches `/api/auth/profile` to pick up server-side `isAdmin`/`isBlocked` changes, falling back to cached `localStorage` user only on network failure. Token + user live in `localStorage`.
- `utils/api.ts` — `apiCall()` wrapper; reads token from `localStorage`, base URL from `VITE_API_URL` (defaults to `http://localhost:3000`).
- `@` path alias maps to the repo root.

### Deployment topology
- **Frontend**: Vercel (`vercel.json`). Multiple origins in use (`nexus-capital-earnings.vercel.app`, `roiwealth.vercel.app`).
- **Backend**: Render (`render.yaml`), `https://nexuscapitalearnings.onrender.com`. Secrets `MONGODB_URI`/`JWT_SECRET` are `sync: false`.
- **APK**: Capacitor (`capacitor.config.ts`, appId `com.nexuscapital.app`) bundles `dist/` and calls the Render backend; `VITE_API_URL` is baked in at build time.
- CORS (`server.ts`) allow-lists localhost, all `*.vercel.app`, local network IPs, and Capacitor WebView origins (`capacitor://localhost`, `https://localhost`) via a custom origin function. Add new origins to `FRONTEND_URL`/`ADDITIONAL_ORIGINS` env vars rather than hardcoding.

## Conventions & gotchas
- **Import extensions**: backend imports must include `.ts` (e.g. `'./models/User.ts'`) — the ESM/tsx runtime requires it.
- **Currency**: all money is integer PKR, formatted with `toLocaleString('en-PK')`. Profit uses `Math.round`.
- **Logging**: backend uses Winston (`server/utils/logger.ts`); `console.log` is also used in controllers for request tracing.
- **Manual ROI trigger**: `POST /api/admin/trigger-roi` runs `processROI` on demand (admin-only) for testing without waiting 24h.
- `GEMINI_API_KEY`/`@google/genai` is a dependency but only wired through `vite.config.ts` define; the README's "AI Studio app" text is boilerplate and not reflective of current functionality.
