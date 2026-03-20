import Image from "next/image";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import cesperanceLogo from "./images/cesperance-logo.png";

const STORE_LINKS = {
  googlePlay:
    "https://play.google.com/store/apps/details?id=com.cesperance.chant_esperance",
  appStore: "https://apps.apple.com/us/app/cesperance/id6759078317",
};

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations();

  const stats = [
    { ...jsonStat(t, "about.stats.enterpriseTech") },
    { ...jsonStat(t, "about.stats.churchMinistry") },
    { ...jsonStat(t, "about.stats.developersReached") },
    { ...jsonStat(t, "about.stats.languages") },
  ];

  const cesperanceTags: string[] = ["products.cesperance.tags.0", "products.cesperance.tags.1", "products.cesperance.tags.2", "products.cesperance.tags.3"].map(k => t(k));
  const alphaTags: string[] = ["products.alpha.tags.0", "products.alpha.tags.1", "products.alpha.tags.2", "products.alpha.tags.3"].map(k => t(k));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ============================================================
          Nav
          ============================================================ */}
      <nav className="fixed top-0 z-50 w-full border-b border-neutral-200/50 bg-neutral-50/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="#" className="flex items-center gap-2.5">
            <D7Logo />
            <span className="font-display text-lg font-semibold tracking-tight text-neutral-950">
              D7 Labs
            </span>
          </a>
          <div className="hidden items-center gap-8 sm:flex">
            <a href="#products" className="text-sm text-neutral-600 transition hover:text-primary-500">
              {t("nav.products")}
            </a>
            <a href="#about" className="text-sm text-neutral-600 transition hover:text-primary-500">
              {t("nav.about")}
            </a>
            <LanguageSwitcher />
            <a
              href="#contact"
              className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-neutral-50 transition hover:bg-primary-400"
            >
              {t("nav.getInTouch")}
            </a>
          </div>
          {/* Mobile menu button */}
          <div className="flex items-center gap-3 sm:hidden">
            <LanguageSwitcher />
            <a
              href="#contact"
              className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-neutral-50"
            >
              {t("nav.contact")}
            </a>
          </div>
        </div>
      </nav>

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
            {t("hero.tagline")}
          </div>

          <h1 className="mb-6 font-display text-5xl font-bold tracking-tighter text-neutral-950 sm:text-6xl lg:text-7xl animate-slide-up">
            {t("hero.titlePre")}
            <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              {t("hero.titleHighlight")}
            </span>
            {t("hero.titlePost")}
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-neutral-600 sm:text-xl animate-slide-up" style={{ animationDelay: "0.1s" }}>
            {t("hero.description")}
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-base font-semibold text-neutral-50 shadow-lg transition-all hover:bg-primary-400 hover:shadow-primary-500/20 hover:shadow-xl"
            >
              {t("hero.cta")}
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#products"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-neutral-100/50 px-6 py-3 text-base font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-200/50"
            >
              {t("hero.secondaryCta")}
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
              {t("products.sectionLabel")}
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
              {t("products.sectionTitle")}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Product 1: Chant d'Espérance */}
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
                      {t("products.cesperance.name")}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                      {t("products.cesperance.status")}
                    </span>
                  </div>
                </div>

                <p className="mb-6 text-neutral-600 leading-relaxed">
                  {t("products.cesperance.description")}
                </p>

                <div className="mb-6 flex flex-wrap gap-2">
                  {cesperanceTags.map((tag) => (
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
                  {t("products.cesperance.visitLink")}
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

                <div className="mt-4 flex items-center gap-3">
                  <a
                    href={STORE_LINKS.appStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("products.cesperance.appStoreAlt")}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/app-store-badge-en.svg"
                      alt={t("products.cesperance.appStoreAlt")}
                      className="h-10 transition hover:opacity-80"
                    />
                  </a>
                  <a
                    href={STORE_LINKS.googlePlay}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("products.cesperance.googlePlayAlt")}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/google-play-badge-en.svg"
                      alt={t("products.cesperance.googlePlayAlt")}
                      className="h-10 transition hover:opacity-80"
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Product 2: Alpha */}
            <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100/50 p-8 transition-all hover:border-secondary-500/30 hover:bg-neutral-100">
              <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-secondary-500/5 opacity-0 blur-[60px] transition-opacity group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-500/10 text-secondary-500">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-neutral-950">
                      {t("products.alpha.name")}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-secondary-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary-500 animate-pulse-soft" />
                      {t("products.alpha.status")}
                    </span>
                  </div>
                </div>

                <p className="mb-6 text-neutral-600 leading-relaxed">
                  {t("products.alpha.description")}
                </p>

                <div className="mb-6 flex flex-wrap gap-2">
                  {alphaTags.map((tag) => (
                    <span key={tag} className="rounded-full bg-neutral-200/80 px-3 py-1 text-xs font-medium text-neutral-700">
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href="https://studio.d7labs.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary-500 transition hover:text-secondary-400"
                >
                  {t("products.alpha.visitLink")}
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
                {t("about.sectionLabel")}
              </p>
              <h2 className="mb-6 font-display text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl whitespace-pre-line">
                {t("about.sectionTitle")}
              </h2>
              <div className="space-y-4 text-neutral-600 leading-relaxed">
                <p>{t("about.bio1")}</p>
                <p>{t("about.bio2")}</p>
                <p>{t("about.bio3")}</p>
              </div>
            </div>

            {/* Right: Stats / Credentials */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
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
              {t("mission.quote")}
            </blockquote>
            <cite className="mt-4 block text-sm font-medium text-neutral-500">
              {t("mission.citation")}
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
            {t("contact.sectionLabel")}
          </p>
          <h2 className="mb-6 font-display text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
            {t("contact.sectionTitle")}
          </h2>
          <p className="mb-10 text-lg text-neutral-600">
            {t("contact.description")}
          </p>

          <div className="mx-auto mt-10 max-w-xl">
            <TallyEmbed title={t("contact.formTitle")} />
          </div>

          <p className="mt-8 text-sm text-neutral-500">
            {t("contact.location")}
          </p>
        </div>
      </section>

      {/* ============================================================
          Footer
          ============================================================ */}
      <footer className="border-t border-neutral-200 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <D7Logo size={20} />
            <span className="font-display text-sm font-medium text-neutral-700">D7 Labs</span>
          </div>
          <p className="text-xs text-neutral-500">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ============================================================
   Helper to extract stat objects from translations
   ============================================================ */
function jsonStat(t: ReturnType<typeof useTranslations>, prefix: string) {
  return {
    value: t(`${prefix}.value`),
    label: t(`${prefix}.label`),
    sub: t(`${prefix}.sub`),
  };
}

/* ============================================================
   Language Switcher
   ============================================================ */
function LanguageSwitcher() {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-neutral-200/50 bg-neutral-100/50 p-0.5 text-xs font-medium">
      <Link
        href="/"
        locale="en"
        className="rounded-md px-2 py-1 text-neutral-600 transition hover:bg-neutral-200/80 hover:text-neutral-950"
      >
        EN
      </Link>
      <Link
        href="/"
        locale="fr"
        className="rounded-md px-2 py-1 text-neutral-600 transition hover:bg-neutral-200/80 hover:text-neutral-950"
      >
        FR
      </Link>
    </div>
  );
}

/* ============================================================
   Tally Form Embed
   ============================================================ */
function TallyEmbed({ title }: { title: string }) {
  return (
    <iframe
      data-tally-src="https://tally.so/embed/obOAaX?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
      loading="lazy"
      width="100%"
      height="1871"
      frameBorder="0"
      marginHeight={0}
      marginWidth={0}
      title={title}
      style={{ border: "none", background: "transparent", colorScheme: "normal" }}
    />
  );
}

/* ============================================================
   D7 Labs Logo — Monogram
   ============================================================ */
function D7Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="D7 Labs logo"
    >
      <rect width="32" height="32" rx="8" fill="#0ec28a" />
      <text
        x="16"
        y="22"
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
        fontSize="16"
        fontWeight="700"
        fill="#09090B"
      >
        D7
      </text>
    </svg>
  );
}
