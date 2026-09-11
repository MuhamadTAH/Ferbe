# Risk log

| # | Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| 1 | GitHub remote was empty; all work lived on one machine | Total project loss | Was certain, now mitigated | Local commits exist; owner push approval pending — push as soon as credentials are available |
| 2 | 45/50 words lack Kurdish audio; shipped MP3s are SAPI English voices reading transliterations | Poor pronunciation quality harms the core learning value | High | Ship with an "Audio unavailable"/quality flag; wire `scripts/generate-kurdish-audio.ts` to a real Kurdish TTS later (cost needs owner approval) |
| 3 | Word-bank sentences (`data/sorani_sentences_draft.json`) are drafted without native-speaker review | Wrong Kurdish teaches mistakes | Medium | File marked `_draft content_`; owner (native speaker) reviews before public launch |
| 4 | Unsplash hotlinks for all word images | Broken images / ToS issues | Medium | Replace with self-hosted assets (owner deferred: "we will fix that later") |
| 5 | Answers evaluated client-side; server trusts client-reported correctness for scoring inputs | A tampered client could report perfect scores | Medium | Server clamps correctFirstTry/total and recomputes XP; full server-side validation would require leaking solutions server-side or sending answers per-request — accepted for v1 (documented) |
| 6 | Cloudflare adapter compatibility with Next.js 16 (App Router + middleware) | Deployment friction at deploy time | Medium | App is adapter-agnostic (no Vercel-specific APIs, static routes + middleware only); verify `@opennextjs/cloudflare` or `@cloudflare/next-on-pages` support at first deploy; Convex/Clerk are SaaS so no server needed |
| 7 | `NEXT_PUBLIC_*` variables are build-time inlined | A rebuild without env vars ships "configuration required" screens | Low (visible, not silent) | Deliberate honest failure state replaces the old dummy-URL/mock behavior; documented in README |
| 8 | Hand-written `convex/_generated` shim (real codegen needs Convex login) | Type drift between shim and real generated API | Low | Shim mirrors generated file structure; run `npx convex dev` once to replace with real codegen at deployment |
| 9 | Hearts refill to 5 at every session start (owner default, no decay model) | Hearts less punishing than Duolingo's model | Certain (by design) | Documented owner default; revisit if engagement data says so |
| 10 | No E2E tests; unit tests cover pure logic only | Regression risk in auth/session wiring | Medium | Manual verification plan per release; add Playwright after live deployment exists |
| 11 | Session state machine lives client-side; a hard refresh mid-lesson loses session-local progress (hearts/queue) | Minor UX annoyance | Low | Completed lessons and stats are server-persisted; only the in-flight session resets |
