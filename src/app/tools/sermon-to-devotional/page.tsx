/* ============================================================
   Sermon to Devotional — Marketing Landing Page
   D7 Labs · Dark theme only · Server component
   ============================================================ */

import type { Metadata } from "next";
import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";
import { SermonApp } from "@/components/SermonApp";

// In-page anchor for "Try it" CTAs that scroll to the embedded tool
const TOOL_ANCHOR = "#try-it";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://d7labs.dev").replace(/\/$/, "");
const PAGE_PATH = "/tools/sermon-to-devotional";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const TITLE = "Sermon to Devotional — Turn Any Sermon Into a 3-Day Series | D7 Labs";
const DESCRIPTION =
  "Paste a YouTube sermon link or upload a PDF transcript. Get a scripture-grounded 3-day devotional PDF in minutes. $2.99 per devotional.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: "Sermon to Devotional — D7 Labs",
    description:
      "Turn any sermon into a 3-day devotional PDF. Scripture-grounded, formatted, ready to share.",
    type: "website",
    url: PAGE_URL,
    siteName: "D7 Labs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sermon to Devotional — D7 Labs",
    description: "Turn any sermon into a 3-day devotional PDF. Scripture-grounded, formatted.",
  },
};

// FAQ pairs mirror the on-page FAQ section verbatim. Keep these in sync.
const FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "What languages are supported?",
    a: "English and French. The devotional is written in the same language as the sermon source — if the sermon is in French, the devotional is in French.",
  },
  {
    q: "Does it work without a YouTube link?",
    a: "Yes. Upload a PDF transcript directly. YouTube and PDF are the two supported sources.",
  },
  {
    q: "Will it say things the pastor didn't say?",
    a: "No. The model is instructed that every theological claim must be traceable to a moment in the sermon. It cannot invent theology or extend beyond what was said. If you see something that isn't grounded in the source, that's a bug — email us.",
  },
  {
    q: "How long does it take?",
    a: "30 seconds to 3 minutes depending on sermon length. YouTube sermons take slightly longer since the model watches the full video.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `${PAGE_URL}#software`,
      name: "Sermon to Devotional",
      description: DESCRIPTION,
      url: PAGE_URL,
      applicationCategory: "ReligiousApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "2.99",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      provider: { "@type": "Organization", name: "D7 Labs", url: SITE_URL },
      inLanguage: ["en", "fr"],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "D7 Labs", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
        { "@type": "ListItem", position: 3, name: "Sermon to Devotional", item: PAGE_URL },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function SermonToDevotionalPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <SiteNav />

      {/* ============================================================
          A. Hero
          ============================================================ */}
      <section className="relative overflow-hidden px-6 pb-24 pt-32">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary-500/7 blur-[130px]" />
          <div className="absolute right-0 top-1/2 h-[400px] w-[400px] rounded-full bg-secondary-500/4 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-xs text-neutral-500">
            <a href="/" className="transition hover:text-neutral-400">D7 Labs</a>
            <span>/</span>
            <a href="/tools" className="transition hover:text-neutral-400">Tools</a>
            <span>/</span>
            <span className="text-neutral-600">Sermon to Devotional</span>
          </nav>

          <div className="grid items-center gap-14 lg:grid-cols-[1fr_45%]">
            {/* Left: Text + CTAs */}
            <div>
              {/* Badge pill */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-300/50 bg-neutral-100/50 px-4 py-1.5 text-sm text-neutral-600 backdrop-blur-sm">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-500" />
                Free to preview &middot; $2.99 to download
              </div>

              <h1 className="mb-5 font-display text-5xl font-bold tracking-tighter text-neutral-950 sm:text-6xl">
                Turn any sermon into a{" "}
                <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                  3-day devotional
                </span>
              </h1>

              <p className="mb-8 max-w-lg text-lg leading-relaxed text-neutral-600">
                Paste a YouTube link or upload a PDF transcript. In minutes,
                you get a scripture-grounded devotional series — formatted and ready to share
                with your congregation.
              </p>

              {/* CTAs */}
              <div className="mb-8 flex flex-wrap items-center gap-4">
                <a
                  href={TOOL_ANCHOR}
                  className="group inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-base font-semibold text-neutral-50 shadow-lg transition-all hover:bg-primary-400 hover:shadow-primary-500/20 hover:shadow-xl"
                >
                  Try it now
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-neutral-100/50 px-6 py-3 text-base font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-200/50"
                >
                  See how it works
                </a>
              </div>

              {/* Trust bar */}
              <p className="text-sm text-neutral-500">
                Works with:{" "}
                <span className="text-neutral-600">YouTube &middot; PDF</span>
                {"  "}
                <span className="mx-1 text-neutral-700">&middot;</span>
                {"  "}
                <span className="text-neutral-600">English &amp; French</span>
                {"  "}
                <span className="mx-1 text-neutral-700">&middot;</span>
                {"  "}
                <span className="text-neutral-600">No account needed</span>
              </p>
            </div>

            {/* Right: Day 1 mock card */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 p-7 shadow-xl">
                {/* PREVIEW watermark */}
                <div
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span
                    className="select-none font-display text-6xl font-black tracking-widest text-neutral-950/5"
                    style={{ transform: "rotate(-35deg)", userSelect: "none" }}
                  >
                    PREVIEW
                  </span>
                </div>

                <div className="relative">
                  {/* Day label */}
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary-500">
                    Day 1
                  </p>

                  {/* Title */}
                  <h3 className="mb-4 font-display text-xl font-bold tracking-tight text-neutral-950">
                    Walking in Peace When Life Is Uncertain
                  </h3>

                  {/* Scripture block */}
                  <div className="mb-4 border-l-2 border-primary-500 pl-4">
                    <p className="text-sm italic leading-relaxed text-neutral-600">
                      &ldquo;Be anxious for nothing, but in everything by prayer and supplication,
                      with thanksgiving, let your requests be made known to God.&rdquo;
                    </p>
                    <p className="mt-1 text-xs font-medium text-neutral-500">
                      — Philippians 4:6
                    </p>
                  </div>

                  {/* Reflection */}
                  <p className="mb-4 text-sm leading-relaxed text-neutral-600">
                    Pastor Marcus opened with a question few of us want to sit with: what do
                    we actually do when the thing we feared most arrives? Not as a hypothetical,
                    but as a Tuesday morning reality. His answer, rooted in this passage, was
                    simple and quietly radical — you pray before you panic.
                  </p>
                  <p className="mb-5 text-sm leading-relaxed text-neutral-600">
                    The Greek word for &ldquo;anxious&rdquo; here carries the sense of being
                    pulled in two directions at once — divided against yourself. Paul&apos;s
                    instruction is not that you suppress the feeling, but that you redirect
                    the energy. Supplication with thanksgiving is not denial; it is orientation.
                  </p>

                  {/* Today's action */}
                  <div className="mb-4 flex items-start gap-2.5">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    <p className="text-sm text-neutral-700">
                      <span className="font-semibold">Today&apos;s action:</span> Before checking
                      your phone this morning, write down one thing you&apos;re worried about and
                      one thing you&apos;re grateful for. Bring both to prayer.
                    </p>
                  </div>

                  {/* Prayer */}
                  <p className="text-sm italic leading-relaxed text-neutral-500">
                    Lord, I come to you with what I cannot fix on my own. Teach me to bring
                    my worry to you before I carry it alone...
                  </p>
                </div>
              </div>

              {/* Subtle glow behind card */}
              <div className="pointer-events-none absolute -bottom-10 -right-10 h-60 w-60 rounded-full bg-primary-500/8 blur-[80px]" />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          B2. Embedded tool — inline, light-themed scope inside dark site
          ============================================================ */}
      <section id="try-it" className="px-6 pb-24 scroll-mt-24">
        <div className="mx-auto max-w-5xl">
          <div className="sermon-tool-scope overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
            <SermonApp />
          </div>
        </div>
      </section>

      {/* ============================================================
          C. How it works
          ============================================================ */}
      <section id="how-it-works" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-500">
              Simple Process
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
              Three steps. Under three minutes.
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                number: "1",
                title: "Choose your source",
                body: "Paste a YouTube sermon link or upload a PDF transcript. No audio files, no downloads.",
              },
              {
                number: "2",
                title: "AI reads the sermon",
                body: "The model identifies the 3 strongest themes, captures every scripture reference, and grounds every sentence strictly in what the speaker actually said.",
              },
              {
                number: "3",
                title: "Download your devotional",
                body: "A polished 3-day PDF lands in your browser. Print it, share it digitally, or import it into your church's weekly email.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="relative rounded-2xl border border-neutral-200 bg-neutral-100/50 p-8"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 font-display text-lg font-bold text-primary-500">
                  {step.number}
                </div>
                <h3 className="mb-3 font-display text-xl font-semibold text-neutral-950">
                  {step.title}
                </h3>
                <p className="leading-relaxed text-neutral-600">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          D. What you get
          ============================================================ */}
      <section className="relative px-6 py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-primary-500/4 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-500">
              Every Devotional Includes
            </p>
            <h2 className="mb-4 font-display text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
              A full week of follow-through — grounded in Sunday&apos;s sermon
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-600">
              Each 3-day series follows the same structure, adapted to the sermon&apos;s themes.
            </p>
          </div>

          <div className="mx-auto max-w-2xl divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-neutral-100/50 overflow-hidden">
            {[
              {
                label: "Opening hook",
                desc: "A question or scenario that draws the reader into the day's theme",
              },
              {
                label: "Scripture",
                desc: "The primary passage for that day, quoted in the speaker's exact translation",
              },
              {
                label: "Reflection",
                desc: "4–6 paragraphs walking the reader through the sermon's argument. ~500 words.",
              },
              {
                label: "Today's action",
                desc: "One concrete, time-bound action tied to the theme",
              },
              {
                label: "Prayer",
                desc: "A first-person prayer in the voice of the reader",
              },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-5 px-8 py-5">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <div>
                  <p className="font-semibold text-neutral-800">{item.label}</p>
                  <p className="mt-0.5 text-sm text-neutral-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Cross-references are included when the speaker cited supporting passages.
          </p>
        </div>
      </section>

      {/* ============================================================
          E. Who it's for
          ============================================================ */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="font-display text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
              Built for the people behind Sunday
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Pastors",
                body: "Stop letting your sermon's impact end at noon. Give your congregation something to carry into Monday, Tuesday, Wednesday.",
              },
              {
                title: "Small-group leaders",
                body: "Hand your group a ready-to-use devotional that ties directly to the sermon they just heard. No extra prep.",
              },
              {
                title: "Church administrators",
                body: "Drop a devotional into your weekly email in minutes. Consistent, scriptural, congregation-specific.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-neutral-200 bg-neutral-100/50 p-8 transition hover:border-neutral-300 hover:bg-neutral-100"
              >
                <h3 className="mb-3 font-display text-xl font-semibold text-neutral-950">
                  {card.title}
                </h3>
                <p className="leading-relaxed text-neutral-600">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          F. Pricing
          ============================================================ */}
      <section className="relative px-6 py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute bottom-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary-500/4 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-500">
              Pricing
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
              Free to preview. $2.99 to download.
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
            {/* Preview */}
            <div className="rounded-2xl border border-neutral-200 bg-neutral-100/50 p-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
                Preview
              </p>
              <p className="mb-1 font-display text-3xl font-bold text-neutral-950">Free</p>
              <p className="mb-6 text-sm text-neutral-500">Always</p>
              <p className="leading-relaxed text-neutral-600">
                See the full 3-day devotional before paying. Watermarked — gives you confidence
                in the quality before committing.
              </p>
            </div>

            {/* Download */}
            <div className="rounded-2xl border border-primary-500/30 bg-primary-500/5 p-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary-500">
                Download
              </p>
              <p className="mb-1 font-display text-3xl font-bold text-neutral-950">$2.99</p>
              <p className="mb-6 text-sm text-neutral-500">Per devotional</p>
              <p className="leading-relaxed text-neutral-600">
                Clean, formatted PDF. Yours to keep. No subscription, no account required,
                no recurring charges.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <a
              href={TOOL_ANCHOR}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-8 py-3.5 text-base font-semibold text-neutral-50 shadow-lg transition-all hover:bg-primary-400 hover:shadow-primary-500/20 hover:shadow-xl"
            >
              Try it now — free preview, no account needed
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
          G. FAQ
          ============================================================ */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center font-display text-4xl font-bold tracking-tight text-neutral-950">
            Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "What languages are supported?",
                a: "English and French. The devotional is written in the same language as the sermon source — if the sermon is in French, the devotional is in French.",
              },
              {
                q: "Does it work without a YouTube link?",
                a: "Yes. Upload a PDF transcript directly. YouTube and PDF are the two supported sources.",
              },
              {
                q: "Will it say things the pastor didn't say?",
                a: "No. The model is instructed that every theological claim must be traceable to a moment in the sermon. It cannot invent theology or extend beyond what was said. If you see something that isn't grounded in the source, that's a bug — email us.",
              },
              {
                q: "How long does it take?",
                a: "30 seconds to 3 minutes depending on sermon length. YouTube sermons take slightly longer since the model watches the full video.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-neutral-200 bg-neutral-100/50 p-7"
              >
                <p className="mb-3 font-semibold text-neutral-950">{item.q}</p>
                <p className="leading-relaxed text-neutral-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          H. Final CTA
          ============================================================ */}
      <section className="relative overflow-hidden px-6 py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/6 blur-[130px]" />
        </div>

        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="mb-4 font-display text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
            Ready to extend Sunday&apos;s impact?
          </h2>
          <p className="mb-10 text-lg text-neutral-600">
            Free to preview. No account. No subscription.
          </p>

          <a
            href={TOOL_ANCHOR}
            className="group inline-flex items-center gap-2 rounded-xl bg-primary-500 px-8 py-4 text-lg font-semibold text-neutral-50 shadow-lg transition-all hover:bg-primary-400 hover:shadow-primary-500/20 hover:shadow-xl"
          >
            Try Sermon to Devotional
            <svg
              className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>

          <p className="mt-6 text-sm text-neutral-500">
            Built by D7 Labs &middot; $2.99 per devotional &middot; English &amp; French
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
