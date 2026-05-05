import Image from "next/image";
import cesperanceLogo from "./images/cesperance-logo.png";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";

const STORE_LINKS = {
  googlePlay:
    "https://play.google.com/store/apps/details?id=com.cesperance.chant_esperance",
  appStore: "https://apps.apple.com/us/app/cesperance/id6759078317",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* ============================================================
          Hero
          ============================================================ */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-16">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/8 blur-[120px]" />
          <div className="absolute right-1/4 top-2/3 h-[400px] w-[400px] rounded-full bg-secondary-500/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Tagline pill */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-300/50 bg-neutral-100/50 px-4 py-1.5 text-sm text-neutral-600 backdrop-blur-sm animate-fade-in">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse-soft" />
            Building for the Kingdom
          </div>

          <h1 className="mb-6 font-display text-5xl font-bold tracking-tighter text-neutral-950 sm:text-6xl lg:text-7xl animate-slide-up">
            Technology that{" "}
            <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              serves
            </span>{" "}
            the Church
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-neutral-600 sm:text-xl animate-slide-up" style={{ animationDelay: "0.1s" }}>
            D7 Labs builds AI-powered tools that help churches extend their impact,
            deepen discipleship, and reach their communities — crafted by an engineer
            with 18 years of ministry experience.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-base font-semibold text-neutral-50 shadow-lg transition-all hover:bg-primary-400 hover:shadow-primary-500/20 hover:shadow-xl"
            >
              Schedule a Conversation
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#products"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-neutral-100/50 px-6 py-3 text-base font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-200/50"
            >
              See My Work
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse-soft">
          <svg className="h-6 w-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </div>
      </section>

      {/* ============================================================
          Products
          ============================================================ */}
      <section id="products" className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-500">
              What I&apos;m Building
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
              Tools for Today&apos;s Church
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Tool 1: Chant d'Espérance */}
            <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100/50 p-8 transition-all hover:border-primary-500/30 hover:bg-neutral-100">
              {/* Glow on hover */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary-500/5 opacity-0 blur-[60px] transition-opacity group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <Image
                    src={cesperanceLogo}
                    alt="Chant d'Espérance logo"
                    width={48}
                    height={48}
                    className="rounded-xl"
                  />
                  <div>
                    <h3 className="font-display text-xl font-semibold text-neutral-950">
                      Chant d&apos;Esp&eacute;rance
                    </h3>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                      Live
                    </span>
                  </div>
                </div>

                <p className="mb-6 text-neutral-600 leading-relaxed">
                  A free digital hymnal and Bible reader preserving traditional Christian hymn
                  collections for Haitian and Francophone communities worldwide. 9 hymn books,
                  3 Bible translations, trilingual interface.
                </p>

                <div className="mb-6 flex flex-wrap gap-2">
                  {["Hymnal", "Bible Reader", "Trilingual", "Free"].map((tag) => (
                    <span key={tag} className="rounded-full bg-neutral-200/80 px-3 py-1 text-xs font-medium text-neutral-700">
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href="https://cesperance.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-500 transition hover:text-primary-400"
                >
                  Visit cesperance.com
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

                <div className="mt-4 flex items-center gap-3">
                  <a
                    href={STORE_LINKS.appStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Download on the App Store"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/app-store-badge-en.svg"
                      alt="Download on the App Store"
                      className="h-10 transition hover:opacity-80"
                    />
                  </a>
                  <a
                    href={STORE_LINKS.googlePlay}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Get it on Google Play"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/google-play-badge-en.svg"
                      alt="Get it on Google Play"
                      className="h-10 transition hover:opacity-80"
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Tool 2: Sermon to Devotional */}
            <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100/50 p-8 transition-all hover:border-primary-500/30 hover:bg-neutral-100">
              <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary-500/5 opacity-0 blur-[60px] transition-opacity group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <h3 className="font-display text-2xl font-bold tracking-tight">
                    <span className="text-neutral-950">Sermon to</span>{" "}
                    <span className="text-primary-500">Devotional</span>
                  </h3>
                  <span className="mt-1.5 inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                    Live
                  </span>
                </div>

                <p className="mb-6 text-neutral-600 leading-relaxed">
                  Paste a YouTube sermon link or upload a PDF transcript. Get a scripture-grounded
                  3-day devotional PDF in minutes. No account, no subscription — just $2.99 per
                  devotional.
                </p>

                <div className="mb-6 flex flex-wrap gap-2">
                  {["YouTube", "PDF", "EN + FR", "$2.99"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-neutral-200/80 px-3 py-1 text-xs font-medium text-neutral-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href="/tools/sermon-to-devotional"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-500 transition hover:text-primary-400"
                >
                  Try it free &rarr;
                </a>
              </div>
            </div>

            {/* Tool 3: Ezra Studio */}
            <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100/50 p-8 transition-all hover:border-secondary-500/30 hover:bg-neutral-100">
              <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-secondary-500/5 opacity-0 blur-[60px] transition-opacity group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <h3 className="font-display text-2xl font-bold tracking-tight">
                    <span className="text-neutral-950">Ezra</span>{" "}
                    <span className="text-primary-500">Studio</span>
                  </h3>
                  <span className="mt-1.5 inline-flex shrink-0 items-center gap-1 text-xs font-medium text-secondary-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary-500 animate-pulse-soft" />
                    Waitlist Open
                  </span>
                </div>

                <p className="mb-6 text-neutral-600 leading-relaxed">
                  Your sermon, multiplied. Ezra Studio turns each Sunday sermon into a
                  searchable library and a week of ready-to-use ministry content —
                  devotionals, discussion guides, and more — in under 10 minutes.
                </p>

                <div className="mb-6 flex flex-wrap gap-2">
                  {["AI-Powered", "Sermon Search", "Content Generation", "Pre-launch"].map((tag) => (
                    <span key={tag} className="rounded-full bg-neutral-200/80 px-3 py-1 text-xs font-medium text-neutral-700">
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href="https://ezrastudio.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary-500 transition hover:text-secondary-400"
                >
                  Join the waitlist at ezrastudio.ai
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <a
              href="/tools"
              className="text-sm font-medium text-primary-500 hover:text-primary-400 transition"
            >
              View all tools &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
          About / Founder
          ============================================================ */}
      <section id="about" className="relative px-6 py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-primary-500/5 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left: Story */}
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-500">
                The Builder
              </p>
              <h2 className="mb-6 font-display text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
                Faith meets
                <br />
                Engineering
              </h2>
              <div className="space-y-4 text-neutral-600 leading-relaxed">
                <p>
                  I&apos;m Davenson Lombard — a senior software engineer with 12+ years at
                  companies like MongoDB and Confluent, and 18 years serving in church
                  audio-visual ministry.
                </p>
                <p>
                  I&apos;ve seen firsthand how churches pour everything into Sunday&apos;s sermon, yet
                  struggle to extend that impact through the week. I&apos;ve watched worship leaders
                  flip through worn paper hymnals searching for the right song. Most churches
                  know technology could help — they just don&apos;t have the right tools or the
                  technical expertise to get there.
                </p>
                <p>
                  D7 Labs exists to close that gap — building thoughtful, AI-powered tools
                  that respect the sacred while embracing the modern, shaped by real
                  conversations with the people they serve.
                </p>
              </div>
            </div>

            {/* Right: Stats / Credentials */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "12+", label: "Years in Enterprise Tech", sub: "MongoDB, Confluent, Ciena" },
                { value: "18", label: "Years in Church Ministry", sub: "AV Engineer to Director" },
                { value: "100K+", label: "Developers Reached", sub: "MongoDB" },
                { value: "3", label: "Languages Supported", sub: "English, French, Creole" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-neutral-200 bg-neutral-100/50 p-6 transition hover:border-neutral-300"
                >
                  <p className="font-display text-3xl font-bold text-primary-500">{stat.value}</p>
                  <p className="mt-1 text-sm font-medium text-neutral-800">{stat.label}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          Mission Statement
          ============================================================ */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-100 to-neutral-100/50 p-10 text-center sm:p-14">
            <blockquote className="font-display text-2xl font-medium leading-relaxed tracking-tight text-neutral-900 sm:text-3xl">
              &ldquo;Whatever you do, work at it with all your heart, as working for the Lord.&rdquo;
            </blockquote>
            <cite className="mt-4 block text-sm font-medium text-neutral-500">
              Colossians 3:23
            </cite>
          </div>
        </div>
      </section>

      {/* ============================================================
          Contact / CTA
          ============================================================ */}
      <section id="contact" className="relative px-6 py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute bottom-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary-500/5 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-500">
            Let&apos;s Talk
          </p>
          <h2 className="mb-6 font-display text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
            What does your church need?
          </h2>
          <p className="mb-10 text-lg text-neutral-600">
            I&apos;m having conversations with church leaders to understand real pain points
            before building solutions. Whether you&apos;re a pastor, worship leader, tech leader,
            or church administrator — I&apos;d love to hear your story.
          </p>

          <div className="mx-auto mt-10 max-w-xl">
            <TallyEmbed />
          </div>

          <p className="mt-8 text-sm text-neutral-500">
            Based in Montreal.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

/* ============================================================
   Tally Form Embed
   ============================================================ */
function TallyEmbed() {
  return (
    <iframe
      data-tally-src="https://tally.so/embed/obOAaX?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
      loading="lazy"
      width="100%"
      height="1871"
      frameBorder="0"
      marginHeight={0}
      marginWidth={0}
      title="Contact D7 Labs"
      style={{ border: "none", background: "transparent", colorScheme: "normal" }}
    />
  );
}

