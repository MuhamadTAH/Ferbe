# Fêrbe — Production Deployment Manual

This guide walks you through deploying **Fêrbe** to production with **Cloudflare Pages**, **Convex Cloud** (database), and **Clerk** (authentication).

---

## Architecture Overview

```
[ Learner Browser ]
       │
       ▼
[ Cloudflare Pages Edge (Global CDN + SSL) ]
       │
       ├──► [ Clerk Authentication ] (User Identity & JWT)
       │
       └──► [ Convex Cloud ] (Real-time Database & Reactive Queries)
```

---

## 1. Authentication Setup (Clerk)

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com) and create or select your application.
2. In the left navigation, go to **API Keys**:
   - Copy **Publishable key** (`pk_live_...` or `pk_test_...`)
   - Copy **Secret key** (`sk_live_...` or `sk_test_...`)
3. Set up the **Convex JWT Template**:
   - In Clerk Dashboard, go to **Configure** -> **JWT Templates**.
   - Click **+ New template** -> select **Convex**.
   - The template will be created with Name: `convex` and Claims: `{"aud": "convex"}`.
   - Copy the **Issuer** URL (e.g. `https://your-app.clerk.accounts.dev`).

---

## 2. Database Setup (Convex Cloud)

1. Go to [dashboard.convex.dev](https://dashboard.convex.dev) and select your project (`qualified-egret-206`).
2. Go to **Settings** -> **Environment Variables**:
   - Add `CLERK_JWT_ISSUER_DOMAIN` = `<Paste your Clerk Issuer URL>`
   - Add `ADMIN_SEED_SECRET` = `<Choose any secure passphrase, e.g. ferbe-secret-2026>`
3. Generate a Deploy Key:
   - In Convex Dashboard, go to **Settings** -> **Deploy Keys**.
   - Click **Generate Deploy Key** (Production).
   - Copy the key (`prod:qualified-egret-206|...`).
4. Deploy the backend functions and schema from your terminal:
   ```bash
   # Set the deploy key in your environment or .env
   $env:CONVEX_DEPLOY_KEY="prod:qualified-egret-206|..."
   npx convex deploy
   ```
5. Seed the production database with curriculum, lessons, and vocabulary:
   ```bash
   $env:CONVEX_URL="https://qualified-egret-206.convex.cloud"
   $env:ADMIN_SEED_SECRET="ferbe-secret-2026"
   npm run seed
   ```

---

## 3. Frontend Hosting (Cloudflare Pages)

1. Ensure your latest code is committed and pushed to GitHub:
   ```bash
   git add .
   git commit -m "feat: production deployment setup"
   git push origin main
   ```
2. In the Cloudflare Dashboard ([dash.cloudflare.com](https://dash.cloudflare.com)):
   - Go to **Compute (Workers & Pages)** -> **Create application**.
   - Select the **Pages** tab -> click **Connect to Git**.
   - Choose your GitHub repository (`ferbe`).
3. Set Build Settings in Cloudflare Pages:
   - **Framework Preset**: `None` (or `Next.js`)
   - **Build command**: `npm run build:cf`
   - **Build output directory**: `.open-next/assets`
   - **Root directory**: `/`
4. Add **Environment Variables** in Cloudflare:

| Variable | Value | Notes |
|---|---|---|
| `NODE_VERSION` | `20` | **Mandatory**: Next.js 16 requires Node 20.9+ |
| `NEXT_PUBLIC_CONVEX_URL` | `https://qualified-egret-206.convex.cloud` | Your Convex Cloud endpoint |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_...` (or `pk_live_...`) | From Clerk Dashboard |
| `CLERK_SECRET_KEY` | `sk_test_...` (or `sk_live_...`) | From Clerk Dashboard |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` | Sign-in page |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` | Sign-up page |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/learn` | Redirect post sign-in |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/learn` | Redirect post sign-up |

5. Click **Save and Deploy**. Cloudflare will build your application and assign you a live production URL (`https://ferbe.pages.dev`).

---

## 4. Verification & Health Probes

- **Health Probe**: Once deployed, visit `https://your-domain.pages.dev/api/health`. It will return:
  ```json
  { "status": "ok", "convex": "reachable", "time": "..." }
  ```
- **Auth Flow**: Visit `/learn`. If not signed in, you will be redirected to `/sign-in`. After authenticating with Clerk, you will be returned to `/learn` with your streak, hearts, and active unit loaded from Convex Cloud.
- **Unit Tests**: Run tests locally anytime with:
  ```bash
  npm test
  ```
