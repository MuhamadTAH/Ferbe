# Rollback procedure

How to restore the previous working version after a bad deploy. The system has
three moving parts: the **web app** (Cloudflare), the **backend** (Convex), and
**auth** (Clerk, rarely changed).

## 1. Web app rollback (Cloudflare)

Option A — dashboard rollback (fastest):

1. Cloudflare dashboard → Workers & Pages → the Ferbe project → **Deployments**.
2. Pick the last known-good deployment → **Rollback**. Done.

Option B — git revert (when the bad change is committed):

```bash
git log --oneline -5              # find the last known-good commit
git revert <bad-commit>           # or: git reset --hard <good-commit> + force-with-lease (coordinate first)
git push origin main              # redeploys via CI/dashboard
```

## 2. Convex backend rollback

Schema/functions are pushed as one unit:

```bash
# See what is deployed: dashboard -> Deployment -> History
npx convex deploy          # pushes current code+schema
```

To roll back:

1. `git revert` the offending Convex change locally (as above).
2. Re-push: `npx convex deploy` (or `npx convex dev` once, then deploy).
3. Data written by the bad version may persist — for destructive schema
   changes, restore from a dashboard backup (Convex dashboard → Backups) or
   write a one-off cleanup mutation. Since v1 data is limited to progress
   rows, manual cleanup is acceptable.

## 3. Full previous-version restore (disaster)

```bash
git checkout <last-known-good-tag-or-sha>
npm install
npx tsc --noEmit && npm run build   # verify gates green
npx convex deploy
# redeploy the app (Cloudflare build or wrangler deploy per adapter)
curl https://<your-domain>/api/health   # expect {"status":"ok","convex":"reachable",...}
```

## 4. Post-rollback checks

- [ ] `GET /api/health` returns `status:"ok"` and `convex:"reachable"`
- [ ] `/learn` loads the path and lesson nodes render
- [ ] Sign-in works; completing a lesson increments XP (verify in Convex dashboard data view)
- [ ] Hearts deduct on a wrong answer and the failure modal appears at 0

## 5. Health check

`GET /api/health` always returns HTTP 200 with JSON:

```json
{ "status": "ok" | "degraded", "convex": "reachable" | "unreachable" | "unconfigured", "time": "ISO" }
```

Use `convex != "reachable"` as the alert signal.
