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
            Independent product studio
          </div>

          <h1 className="mb-6 font-display text-5xl font-bold tracking-tighter text-neutral-950 sm:text-6xl lg:text-7xl animate-slide-up">
            We build{" "}
            <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              AI-powered
            </span>{" "}
            products people actually use
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-neutral-600 sm:text-xl animate-slide-up" style={{ animationDelay: "0.1s" }}>
            D7 Labs is an independent studio that designs, builds, and ships its own
            software — practical products made to solve real problems. Here&apos;s what
            we&apos;ve built so far.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-base font-semibold text-neutral-50 shadow-lg transition-all hover:bg-primary-400 hover:shadow-primary-500/20 hover:shadow-xl"
            >
              Start a conversation
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#products"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-neutral-100/50 px-6 py-3 text-base font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-200/50"
            >
              See our work
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
              Our Work
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
              Projects
            </h2>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
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

            {/* Tool 2: Ezra Studio */}
            <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100/50 p-8 transition-all hover:border-primary-500/30 hover:bg-neutral-100">
              <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary-500/5 opacity-0 blur-[60px] transition-opacity group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <h3 className="font-display text-2xl font-bold tracking-tight">
                    <span className="text-neutral-950">Ezra</span>{" "}
                    <span className="text-primary-500">Studio</span>
                  </h3>
                  <span className="mt-1.5 inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                    Live
                  </span>
                </div>

                <p className="mb-6 text-neutral-600 leading-relaxed">
                  Your sermon, multiplied. Ezra Studio turns each Sunday sermon into a
                  searchable library and a week of ready-to-use ministry content —
                  devotionals, discussion guides, and more — in under 10 minutes.
                </p>

                <div className="mb-6 flex flex-wrap gap-2">
                  {["AI-Powered", "Sermon Search", "Content Generation"].map((tag) => (
                    <span key={tag} className="rounded-full bg-neutral-200/80 px-3 py-1 text-xs font-medium text-neutral-700">
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href="https://ezrastudio.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-500 transition hover:text-primary-400"
                >
                  Visit ezrastudio.ai
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
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
            Have something in mind?
          </h2>
          <p className="mb-10 text-lg text-neutral-600">
            Whether you have a product idea, a problem worth solving, or just want to see
            what we&apos;re working on next — we&apos;d love to hear from you.
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

