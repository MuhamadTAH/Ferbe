<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Fêrbe — repository notes

Duolingo-style Kurdish (Sorani) learning app: Next.js 16 App Router built with
`--webpack` (**not** Turbopack), React 19, Tailwind 4, Clerk auth, Convex backend,
deployed to Cloudflare Pages. `CLAUDE.md` just re-exports this file, so keep guidance here.

## Commands
- `npm run dev` — dev server (rewrites the Next.js block above; keep it in commits).
- `npm run build` — `next build --webpack`.
- `npx tsc --noEmit` — typecheck; **0 errors is the baseline**.
- `npm test` — vitest, colocated `src/**/*.test.{ts,tsx}`, node env, 88 tests / 9 files.
- `npm run lint` — eslint. `npx eslint .` over the whole repo **times out (>5 min)**;
  lint only the files you touched: `npx eslint <files>`.
- Seeding (one per course): `npm run seed`, `seed:sunrise3`, `seed:english`,
  `seed:foundations`, `seed:mahdi`.

## Known-red and expected noise
- Pre-existing lint error `src/hooks/useActiveCourse.ts:104`
  (`react-hooks/set-state-in-effect`) — not yours; don't fix it in unrelated work.
- `@next/next/no-img-element` warnings are everywhere: plain `<img>` is the project
  convention (sized with Tailwind), not `next/image`. Match the surrounding code.

## Deploy and verify
- Cloudflare Pages builds from Git on push to `main` (build `npm run build:cf`, output
  `.open-next/assets`). Prod: https://ferbe.pages.dev
- The deploy webhook is flaky. After pushing, confirm the live commit with
  `GET https://ferbe.pages.dev/_cf_health` and read `cf_commit`. If it hasn't moved
  within ~10 min, re-trigger with an empty commit (`git commit --allow-empty`) and push.
- `GET /_cf_errors` dumps the last captured server errors; add `?debug` to any 500 for the trace.
- Do not hand-edit build plumbing: `scripts/prepare-cf-pages.js` generates `_routes.json`
  and a `_worker.js` shim (OpenNext + Next 16 on Cloudflare) at build time.

## Convex (backend)
- One shared deployment (`qualified-egret-206`); run `npx convex dev` to push schema and
  regenerate `convex/_generated`.
- Seed scripts default to the **production** URL and secret when env vars are unset, so
  `npm run seed:*` writes straight to prod. Expected here, not an accident.
- Seeding is idempotent: units/lessons upsert by `order`; exercises are deleted and
  recreated every run. Change a lesson by editing its `scripts/seed-*.ts`, then re-run.
- `exercises.type` is only `multiple_choice | word_bank | audio_match`; richer UIs are
  chosen by `solutionData.subtype` (a `v.any()` field) and dispatched in
  `src/app/learn/[lessonId]/page.tsx` (~39 subtype branches). To add one, add a view in
  `src/components/lesson/` and a branch there — no schema change needed.

## Courses and the learning path
- Courses come from `AVAILABLE_COURSES` (`src/hooks/useActiveCourse.ts`):
  `english-foundations`, `english-from-kurdish` (default), `mohammed-mahdi-english`,
  `sunrise-3`.
- Switch course with `?course=<slug>` (persists to `localStorage`). To view a Sunrise 3
  lesson, open `/learn?course=sunrise-3`.
- `/learn` locks a unit until every lesson of the previous unit is complete (units whose
  title contains `ungated`/`orientation`/`دەستپێک` are not gated). The lesson page itself
  is ungated, so reach a specific lesson at `/learn/<lessonId>`.
- Most lessons are empty placeholders; only content you seeded is playable.

## Sunrise 3 authoring (current workstream)
Read all of these before writing code:
1. `docs/sunrise3-practice-progress.md` — progress surfaces to reuse; never add a new store.
2. `docs/sunrise3-practice-1-rules.md` — chunking, image-sourcing and reuse rules.
3. `C:\Users\tarqm\Downloads\Sunrise- 3 SB.pdf` — the book (the practice's page).
4. `docs/sunrise3-practice-designs.md` — where the practice sits in the plan.
- The book is **image-scanned; the model cannot read the PDF.** Extract text/images
  locally with Python + PyMuPDF (`fitz`). Extracted text: `data/sunrise3_raw.txt`.
- Images: crop the real picture out of the book PDF into `public/images/sunrise3/<topic>/`;
  if it cannot be extracted, use an emoji placeholder — never leave a slot empty.
- Ship flow: edit `scripts/seed-sunrise3-course.ts` → `npm run seed:sunrise3` → run the
  gates → commit only changed files → push → verify `cf_commit`.
- Never `git add .`: scratch files must not be committed (`_merge.js`, `_p78.txt`,
  `p7-11.txt`, `chat-clean.txt`, `gemini-*.json/txt`, `data/sunrise3_raw.txt`,
  `practice-progress.md`). Stage files explicitly.

## Conventions
- Path alias `@/*` → `src/*`.
- User-facing Convex mutations require an authenticated identity (`convex/users.ts` →
  `requireUser`). Answers are graded client-side for instant feedback, and the server
  clamps XP/score so a tampered client cannot mint rewards.
