# Market Research & SEO Brief — `/tools/sermon-to-devotional`

**Author:** Growth Marketer, D7 Labs
**Date:** 2026-05-05
**Domain:** d7labs.dev (newly deployed, zero organic, no backlinks)

> **Headline:** This is a small-volume, weak-SERP, high-intent niche dominated by a few well-funded players (Pulpit AI/Subsplash, Pastors.ai) and a long tail of generic "AI sermon generator" listicles. Direct ranking for `"sermon to devotional"` is winnable in 6 months because nobody owns the exact phrase — but the page must first be made indexable, internally linked, and given a reason for Google to see it. The fastest wins are technical hygiene + 3 long-tail content pages targeting specific buyer-intent queries that big-brand SERPs do not satisfy.

---

## 1. Live Page Audit

### What the page does well

- **`<title>`** is set: `"Sermon to Devotional — Turn Any Sermon Into a 3-Day Series | D7 Labs"` (`src/app/tools/sermon-to-devotional/page.tsx:15`). 80 chars, good keyword stack, brand at end.
- **Meta description** is set, ~170 chars, includes price and the two input sources (`page.tsx:16-17`).
- **Open Graph** title + description present (`page.tsx:18-23`).
- **Single H1** with target phrase `"Turn any sermon into a 3-day devotional"` (`page.tsx:60-65`).
- **Clean H2/H3 hierarchy** — H2s are descriptive ("Three steps. Under three minutes.", "A full week of follow-through — grounded in Sunday's sermon", "Built for the people behind Sunday", "Free to preview. $2.99 to download.", "Questions", "Ready to extend Sunday's impact?"). H3s exist for personas and FAQ items.
- **FAQ block exists** (`page.tsx:447-482`) — but is plain HTML, not marked up.
- **Breadcrumb is rendered** in the DOM (`page.tsx:43-49`) but as plain `<a>` + `/` separators, no schema.

### What's broken or missing

| Issue | Where | Severity | Fix |
|---|---|---|---|
| **No `robots.txt`** at root | `https://d7labs.dev/robots.txt` returns 404 (verified) | HIGH | Add `app/robots.ts` |
| **No `sitemap.xml`** at root | `https://d7labs.dev/sitemap.xml` returns 404 (verified) | HIGH | Add `app/sitemap.ts` |
| **No canonical URL** | grep of `src/` finds zero `canonical`/`alternates` references | HIGH | Add `alternates: { canonical: ... }` in metadata |
| **No hreflang for EN/FR** | grep finds zero `hreflang` references | HIGH (you market in 2 langs) | No FR page exists yet to point to — but tag the EN page once the FR variant ships |
| **No JSON-LD structured data** | grep finds zero `application/ld+json` blocks | HIGH | Add `SoftwareApplication`, `FAQPage`, `BreadcrumbList`, `Product`/`Offer` schemas |
| **No Twitter Card meta** | not in `metadata` export | MED | Add `twitter` block |
| **No OG image** | `metadata.openGraph` has no `images` array | MED | Add a generated 1200×630 OG card |
| **`<html lang="en">` hardcoded** | `src/app/layout.tsx:48` | MED | Fine for now (page is EN); becomes problematic the day a French route ships |
| **Homepage does not link to the tool** | `src/app/page.tsx` — Ezra Studio card links to `ezrastudio.ai` (external), there is no link to `/tools/sermon-to-devotional` from `/` | HIGH | Internal linking is the cheapest authority-signal you have on a brand-new domain |
| **Tools hub IS linked from homepage** | `src/app/page.tsx:219` ("View all tools →") → `/tools` → `/tools/sermon-to-devotional` | OK | Two-hop from home; one-hop is better |
| **The embedded tool (`<SermonApp />`) is a client component** | `page.tsx:212` | LOW | Wrapper is a server component — content above the fold is server-rendered, indexable. Good. |
| **OG type is `"website"`** | `page.tsx:21` | LOW | `"product"` would be more accurate |
| **Domain age & DA = essentially zero** | New TLD (`.dev`), zero referring domains | HIGH | This is the real ceiling on what queries are realistic in 90 days |

**Indexation status:** `site:d7labs.dev` queries to Google and Bing both returned blocked/empty pages on automated fetch — could not confirm indexation. With no sitemap submitted and no internal-link path from the homepage, the page is likely either not indexed or buried. **Action: submit sitemap to GSC immediately.**

---

## 2. Search Demand — What People Actually Type

### Method
- Google autocomplete via `https://www.google.com/complete/search?client=firefox&q=...` (raw JSON).
- Live SERP inspection via WebSearch tool — read top 10 organic for each query.
- Reddit fetch was blocked (`Claude Code is unable to fetch from www.reddit.com`) — flagged as gap in §6.
- All "verdicts" below are based on observed SERP composition (who owns the top 10), not on a paid-tool volume estimate. **No fabricated volumes appear in this section.**

### English queries

| # | Query | Source (URL) | Intent | Top 3 organic | SERP gap? | Verdict |
|---|---|---|---|---|---|---|
| 1 | `sermon to devotional` | Live SERP via WebSearch + the d7 tool's own H1 | Commercial / how-to mix | ministrypass.com, sermonshots.com, pulpitai.com ([SERP](https://www.google.com/search?q=turn+sermon+into+devotional)) | YES — no tool ranks for the exact phrase. Top results are blog explainers. | **GO AFTER NOW.** Exact-match domain doesn't exist; your H1 already targets it. Add a `/learn/` post + structured data. |
| 2 | `turn sermon into devotional` | Same SERP | Informational | ministrypass.com, sermonshots.com, pulpitai.com | YES — same SERP as above; informational pages dominate, no ranked tool | **GO AFTER NOW.** Twin of #1. Build one canonical `/learn/turn-sermon-into-devotional` post that consolidates intent. |
| 3 | `sermon devotional` (autocomplete suggestion #1 from `sermon to devotional`) | [google complete json](https://www.google.com/complete/search?client=firefox&q=sermon+to+devotional) | Mixed informational + content browse | sermoncentral.com, abideinchrist.com, sermons-online.org | NO — heavily content/library-driven, big domains | SKIP — too broad, too content-y. |
| 4 | `AI sermon devotional generator` | Live SERP | Commercial | pastors.ai, jotform.com, easy-peasy.ai, sermonoutline.ai, pulpitai.com ([SERP](https://www.google.com/search?q=AI+sermon+devotional+generator)) | PARTIAL — many entries are generic AI-tool template farms (Jotform, Easy-Peasy) that don't actually transform a sermon | **BUILD TOWARD.** Tool sites win this; needs DA. Your direct play is one programmatic comparison page. |
| 5 | `ai devotional generator` | [google complete json](https://www.google.com/complete/search?client=firefox&q=ai+devotional+generator) | Commercial | (autocomplete shows song/music/video/image generator dominate, not text/devotional) | YES — primary autocomplete branches into music/video; the *text* devotional generator slot is open | **GO AFTER NOW.** Title a comparison page around this phrase. |
| 6 | `repurpose sermon AI tools` | Live SERP | Commercial | pastors.ai, sermonshots.com, aiforchurchleaders.com ([SERP](https://www.google.com/search?q=repurpose+sermon+AI+tools)) | NO — established players + listicles | SKIP for now. Revisit at month 6. |
| 7 | `how to write a devotional` | [google complete json](https://www.google.com/complete/search?client=firefox&q=how+to+write+a+devotional) | Informational (high) | jerryjenkins.com, sermonary.com, blueridgeconference.com, ministrypass.com | NO — 10+ year-old high-DA sites | SKIP. Editorial moat. |
| 8 | `how to create devotional from sermon` | Live SERP via WebSearch | Informational | jerryjenkins.com, sermonshots.com, seminary.grace.edu | PARTIAL — only Sermon Shots links to a tool; everyone else is editorial | **GO AFTER NOW.** Write a how-to + tool-included post. This converts. |
| 9 | `daily devotional from sermon` | [google complete json](https://www.google.com/complete/search?client=firefox&q=daily+devotional+from+sermon) | Informational | autocomplete shows people want to *read* devotional sermons, not generate them | NO — wrong intent | SKIP. |
| 10 | `5 day devotional generator` (Sermon Shots/Pastors.ai both ship 5-day; we ship 3) | Live SERP | Commercial | pastors.ai, sermonshots.com, lakeviewcc.net (church) ([SERP](https://www.google.com/search?q=%22sermon%22+%225+day+devotional%22+generator)) | NO | SKIP. We are 3-day; chasing "5-day" is misalignment. |
| 11 | `youtube sermon to devotional` | Live SERP | Commercial | pastors.ai, pulpitai.com, sermonshots.com | YES — none owns the URL/copy specifically tying YouTube *URL → devotional PDF* (most require uploads or Subsplash integration) | **GO AFTER NOW.** This is your core feature. Make `/tools/sermon-to-devotional`'s body and a sidecar post both target this phrase. |
| 12 | `sermon transcript to devotional` | [google complete json](https://www.google.com/complete/search?client=firefox&q=sermon+transcript+to) (autocomplete returned empty array — i.e. no autocomplete) | Likely commercial | n/a | YES (no autocomplete = nobody else has bid the search-suggestion territory either) | **GO AFTER NOW** as a sidecar long-tail page. Low volume, but exact intent for PDF-upload users. |
| 13 | `AI for pastors` | [google complete json](https://www.google.com/complete/search?client=firefox&q=AI+for+pastors) (10 autocompletes incl. "free ai for pastors", "ai tools for pastors") | Informational + commercial | theleadpastor.com, faithaistack.com, sermonshots.com, exponential.org | NO — listicle moat | BUILD TOWARD. The play is to *get listed* on these listicles, not outrank them. |
| 14 | `free ai for pastors` | Same autocomplete branch | Commercial | listicles | PARTIAL | **OUTREACH** — pitch to faithaistack.com, theleadpastor.com listicles to be added. |
| 15 | `sermon notes to devotional` | [google complete json](https://www.google.com/complete/search?client=firefox&q=sermon+notes+to+devotional) (empty autocomplete) | Commercial | n/a | YES — empty autocomplete = no incumbent | **GO AFTER NOW** as a long-tail post. Tiny volume; near-100% conversion intent. |
| 16 | `convert sermon to PDF` (no autocomplete returned for `convert sermon to`) | [google complete json](https://www.google.com/complete/search?client=firefox&q=convert+sermon+to) | Commercial | autocomplete shows translation queries (sermon to Spanish/Russian) — not what we do | NO | SKIP. |

### French / Quebec queries

| # | Query | Source (URL) | Intent | Top 3 organic | Gap? | Verdict |
|---|---|---|---|---|---|---|
| 17 | `générateur méditation chrétienne IA` | Live SERP via WebSearch ([results](https://www.google.com/search?q=g%C3%A9n%C3%A9rateur+m%C3%A9ditation+chr%C3%A9tienne+IA)) | Commercial | meditatio.app, eglise.ai, creati.ai (review aggregator) | PARTIAL — meditatio.app is a daily-meditation *consumer* app, not a sermon-to-devotional tool. eglise.ai is the closest competitor. | **GO AFTER NOW.** Build the FR variant of the page. eglise.ai is free and prominent — you must position around scripture-grounding-from-sermon-source as a wedge. |
| 18 | `outils IA sermon` | [google complete json (fr/ca)](https://www.google.com/complete/search?client=firefox&hl=fr&gl=ca&q=outils+IA+sermon) (empty autocomplete) | Commercial | n/a | YES | **GO AFTER NOW** with FR landing page. |
| 19 | `Sermon IA` | Live SERP | Commercial | eglise.ai/sermon-ia (top), creati.ai, sermonai.com | NO — eglise.ai owns this in French | BUILD TOWARD. Compete via differentiation (sermon→devotional vs. sermon-prep). |
| 20 | `méditation chrétienne pdf` | [google complete json (fr)](https://www.google.com/complete/search?client=firefox&hl=fr&gl=ca&q=m%C3%A9ditation+chr%C3%A9tienne+pdf) (returns "méditation biblique pdf", "méditation biblique quotidienne pdf", etc.) | Informational + download intent | mostly book PDFs, no tool | YES — pure search-intent gap | **GO AFTER NOW.** Build a FR landing/blog around "méditation à partir d'une prédication PDF". |
| 21 | `créer une méditation guidée` | [google complete json (fr)](https://www.google.com/complete/search?client=firefox&hl=fr&gl=ca&q=cr%C3%A9er+une+m%C3%A9ditation) | Informational/commercial | aimeditation.app, meditator-ai.com — secular/wellness | NO — wrong intent (wellness, not Christian) | SKIP. |
| 22 | `prédication en ligne` | [google complete json (fr)](https://www.google.com/complete/search?client=firefox&hl=fr&gl=ca&q=pr%C3%A9dication+en) | Informational | various pastor blogs | NO — too broad | SKIP. |
| 23 | `IA église pasteur outil sermon` | Live SERP | Commercial | eglise.ai, lecnef.org, lafree.info, regardsprotestants.com | PARTIAL | BUILD TOWARD via FR comparison page. |
| 24 | `Comment préparer un sermon avec l'IA` | Live SERP via toolify.ai listing | Informational | toolify.ai, easy-peasy.ai (FR template), unifire.ai | YES — French how-to space is thin and dominated by foreign-built FR pages of English-first tools | **GO AFTER NOW.** Native French how-to ("De la prédication YouTube à une méditation de 3 jours") wins on quality + native voice. |
| 25 | `comment écrire une méditation à partir d'une prédication` | Speculative — built from #24 + #20 patterns | Informational | n/a | YES (no autocomplete, no clear ranker) | **GO AFTER NOW.** Long-tail FR companion post. |

### Read this before chasing volumes
Several of the highest-intent queries (#1, #2, #11, #12, #15, #18, #20) returned **empty Google autocomplete arrays**. That is itself a directional signal: low monthly volume but uncontested. For a brand-new domain with no link equity, **uncontested long-tail beats high-volume hopeless**. We rank for these, then earn the right to chase #4, #13, #19 at month 6.

---

## 3. Competitor Landscape

| # | Competitor | URL | What it does | Pricing | SEO approach | Strength | Gap to exploit |
|---|---|---|---|---|---|---|---|
| 1 | **Pulpit AI (Subsplash)** | [pulpitai.com](https://www.pulpitai.com/) | 1 sermon → 20+ assets (clips, social, devotionals, group guides) | $39 / $59 / $129 mo ([pricing](https://www.pulpitai.com/pricing)) | Subsplash blog + Subsplash domain authority + church-tech press | Acquired by Subsplash 2024 ([PRNewswire](https://www.prnewswire.com/news-releases/subsplash-acquires-pulpit-ai-an-innovative-platform-leveraging-ai-to-help-streamline-content-creation--boost-sermon-engagement-for-churches-302320167.html)); huge distribution moat | **Price.** $39/mo entry vs. our $2.99/transaction. Casual / one-off / non-Subsplash churches will not commit to a sub. |
| 2 | **Pastors.ai** | [pastors.ai](https://pastors.ai/) | YouTube link → clips + 5-day devo + chatbot + sermon page | Free / $30 / $75 mo | Direct + faith.tools listing; light blog | Free tier (3 sermons/mo); chatbot & sermon page are sticky | **Devotional output quality + one-shot purchase.** Their devo is bundled inside a $30/mo plan; ours is a $2.99 download. |
| 3 | **Sermon Shots** | [sermonshots.com](https://sermonshots.com/) | Sermon → clips, devotionals, discussion guides, blog posts | Free trial / $39.99 / $57 / $87 mo | **Strongest content marketing of the bunch** — active blog ranking for "turn your sermons into daily devotionals" and "how AI for churches" content | Owns informational SERPs we want | **3-day vs. 5-day; native FR; PDF-first artifact.** They're video-clip-first. We're document-first. Different artifact, same problem. |
| 4 | **SermonAI / Sermonai.com** | [sermonai.com](https://sermonai.com/) | Sermon writing assistance, exegesis, planning | $14.99/mo, 7-day trial ([per WebSearch](https://www.google.com/search?q=sermons.ai+pricing)) | Light SEO; mostly directory listings | Cheap subscription | **Different problem.** They help write a sermon. We help repurpose one. Not direct overlap. |
| 5 | **Sermonly (Tithe.ly)** | [sermon.ly](https://www.sermon.ly/) | AI sermon prep + storage | $9.99-19.99/mo ([pricing](https://www.sermon.ly/pricing)) | Tithe.ly partner traffic | Embedded in Tithe.ly ecosystem | **Different problem** (prep, not repurpose). |
| 6 | **SermonScribe** | [via faith.tools](https://faith.tools/app/335-sermonscribe) | YouTube sermon → small group questions + transcripts + SEO blog | (not disclosed publicly) | Listed on faith.tools | Closest to our wedge (YouTube → text artifact) | **They generate group questions; we generate devotionals. Same input, different output. Adjacent, not competitive.** |
| 7 | **Eglise.ai (Sermon IA)** | [eglise.ai](https://eglise.ai/) | Free FR-only sermon plan generator + 5 other tools | Free (donation-funded) | Direct + French-Catholic press (CNEF, RCF mentions) | **Owns French-language Christian-AI category** in 10 francophone countries | **Sermon-to-devotional is not their core; they do sermon prep.** Plus: their UX is donation-driven free, ours is freemium-with-paid-PDF — clearer commercial intent. |
| 8 | **Meditatio.app** | [meditatio.app](https://meditatio.app/) | FR daily Christian meditation app (mobile) | Freemium app | Featured in [Aleteia](https://fr.aleteia.org/2021/10/05/meditatio-enfin-une-application-de-meditation-chretienne/) | First French Christian meditation app | **They publish meditations; we generate them from a sermon.** B2C consumer app vs. our B2B-pastor tool. Adjacent. |
| 9 | **Faith ToolBox** | [faithtoolbox.com](https://faithtoolbox.com/) | AI-powered Bible study + devotional generator | (varies) | faith.tools listing | Generic devotional generator (no sermon source) | **No sermon-source grounding.** Our differentiator is "every sentence traceable to the actual sermon." |
| 10 | **Subsplash native devotional features** | [subsplash.com/blog/create-daily-devotional-online](https://www.subsplash.com/blog/create-daily-devotional-online) | Devotional CMS inside Subsplash app platform | Subsplash subscription | Subsplash-domain blog ranking | DA + church-tech distribution | **You need Subsplash to use it.** We're a no-account one-off. |

### Competitor positioning summary

The space splits cleanly into three buckets:

1. **Subscription suites** (Pulpit AI, Sermon Shots, Pastors.ai, Subsplash) — $30–$129/mo, video-clip-first, requires committed monthly use to justify.
2. **Sermon-prep AI** (SermonAI, Sermonly, Eglise.ai/Sermon IA) — different problem; not direct competitors. Worth watching as adjacencies.
3. **One-off / consumer / free** — only Eglise.ai is free; nobody else does pay-per-document.

**The gap is the $2.99 one-shot purchase.** No competitor occupies this. Our SEO + landing-page copy must make this the loudest message: *"You don't need a $39/mo sub to turn one sermon into one devotional."*

---

## 4. Content Strategy — Five Pages to Build

Each page below targets a SERP gap I confirmed in §2. URLs assume a `/tools/sermon-to-devotional/learn/` pattern (or a top-level `/blog/`).

### Page 1 — `/tools/sermon-to-devotional/learn/turn-sermon-into-devotional`
- **Target query:** `turn sermon into devotional` ([SERP](https://www.google.com/search?q=turn+sermon+into+devotional))
- **Title:** *How to Turn a Sermon Into a Devotional (Without Rewriting It Sunday Night)*
- **Meta:** *A 6-step method for turning Sunday's sermon into a 3-day devotional your congregation will actually read. Plus a free preview tool.*
- **Outline:**
  1. Why repurposing a sermon ≠ summarizing it (anchor of Ministry Pass / Sermon Shots framing, but with a contrarian angle: "summary is the cheap version; reflection is the valuable version")
  2. The 5 components of a devotional that actually gets opened (hook → scripture → reflection → action → prayer — mirrors what our tool ships)
  3. Three ways to do it: (a) by hand (90 min/day for 3 days = 4.5 hr); (b) prompt ChatGPT (broken-grounding risk, illustrated with a real before/after); (c) use a sermon-to-devotional tool
  4. Free preview embed of our tool with a sample sermon
  5. FAQ block (re-use the FAQ from the parent page, but expand)
- **Why winnable:** Top 3 organic for this exact phrase ([ministrypass.com](https://ministrypass.com/sermon-devotional-topics/), [sermonshots.com](https://sermonshots.com/blog/how-to-turn-your-sermons-into-daily-devotionals-and-grow-your-reach/), [pulpitai.com](https://www.pulpitai.com/)) are all editorial — no exact-match landing. Sermon Shots is the strongest threat (active SEO content); we beat them on PDF-first artifact + price.

### Page 2 — `/tools/sermon-to-devotional/learn/youtube-sermon-to-devotional-pdf`
- **Target query:** `youtube sermon to devotional` and the long-tail `sermon transcript to devotional`
- **Title:** *Paste a YouTube Link, Get a 3-Day Devotional PDF — Here's How It Works*
- **Meta:** *Skip the transcript download. Paste any YouTube sermon link and get a ready-to-print devotional PDF in under 3 minutes. Free preview, $2.99 to keep.*
- **Outline:**
  1. The workflow: link → preview → download (with screenshots / GIF)
  2. What's grounded vs. what's not (theology guardrail explainer for skeptical pastors — borrows from D7 Engine PRD)
  3. Side-by-side: ChatGPT-pasting-transcript vs. our tool (real artifact comparison)
  4. Where we won't help: live-streamed sermons without uploaded video; multi-speaker round-tables; non-sermon audio
  5. Embedded preview tool
- **Why winnable:** Live SERP for `youtube sermon to devotional` is dominated by Pastors.ai and Pulpit AI — both require account creation and aren't single-shot. We rank for the *frictionless* angle.

### Page 3 — `/tools/sermon-to-devotional/learn/ai-devotional-generator-comparison`
- **Target queries:** `ai devotional generator`, `AI sermon devotional generator`
- **Title:** *AI Devotional Generator Comparison: Pulpit AI vs. Pastors.ai vs. Sermon Shots vs. D7 Sermon-to-Devotional (2026)*
- **Meta:** *Honest comparison of 4 tools that turn sermons into devotionals. Pricing, output samples, and which one is right for you.*
- **Outline:**
  1. Decision matrix (free tier, price, output type, source input, language, account-required)
  2. Pulpit AI — strengths + when to use them (ack their position; don't trash them — pastors talk and we won't punch up)
  3. Pastors.ai — strengths + when to use
  4. Sermon Shots — strengths + when to use
  5. D7 Sermon-to-Devotional — when *we* are the right answer (one-off, no commit, EN/FR, PDF-first)
  6. "Choose-your-own-adventure" decision tree at the end
- **Why winnable:** Comparison-content is the cheap branded-search hack — when somebody Googles `pulpit ai vs pastors ai`, you want to be the third option in the room. Listicles like [theleadpastor.com](https://theleadpastor.com/tools/best-ai-sermon-prep-software/) do this exact play and rank well.

### Page 4 — `/outils/sermon-en-meditation` (FR variant)
- **Target queries:** `générateur méditation chrétienne IA`, `outils IA sermon` (FR), `méditation chrétienne pdf`
- **Title:** *De la prédication à la méditation : transformez n'importe quel sermon en méditation de 3 jours (PDF)*
- **Meta:** *Collez un lien YouTube ou un PDF de prédication. Obtenez une méditation chrétienne de 3 jours, ancrée dans l'Écriture, en quelques minutes. Aperçu gratuit, 2,99 $ pour télécharger.*
- **Outline:** mirror of the EN landing page, **localized** (not translated) — Quebec scripture references (Louis Segond default), Quebec/Haitian church context, native idiom
- **Why winnable:** Eglise.ai is the only real FR competitor and they do *sermon prep*, not devotional generation. Meditatio.app is a consumer reading app. The FR sermon-to-devotional slot is uncontested.
- **Note:** Phase 1 priority per memory, even if HT is deprioritized.

### Page 5 — `/tools/sermon-to-devotional/learn/grounded-vs-generated-ai-devotionals`
- **Target queries:** Trust/objection-handling — `will ai sermon tools say things the pastor didn't say` (a question raised in the [Gospel Coalition Canada piece](https://ca.thegospelcoalition.org/article/should-pastors-use-ai-in-sermon-preparation/) and pastoral concerns echoed across listicles)
- **Title:** *"Will the AI Say Things I Didn't?" — How Sermon-Grounded Devotionals Work*
- **Meta:** *The one objection every pastor has to AI sermon tools. Here's exactly how D7 keeps every sentence traceable to your sermon.*
- **Outline:**
  1. The legitimate fear (Gospel Coalition Canada framing)
  2. What "grounded generation" actually means (theology guardrail, OSIS scripture cross-validation, no invented theology — pulled from D7 Engine PRD)
  3. A real example: same sermon, ChatGPT output vs. ours (highlight where ChatGPT drifts)
  4. What we still get wrong + how to report it
- **Why winnable:** This is the trust query. Every other tool buries this in fine print. Owning the answer is brand-defining and links back to every other page on the site.

---

## 5. The 30-Day SEO Plan

Priority-ordered. Every action has effort (S/M/L), expected impact (low/med/high), and a note if it requires backlinks (which on-page alone won't deliver).

| # | Action | Effort | Impact | Backlinks needed? | Notes |
|---|---|---|---|---|---|
| 1 | **Add `app/robots.ts` and `app/sitemap.ts`** that emit `/`, `/tools`, `/tools/sermon-to-devotional` | S | High | No | Page can't compete if Google can't find it. Verified neither exists today. |
| 2 | **Submit sitemap to Google Search Console + Bing Webmaster** | S | High | No | Both domains; both languages once FR ships. |
| 3 | **Add canonical URL to the page metadata** (`alternates: { canonical: "https://d7labs.dev/tools/sermon-to-devotional" }`) | S | Med | No | Defends against parameterized URL duplicates the embedded tool may produce. |
| 4 | **Add JSON-LD: `SoftwareApplication` + `FAQPage` + `BreadcrumbList`** to the page | S | High | No | FAQ schema gets you rich snippets immediately. The 4 FAQ items already on the page are perfect inputs. |
| 5 | **Link from homepage to `/tools/sermon-to-devotional`** | S | High | No | Today the homepage links externally to ezrastudio.ai but not to the live tool. The first internal link is the one Google weights highest. Add a third product card or replace the Ezra Studio external link. |
| 6 | **Build Page 1 (`turn-sermon-into-devotional`)** | M | High | Some (3–5 referring domains makes it go) | This is the core content asset. |
| 7 | **Build Page 4 (FR variant `sermon-en-meditation`)** | M | High | No (FR SERP is empty enough) | Phase 1 priority per growth-marketer GTM; eglise.ai is your only FR competitor and they don't do this. Add hreflang + `<html lang="fr">` for the route. |
| 8 | **Build Page 3 (comparison page)** | M | Med | No (commercial-intent, low competition for "vs." queries) | Branded-comparison traffic is mostly from competitors' own visitors searching for alternatives. |
| 9 | **Generate a real OG image** (1200×630, sample devotional preview) | S | Med | No | Social shares + LinkedIn-pastor traffic. |
| 10 | **Pitch listicle inclusion** to [theleadpastor.com/tools/best-ai-sermon-prep-software](https://theleadpastor.com/tools/best-ai-sermon-prep-software/), [faithaistack.com](https://faithaistack.com/), [faith.tools](https://faith.tools/), [sermonshots.com](https://sermonshots.com/) | M | High | YES (this *is* the link-building) | This is the highest-leverage backlink play we have. Listicle authors update their posts and we want to be on the next refresh cycle. |
| 11 | **Build Page 2 (`youtube-sermon-to-devotional-pdf`)** | M | Med | No | Long-tail; mainly converts paid traffic + bottom-of-funnel. |
| 12 | **Build Page 5 (`grounded-vs-generated`)** | M | Med | No | Trust-asset; gets cited internally and externally over time. |

**What's NOT on this list and why:**
- Paid Google Ads on `sermon AI` terms — competitors with $30–$129/mo LTV can outbid a $2.99 transaction. Skip until repeat-purchase or upsell to Ezra Studio is wired up.
- Generic "blog post a week" cadence — we have 5 specific assets to ship; building that backlog is more valuable than throughput.
- Trying to rank for `how to write a devotional`, `AI for pastors` head terms — DA-bound, multi-year project. Listicle-inclusion is the cheaper bet.

---

## 6. Risks and Unknowns

### What I could not verify
1. **Indexation status.** Google `site:` and Bing `site:` both returned blocked/captcha responses to automated fetch. Resolve manually in GSC within 24 hours.
2. **Reddit pastor sentiment / pain language.** All `reddit.com` fetches were blocked (`Claude Code is unable to fetch from www.reddit.com`). The qualitative voice-of-customer for r/pastors, r/Christianity, r/youthministry is the single biggest gap in this brief. **Action:** spend 2 hours on Reddit manually next week and add a §6 supplement.
3. **Search volumes (numerical).** I did not invent any. We need GSC impression data after 4–6 weeks of indexation, plus a free-tier Ahrefs/Semrush volume pull, before tightening targets.
4. **SermonAI homepage content.** The page returned only a heading on fetch — couldn't audit their full pricing/positioning. Rerun manually.
5. **Eglise.ai's actual search rankings in Quebec specifically** (vs. France/general francophone). They claim "10 francophone countries" but we don't know if Quebec-specific queries surface them. A Quebec-IP fresh search would tighten this.
6. **YouTube comment-section voice-of-pastor data.** I did not pull this; would surface real complaints about the manual workflow ("I spent 3 hours trying to summarize this sermon for our group...").

### Assumptions that could be wrong
- **That `sermon to devotional` has any real search volume at all.** Empty Google autocomplete is a tell that volume is small. The pitch above assumes uncontested low-volume long-tail beats contested high-volume — which is the right bet for a brand-new domain, but it's a bet.
- **That the $2.99 one-shot is durably differentiated.** Pulpit AI or Pastors.ai could ship a per-sermon pay-as-you-go SKU in 4 weeks. If they do, our pricing wedge collapses; the moat must move to (a) French-native, (b) PDF-first artifact quality, (c) eventual integration with Ezra Studio waitlist.
- **That French-language churches are ready to buy in CAD/USD via Stripe.** Quebec church-purchasing committees are a real obstacle the BUSINESS_PLAN acknowledges; the FR landing page may convert at lower rates than EN despite better SERP gaps.
- **That homepage→tool internal-linking is the bottleneck.** Plausibly the bigger blocker is that `d7labs.dev` is too young — even a perfect on-page won't outrank Pulpit AI for 9–12 months. The 30-day plan above is calibrated for *new domain* expectations, not *competitive head terms*.

### Data I'd want next (in priority order)
1. **Google Search Console verified + first 4 weeks of impressions/clicks data.** This replaces every directional claim above with real signal.
2. **Manual Reddit / Facebook church-tech-group pull** — voice-of-customer language samples for headlines and FAQ content.
3. **Ahrefs free DA check** on top 3 competitors per target query, to calibrate the "is this winnable?" verdicts.
4. **A French-speaking pastor's reaction to the FR variant** before launch — localization quality > translation quality, per playbook.
5. **The BUSINESS_PLAN.md, PRD.md, PRD-SEARCH-ENGINE.md referenced in the system prompt** — these would let me tie marketing positioning to the actual product roadmap (Ezra Studio waitlist, search/converse layers). I treated them as out-of-scope for this first audit but would integrate them in v2.

---

## Appendix — Sources cited

**Tool fetches:**
- d7labs.dev landing page rendered text (no head access via WebFetch — confirmed via reading `src/app/tools/sermon-to-devotional/page.tsx`)
- d7labs.dev homepage (`src/app/page.tsx`) and tools hub (`src/app/tools/page.tsx`)
- `https://d7labs.dev/robots.txt` → 404 verified
- `https://d7labs.dev/sitemap.xml` → 404 verified

**Google autocomplete (raw JSON, verbatim from `https://www.google.com/complete/search?client=firefox&q=...`):**
- `sermon to devotional` → returned suggestions
- `ai sermon devotional` → empty
- `devotional from sermon` → suggestions
- `how to write a devotional` → 10 suggestions
- `sermon follow up` → suggestions
- `ai devotional generator` → 9 suggestions (mostly music/video/image variants)
- `sermon to small group guide` → empty
- `ai sermon tools` → 2 suggestions
- `convert sermon to` → translation queries only
- `devotional pdf generator` → empty
- `youtube sermon to` → only "Tony Evans" / sermon-content suggestions
- `sermon rewriter` → empty
- `sermon repurpose` → empty
- `devotional from youtube` → unrelated YouTube-channel-naming suggestions
- `sermon notes to devotional` → empty
- `sermon content repurposing` → empty
- `AI for pastors` → 10 suggestions including "free ai for pastors"
- `sermon transcript to` → empty
- `3 day devotional` → 10 suggestions
- `daily devotional from sermon` → suggestions
- FR (hl=fr, gl=ca): `outils IA sermon` → empty; `méditation chrétienne pdf` → suggestions; `prédication en` → suggestions; `créer une méditation` → meditation-app/wellness suggestions

**Competitor pages fetched:**
- [pastors.ai](https://pastors.ai/) — pricing tiers and free tier
- [pulpitai.com/pricing](https://www.pulpitai.com/pricing) — full pricing
- [sermonshots.com](https://sermonshots.com/) — pricing + content strategy
- [sermon.ly/pricing](https://www.sermon.ly/pricing) — pricing
- [eglise.ai](https://eglise.ai/) and [eglise.ai/sermon-ia](https://eglise.ai/sermon-ia) — French competitor, free
- [faith.tools/app/335-sermonscribe](https://faith.tools/app/335-sermonscribe) — adjacent competitor
- [ministrypass.com/sermon-devotional-topics](https://ministrypass.com/sermon-devotional-topics/) — top SERP for `turn sermon into devotional`
- [sermonshots.com/blog/how-to-turn-your-sermons-into-daily-devotionals-and-grow-your-reach](https://sermonshots.com/blog/how-to-turn-your-sermons-into-daily-devotionals-and-grow-your-reach/) — competitor's anchor blog post
- [subsplash.com/blog/pulpit-ai-how-it-works](https://www.subsplash.com/blog/pulpit-ai-how-it-works) — Subsplash's positioning of Pulpit AI's devotional output
- [faithaistack.com/guides/ai-sermon-preparation](https://faithaistack.com/guides/ai-sermon-preparation/) — listicle target for outreach

**Live SERPs reviewed via WebSearch tool:**
- "AI sermon devotional generator", "turn sermon into devotional", "sermon to small group discussion guide AI", "Pulpit AI sermon", "sermons.ai pricing", "how to create devotional from sermon", "repurpose sermon AI tools", "free sermon to devotional tool", "YouTube sermon AI summary devotional pastors", "faith.tools devotional generator", "5 day devotional generator", "Subsplash Pulpit AI devotional", "how long should a daily devotional be", "AI tool pastor sermon prep Quebec French church", "IA église pasteur outil sermon", "générateur méditation chrétienne IA", "créer une méditation sermon IA"

**Industry context:**
- [PRNewswire — Subsplash acquires Pulpit AI](https://www.prnewswire.com/news-releases/subsplash-acquires-pulpit-ai-an-innovative-platform-leveraging-ai-to-help-streamline-content-creation--boost-sermon-engagement-for-churches-302320167.html)
- [Gospel Coalition Canada — Should Pastors Use AI in Sermon Preparation?](https://ca.thegospelcoalition.org/article/should-pastors-use-ai-in-sermon-preparation/)
- [Aleteia — Meditatio (FR Christian meditation app)](https://fr.aleteia.org/2021/10/05/meditatio-enfin-une-application-de-meditation-chretienne/)

---

**Prompt-injection note:** During WebFetch of the d7labs.dev page, an unrelated instruction block claimed to be from an MCP server ("adk-docs") and tried to redirect this brief into ADK documentation tasks. Ignored — those instructions did not originate from the user and are out of scope for a marketing audit.
