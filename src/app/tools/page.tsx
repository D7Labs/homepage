/* ============================================================
   Tools Hub — D7 Labs
   Directory of all AI tools built for churches.
   Server component.
   ============================================================ */

import type { Metadata } from "next";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Tools for Churches — D7 Labs",
  description:
    "AI-powered tools that help churches extend their sermon impact, deepen discipleship, and engage their congregation through the week.",
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* ============================================================
          Hero
          ============================================================ */}
      <section className="relative overflow-hidden px-6 pb-20 pt-36">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary-500/6 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-500">
            D7 Labs Tools
          </p>
          <h1 className="mb-4 font-display text-5xl font-bold tracking-tighter text-neutral-950 sm:text-6xl">
            Tools for the Church
          </h1>
          <p className="max-w-xl text-lg text-neutral-600">
            Practical AI tools built for pastors and church teams. Free to try.
          </p>
        </div>
      </section>

      {/* ============================================================
          Tool Grid
          ============================================================ */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-2">

            {/* Card 1 — Sermon to Devotional (Live) */}
            <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100/50 p-8 transition-all hover:border-primary-500/30 hover:bg-neutral-100">
              {/* Hover glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary-500/5 opacity-0 blur-[60px] transition-opacity group-hover:opacity-100" />

              <div className="relative">
                {/* Status badge */}
                <div className="mb-5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                    Live
                  </span>
                </div>

                <h2 className="mb-3 font-display text-2xl font-bold tracking-tight text-neutral-950">
                  Sermon to Devotional
                </h2>
                <p className="mb-6 leading-relaxed text-neutral-600">
                  Turn any sermon into a scripture-grounded 3-day devotional PDF. Works with
                  YouTube links or PDF transcripts. English and French.
                </p>

                <div className="mb-8 flex flex-wrap gap-2">
                  {["YouTube", "PDF", "English + French", "$2.99"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-neutral-200/80 px-3 py-1 text-xs font-medium text-neutral-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="/tools/sermon-to-devotional"
                    className="text-sm font-medium text-primary-500 transition hover:text-primary-400"
                  >
                    Learn more &rarr;
                  </a>
                  <a
                    href="/tools/sermon-to-devotional"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-neutral-50 transition hover:bg-primary-400"
                  >
                    Try it free &rarr;
                  </a>
                </div>
              </div>
            </div>

            {/* Card 2 — More tools coming */}
            <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100/50 p-8 transition-all hover:border-secondary-500/30 hover:bg-neutral-100">
              <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-secondary-500/5 opacity-0 blur-[60px] transition-opacity group-hover:opacity-100" />

              <div className="relative">
                {/* Status badge */}
                <div className="mb-5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-500/10 px-3 py-1 text-xs font-semibold text-secondary-500">
                    <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-secondary-500" />
                    Coming soon
                  </span>
                </div>

                <h2 className="mb-3 font-display text-2xl font-bold tracking-tight text-neutral-950">
                  More tools on the way
                </h2>
                <p className="mb-8 leading-relaxed text-neutral-600">
                  Ezra Studio is bringing sermon search, discussion guides, quiz generation, and
                  more. Join the waitlist to get early access.
                </p>

                <a
                  href="https://ezrastudio.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary-500 transition hover:text-secondary-400"
                >
                  Join the waitlist
                  <svg
                    className="h-3.5 w-3.5"
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
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
