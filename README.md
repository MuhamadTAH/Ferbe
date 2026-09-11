# Fêrbe — Learn Kurdish Sorani

Duolingo-style Kurdish (Sorani) learning platform: a learning path of units and
lessons, a deterministic lesson-session engine (multiple choice, word bank,
audio match) with hearts, XP and streaks, plus a flashcard Practice mode.
Built with **Next.js (App Router) · Tailwind CSS · shadcn-style UI · Clerk · Convex**.

## Prerequisites

- Node.js 20+ and npm
- A [Clerk](https://dashboard.clerk.com) account (free tier)
- A [Convex](https://dashboard.convex.dev) account (free tier)

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Where it is used | Where the value comes from |
|---|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | Client bundle (build-time inlined) | `npx convex dev` output, or Convex dashboard → Deployment URL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Client (build-time inlined) | Clerk dashboard → API keys |
| `CLERK_JWT_ISSUER_DOMAIN` | **Convex deployment env var** (server-side) | Clerk dashboard → JWT templates → create a **convex** template → its issuer, e.g. `https://your-app.clerk.accounts.dev` |
| `ADMIN_SEED_SECRET` | Convex deployment env var **and** your shell when seeding | Any strong random secret you generate (e.g. `openssl rand -hex 32`) |
| `TTS_SERVICE_URL` | `scripts/generate-kurdish-audio.ts` only | Local/dev TTS service (optional) |

`CLERK_SECRET_KEY` is not referenced by application code today.

## Local setup

```bash
npm install

# 1) Convex: log in, create/link a deployment, push the schema, generate real codegen
npx convex dev        # interactive login; keep it running or re-run `npx convex dev` once

# 2) Set the two Convex-side env vars in the Convex dashboard:
#    CLERK_JWT_ISSUER_DOMAIN, ADMIN_SEED_SECRET
#    (Dashboard -> your deployment -> Settings -> Environment Variables)

# 3) Copy .env.example to .env.local and fill NEXT_PUBLIC_CONVEX_URL +
#    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

# 4) Seed course content (words, lessons, exercises)
ADMIN_SEED_SECRET=<same value as Convex> npm run seed

# 5) Run
npm run dev           # http://localhost:3000
```

## Quality gates

```bash
npx tsc --noEmit      # zero type errors is the hard requirement
npm run lint          # eslint, 0 errors
npm test              # vitest unit tests (state machine, streaks/XP, quiz gen)
npm run build         # production build
```

## How the app works

- `/` — marketing home
- `/learn` — the learning path (units → lessons). A lesson unlocks when the
  previous one completes (score ≥ 80%).
- `/learn/[lessonId]` — a lesson session driven by a pure client-side state
  machine (`src/lib/sessionMachine.ts`):
  `IDLE → ACTIVE_QUESTION → EVALUATING → FEEDBACK_SUCCESS | FEEDBACK_ERROR → … → SESSION_COMPLETE`.
  Hearts start at 5 (refilled at each session start — an owner default), a wrong
  answer costs one heart and re-queues the exercise, 0 hearts opens the failure
  modal (Restart / Practice). Finishing awards XP (proportional to first-try
  correct answers, recomputed server-side), updates the streak, and stores
  lesson progress.
- `/practice` — flashcard browse + quiz mode (no hearts), persisted mastery.
- `/api/health` — health check JSON: `{status, convex, time}` (always HTTP 200).
- `/sign-in`, `/sign-up` — Clerk-hosted auth pages. `/learn` is protected by
  Clerk middleware.

All user-facing mutations require an authenticated identity (`convex/users.ts`
→ `requireUser`); there is no anonymous/`dev_user` write path. Seeding is
gated by `ADMIN_SEED_SECRET` (no committed default) and the public `seed`
mutation was removed.

## Deployment (Cloudflare + Convex, owner decision)

1. **Convex**: `npx convex dev` for a dev deployment; create a production
   deployment from the dashboard (`npx convex deploy` flow), push the schema,
   set `CLERK_JWT_ISSUER_DOMAIN` + `ADMIN_SEED_SECRET` on it, then seed.
2. **Clerk**: create the production instance, add the **convex** JWT template,
   set the issuer env var on the Convex deployment, use production keys.
3. **Cloudflare Pages/Workers**: this is a standard Next.js App Router app with
   middleware. Use the Cloudflare Next.js adapter
   (`@opennextjs/cloudflare` or `@cloudflare/next-on-pages`) — verify adapter
   compatibility with Next 16 during the first deploy (see docs/RISKLOG.md).
   Set `NEXT_PUBLIC_CONVEX_URL` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` as
   build-time environment variables in the Cloudflare dashboard.

## Known limitations

- 45/50 words have no Kurdish audio; existing MP3s are Windows-SAPI English
  voices reading transliterations (pronunciation quality is not native).
- Word images are Unsplash hotlinks (third-party availability/ToS risk).
- Word-bank sentences in `data/sorani_sentences_draft.json` are draft content
  and need native-speaker review.
- Answers are evaluated client-side for instant feedback (like the original
  spec requires); the server clamps XP/score so a tampered client cannot mint
  rewards, but the raw correctness signal itself is client-reported.
- Without `NEXT_PUBLIC_CONVEX_URL`/Clerk keys at build time the app renders
  explicit "configuration required" states instead of silently degrading.
- No E2E browser tests yet; unit tests cover the pure logic only.
