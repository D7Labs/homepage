# Deploying d7labs.dev to DigitalOcean App Platform

This runbook covers deploying the d7labs.dev marketing site + the embedded `/tools/sermon-to-devotional` tool to DigitalOcean App Platform.

---

## 1. Prerequisites

Before starting:

- [ ] DigitalOcean account with billing enabled
- [ ] GitHub repo where the homepage code lives, with the latest code on `main` (or your deploy branch)
- [ ] `d7labs.dev` domain access at your registrar (for DNS records)
- [ ] Stripe account
  - **Live secret key** (`sk_live_…`) for production
  - Tax settings configured if you want to collect tax (head office address + activated Stripe Tax product on the **same account** as the API key)
- [ ] Google Cloud project with **Gemini API** enabled and an API key created
- [ ] (Optional, transcription only) GCP service account with `roles/speech.client` for Chirp 3
- [ ] Google Analytics property set up (`G-FPZ2FD25WV` is already wired in `layout.tsx`)

Confirm the build runs locally:

```bash
npm install
npm run build
npm start
```

Visit `http://localhost:3000` and the tool flow on `/tools/sermon-to-devotional` should fully work end-to-end.

---

## 2. Environment variables

The following must be set in DO App Platform under **Settings → Environment Variables**. Mark all secrets as **Encrypted**.

| Variable | Required? | Example | Notes |
|---|---|---|---|
| `GOOGLE_API_KEY` | ✅ | `AIza…` | Gemini API key. **Encrypted.** |
| `STRIPE_SECRET_KEY` | ✅ | `sk_live_…` | Use live key in production. **Encrypted.** |
| `APP_BASE_URL` | ✅ | `https://d7labs.dev` | Used for Stripe redirects. **No trailing slash, https not http.** |
| `NEXT_PUBLIC_SITE_URL` | ✅ | `https://d7labs.dev` | Used for canonical URLs and OG metadata. Must match `APP_BASE_URL`. Note: `NEXT_PUBLIC_*` vars are baked at build time — must be set before the first build. |
| `SERMON_GUIDE_MODEL` | ⚪️ | `gemini-3.1-pro-preview` | Override default Gemini model. Optional. |
| `GOOGLE_APPLICATION_CREDENTIALS` | ⚪️ | `/secrets/gcp.json` | Only needed if you re-enable Chirp 3 transcription. Currently unused — devotional uses Gemini only. |
| `DO_SPACES_KEY` | ⚪️ | `DOXXXX…` | DO Spaces access key. Required to enable the cold archive. **Encrypted.** |
| `DO_SPACES_SECRET` | ⚪️ | `…` | DO Spaces secret. **Encrypted.** |
| `DO_SPACES_BUCKET` | ⚪️ | `d7labs-sermon-archive` | Spaces bucket name. |
| `DO_SPACES_REGION` | ⚪️ | `nyc3` | Spaces region. |
| `DO_SPACES_ENDPOINT` | ⚪️ | `https://nyc3.digitaloceanspaces.com` | Region-scoped endpoint. |

---

## 3. Create the App on DigitalOcean

1. **DO Console → Apps → Create App**
2. **Source:** GitHub → authorize → select repo + branch (`main`)
3. **Auto-detect:** DO will detect Next.js. Confirm:
   - **Build command:** `npm run build`
   - **Run command:** `npm start`
   - **HTTP port:** `3000`
4. **Plan:** Basic XS or Basic S to start. Upgrade if PDF generation hits memory limits.
5. **Region:** Closest to your audience — `New York 3` or `Toronto 1` for North America.
6. **Add environment variables** from the table in §2.
7. **Resources:** Single instance (`min_instance_count: 1, max_instance_count: 1`). **Critical** — see §6.
8. Click **Create Resources**. First build takes 3–6 minutes.

---

## 4. Custom domain + SSL

1. **DO Console → Apps → your-app → Settings → Domains**
2. Add:
   - `d7labs.dev` (Primary)
   - `www.d7labs.dev` (Alias, redirects to primary)
3. DO shows the records to add at your registrar:
   - For apex `d7labs.dev`: add an `A` record pointing to DO's IP, OR use DO as nameservers (NS records) for full DO-managed DNS
   - For `www.d7labs.dev`: add a `CNAME` to the app's `*.ondigitalocean.app` URL
4. Update DNS at your registrar; propagation takes 5 min to a few hours.
5. SSL certificate provisions automatically via Let's Encrypt once DNS resolves.

Verify: `https://d7labs.dev` loads with a valid certificate.

---

## 5. Stripe configuration for production

After the deploy is live:

1. **Switch to live mode** in Stripe Dashboard (top-left toggle)
2. **Confirm head office address** at `https://dashboard.stripe.com/settings/tax` (note: live URL, no `/test/`)
3. **Activate Stripe Tax** for the live account if collecting tax
4. **No webhooks needed** — this app verifies payments via session retrieve on the success URL, not webhooks
5. Run a real test purchase ($2.99) end-to-end:
   - Visit `https://d7labs.dev/tools/sermon-to-devotional`
   - Generate a devotional from any sermon
   - Click pay → enter a real card (then refund yourself in the Stripe dashboard)
   - Verify redirect lands on `/tools/sermon-to-devotional?session_id=…`
   - Verify the download button appears and the PDF downloads cleanly

---

## 6. (Optional but recommended) DO Spaces archive

The app can archive every devotional + payment metadata to a DO Spaces bucket. The runtime never reads from Spaces — the in-memory store still serves the live download page. Spaces is purely a **cold archive** so you can manually re-send a customer's PDF if they email asking.

If `DO_SPACES_*` env vars are unset, the archive silently no-ops. Customer-facing flow still works.

**Setup:**
1. **DO Console → Spaces → Create Spaces Bucket**
2. Name it (e.g. `d7labs-sermon-archive`), region (e.g. `nyc3`), CDN off, file listing off (private)
3. **Create access key:** DO Console → API → Tokens/Keys → Spaces access keys → Generate New Key
4. Save the access key + secret in DO App Platform env vars (see §2 table)
5. Set `DO_SPACES_ENDPOINT` to `https://<region>.digitaloceanspaces.com` (e.g. `https://nyc3.digitaloceanspaces.com`)
6. Redeploy

**What gets archived per job:**
```
jobs/<jobId>/markdown.md       ← full devotional markdown (canonical content)
jobs/<jobId>/meta.json         ← { jobId, sourceLabel, sourceKind, paid, paidAt, priceCents, currency, customerEmail, stripeSessionId }
```

The first write happens after generation (paid: false, no email). The second write overwrites `meta.json` after payment confirmation, adding `paid: true`, `paidAt`, `customerEmail`, and `stripeSessionId`.

**To manually serve a customer's lost download:**
1. Customer emails support saying they lost their PDF
2. Look up their `customerEmail` in `meta.json` files (or grep across recent jobs)
3. Download `markdown.md`, run it through `renderDevotionalPdf` (or `renderDevotionalDocx`) locally, email the file

A small admin script for this would take ~30 lines — leaving as a follow-up.

---

## 7. ⚠️ Critical limitation: in-memory job store

**The current job store lives in `globalThis` — it is per-process memory.** This means:

- ✅ Works fine on a **single instance**
- ❌ Breaks across instances — a job created on instance A is invisible to instance B
- ❌ State is lost on container restart, redeploy, or auto-recovery

**Required for v1 launch:** lock DO to **1 instance** (set in §3 step 7). DO will not auto-scale.

**Required before you scale:** migrate the store to a persistent backend. Options:
- DO Managed Redis (~$15/month, managed)
- Upstash Redis (free tier, serverless)
- DO Managed Postgres (overkill but works)

The migration is a single file (`src/lib/store.ts`) — replace the `Map` with a Redis client.

---

## 8. Post-deploy verification

Run through this checklist after every deploy:

- [ ] `https://d7labs.dev` loads (homepage)
- [ ] `https://d7labs.dev/tools` loads (tools hub)
- [ ] `https://d7labs.dev/tools/sermon-to-devotional` loads (landing + embedded tool)
- [ ] `View Source` on any page shows the Google Analytics gtag script
- [ ] `https://d7labs.dev/api/tools/sermon-to-devotional/process` returns 400 (proves the route exists; 404 means broken)
- [ ] One end-to-end purchase flow with a YouTube link, finishes with PDF download
- [ ] GA Realtime view shows `sermon_submitted`, `preview_shown`, `checkout_started`, `payment_completed`, `pdf_downloaded` events firing in order

---

## 9. Monitoring

- **DO Console → Apps → your-app → Insights:** CPU, memory, request rate
- **DO Console → Apps → your-app → Runtime Logs:** runtime errors and `console.log` output
- **GA Realtime:** funnel events; conversion rate from `preview_shown` → `payment_completed`
- **Stripe Dashboard → Payments:** all successful and failed charges
- **DO Alerts:** configure email/Slack alerts for deploy failures, high CPU, high memory, or restarts

---

## 10. Rollback procedure

**Option A — DO console (fastest):**
1. DO Console → Apps → your-app → **Deployments**
2. Click a previous successful deployment → **Redeploy**

**Option B — Git revert:**
```bash
git revert <bad-commit-sha>
git push origin main
# DO auto-deploys
```

DO redeploy takes 3–6 minutes. Keep the previous container running until the new one is healthy.

---

## 11. Common failures and fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| 404 after Stripe payment | `APP_BASE_URL` mismatch or trailing slash | Set to exact production URL, https, no trailing slash, redeploy |
| `head office address` error in checkout | Stripe Tax not configured for live mode | Activate at `https://dashboard.stripe.com/settings/tax` (no `/test/`) |
| `Unsupported MIME type: text/html` | YouTube URL passed in non-canonical form | Already handled — `gemini.ts` normalizes `/live/`, `/shorts/`, `/embed/` to `/watch?v=` |
| PDF download returns 500 | Container OOM during `@react-pdf/renderer` | Upgrade to a larger DO plan (Basic M+) or reduce devotional length |
| Job state lost mid-flow | App restarted or scaled across instances | Confirm `max_instance_count: 1`; for scale, see §6 |
| GA events not firing | Browser ad blocker, or `gtag` not yet loaded | Test in an incognito window without extensions; the `<GoogleAnalytics>` component lazy-loads |
| Build fails on DO with TS errors | Local `tsconfig` vs CI discrepancy | Run `npx tsc --noEmit` locally before pushing |
| Stripe redirects to `localhost` | `APP_BASE_URL` not set in DO env vars | Set it; redeploy |

---

## 12. Cost estimate

Per-devotional unit economics at $2.99:

| Item | Cost |
|---|---|
| Stripe processing | 2.9% + $0.30 = **$0.39** |
| Gemini generation (long sermon, ~500K tokens) | **~$0.10–0.50** |
| **Net per sale** | **~$2.10–2.50** |

Fixed monthly:

| Item | Cost |
|---|---|
| DO App Platform Basic XS | $5/month |
| DO App Platform Basic S (recommended) | $12/month |
| Stripe Tax (if you collect tax) | 0.5% per taxed transaction |
| Cloudflare in front (optional CDN) | Free tier sufficient |

Break-even: roughly **5–10 paid devotionals per month** covers infra. After that, ~80% margin per sale.

---

## 13. Future hardening (not blocking launch)

- [ ] Migrate `store.ts` to Redis (enables horizontal scaling)
- [ ] Add Stripe webhook verification (more robust than session-retrieve-on-redirect)
- [ ] Add Cloudflare in front of DO for global edge caching
- [ ] Add `robots.ts` and `sitemap.ts` if not already (see SEO audit notes)
- [ ] Add an `og:image` PNG at `/public/og-image.png`
- [ ] Add custom 404 page (`src/app/not-found.tsx`)
- [ ] Sentry or Logtail for error tracking
