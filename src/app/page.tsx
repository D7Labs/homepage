import Image, { type StaticImageData } from "next/image";
import cesperanceLogo from "./images/cesperance-logo.png";
import ezraLogo from "./images/ezra-logo.svg";
import jackLogo from "./images/jack-logo.png";
import davensonPhoto from "./images/davenson-lombard.jpg";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";
import { CONTACT_EMAIL } from "@/lib/contact";

type App = {
  id: string;
  name: string;
  logo: StaticImageData;
  /** Extra classes for the logo tile, for logos that aren't a full app icon. */
  logoClass?: string;
  tagline: string;
  description: string;
  platforms: string;
  price: string;
  website: { href: string; label: string };
  appStore?: string;
  googlePlay?: string;
};

const APPS: App[] = [
  {
    id: "ezra",
    name: "Ezra",
    logo: ezraLogo,
    tagline: "Remember every lecture, sermon, and class.",
    description:
      "A personal learning assistant. Record or import lectures, sermons, YouTube videos and PDFs — Ezra transcribes them, pulls out the key ideas, answers your questions with citations, and builds quizzes, flashcards and study guides.",
    platforms: "iPhone, iPad & Android",
    price: "Free, with optional Ezra Plus",
    website: { href: "https://ezrastudio.ai", label: "ezrastudio.ai" },
    appStore: "https://apps.apple.com/app/id6798003898",
    googlePlay: "https://play.google.com/store/apps/details?id=dev.d7labs.ezra",
  },
  {
    id: "jack-ai",
    name: "Jack AI",
    logo: jackLogo,
    logoClass: "bg-white ring-1 ring-neutral-200",
    tagline: "Your AI assistant. Works offline.",
    description:
      "A private, on-device assistant. Chat, translate as you talk, transcribe recordings, read text from photos and PDFs — all without an internet connection once models are installed.",
    platforms: "iPhone & iPad",
    price: "Free",
    website: { href: "https://jackai.d7labs.dev", label: "jackai.d7labs.dev" },
  },
  {
    id: "chant-esperance",
    name: "Chant d’Espérance",
    logo: cesperanceLogo,
    tagline: "The hymnal, in your pocket.",
    description:
      "A digital hymnal and Bible reader preserving traditional hymn collections for Haitian and Francophone communities worldwide. 9 hymn books, 3 Bible translations, in French, English and Haitian Creole.",
    platforms: "iPhone & Android",
    price: "Free",
    website: { href: "https://cesperance.com", label: "cesperance.com" },
    appStore: "https://apps.apple.com/us/app/cesperance/id6759078317",
    googlePlay:
      "https://play.google.com/store/apps/details?id=com.cesperance.chant_esperance",
  },
];

type TeamMember = {
  name: string;
  role: string;
  photo: StaticImageData;
  bio: string;
  location: string;
  linkedin?: string;
};

const TEAM: TeamMember[] = [
  {
    name: "Davenson Lombard",
    role: "Founder",
    photo: davensonPhoto,
    bio: "Senior software engineer with 12+ years at MongoDB, Confluent and Ciena, and 18 years serving in church audio-visual ministry. Leads product, design and engineering for every D7 Labs app.",
    location: "Montreal, Canada",
  },
];

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "D7 Labs",
  legalName: "Laboratoires D7 Inc.",
  url: "https://d7labs.dev",
  email: CONTACT_EMAIL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Montreal",
    addressRegion: "QC",
    addressCountry: "CA",
  },
  founder: TEAM.map((m) => ({
    "@type": "Person",
    name: m.name,
    jobTitle: m.role,
    image: `https://d7labs.dev${m.photo.src}`,
    ...(m.linkedin ? { sameAs: [m.linkedin] } : {}),
  })),
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
      />
      <SiteNav />

      {/* ============================================================
          Hero
          ============================================================ */}
      <section className="relative overflow-hidden px-6 pb-20 pt-36 sm:pb-28 sm:pt-44">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-primary-200/40 blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-4 py-1.5 text-sm text-neutral-600 backdrop-blur-sm animate-rise">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse-soft" />
            Independent product studio · Montreal
          </div>

          <h1
            className="mb-6 font-display text-5xl font-bold tracking-tighter text-neutral-950 sm:text-6xl lg:text-7xl animate-rise"
            style={{ animationDelay: "80ms" }}
          >
            Useful apps,{" "}
            <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              built to last.
            </span>
          </h1>

          <p
            className="mx-auto mb-10 max-w-2xl text-lg text-neutral-600 sm:text-xl animate-rise"
            style={{ animationDelay: "160ms" }}
          >
            D7 Labs designs, builds and ships its own software — for learning, faith,
            and everyday AI. {APPS.length} apps live today on iOS and Android.
          </p>

          <div
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-rise"
            style={{ animationDelay: "240ms" }}
          >
            <a
              href="#apps"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:-translate-y-0.5 hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/30"
            >
              See the apps
              <svg className="h-4 w-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
              </svg>
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-3 text-base font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-100"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          {/* Portfolio at a glance */}
          <ul
            className="mt-14 flex items-center justify-center gap-4 animate-rise"
            style={{ animationDelay: "320ms" }}
            aria-label="Our apps"
          >
            {APPS.map((app) => (
              <li key={app.id}>
                <a
                  href={`#${app.id}`}
                  title={app.name}
                  className={`block overflow-hidden rounded-2xl shadow-md transition-transform duration-300 hover:-translate-y-1 ${app.logoClass ?? ""}`}
                >
                  <Image src={app.logo} alt={app.name} width={56} height={56} className="h-14 w-14 object-contain" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================================================
          Apps
          ============================================================ */}
      <section id="apps" className="relative scroll-mt-16 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="reveal mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-700">
              Portfolio
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
              Our apps
            </h2>
          </div>

          <div className="divide-y divide-neutral-200 border-y border-neutral-200">
            {APPS.map((app) => (
              <AppRow key={app.id} app={app} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          Team
          ============================================================ */}
      <section id="team" className="relative scroll-mt-16 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="reveal mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-700">
              Team
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
              Who builds D7 Labs
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-neutral-600">
              D7 Labs (Laboratoires D7 Inc.) is a founder-led studio. Every app is
              designed, built and supported in-house.
            </p>
          </div>

          <div className="space-y-6">
            {TEAM.map((m) => (
              <article
                key={m.name}
                className="reveal flex flex-col gap-6 rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm sm:flex-row sm:items-start sm:p-10"
              >
                <Image
                  src={m.photo}
                  alt={`Photo of ${m.name}`}
                  width={128}
                  height={128}
                  placeholder="blur"
                  className="h-28 w-28 shrink-0 rounded-full object-cover ring-4 ring-primary-50 sm:h-32 sm:w-32"
                />
                <div>
                  <h3 className="font-display text-2xl font-semibold text-neutral-950">{m.name}</h3>
                  <p className="mt-1 font-medium text-primary-700">
                    {m.role} <span aria-hidden="true" className="mx-1 text-neutral-400">·</span>{" "}
                    <span className="font-normal text-neutral-500">{m.location}</span>
                  </p>
                  <p className="mt-4 leading-relaxed text-neutral-600">{m.bio}</p>
                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
                    {m.linkedin && (
                      <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary-700 transition hover:text-primary-800">
                        LinkedIn &rarr;
                      </a>
                    )}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary-700 transition hover:text-primary-800">
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          Contact
          ============================================================ */}
      <section id="contact" className="relative scroll-mt-16 px-6 py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute bottom-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary-200/30 blur-[120px]" />
        </div>

        <div className="reveal relative mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-700">
            Let&apos;s talk
          </p>
          <h2 className="mb-6 font-display text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
            Have something in mind?
          </h2>
          <p className="mb-10 text-lg text-neutral-600">
            Feedback on one of our apps, a partnership, or an idea worth building — send
            us a note. We read everything.
          </p>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="group inline-flex items-center gap-3 rounded-2xl bg-primary-500 px-8 py-4 font-display text-lg font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:-translate-y-0.5 hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/30 sm:text-xl"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {CONTACT_EMAIL}
          </a>

          <p className="mt-8 text-sm text-neutral-500">Based in Montreal.</p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

/* ============================================================
   App row — one app per row: icon, story, then where to get it.
   ============================================================ */
function AppRow({ app }: { app: App }) {
  return (
    <article
      id={app.id}
      className="reveal group scroll-mt-24 py-10 sm:grid sm:grid-cols-[88px_1fr] sm:gap-8"
    >
      <div
        className={`mb-5 h-[72px] w-[72px] overflow-hidden rounded-[18px] shadow-md transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-3deg] sm:mb-0 sm:h-[88px] sm:w-[88px] sm:rounded-[22px] ${app.logoClass ?? ""}`}
      >
        <Image src={app.logo} alt={`${app.name} logo`} width={88} height={88} className="h-full w-full object-contain" />
      </div>

      <div>
        <h3 className="font-display text-2xl font-semibold text-neutral-950">{app.name}</h3>
        <p className="mt-1 font-display text-lg text-primary-700">{app.tagline}</p>
        <p className="mt-4 max-w-2xl leading-relaxed text-neutral-600">{app.description}</p>

        <p className="mt-4 text-sm text-neutral-500">
          {app.platforms} <span aria-hidden="true" className="mx-1.5">·</span> {app.price}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
          {(app.appStore || app.googlePlay) && (
            <div className="flex flex-wrap items-center gap-3">
              {app.appStore && (
                <a href={app.appStore} target="_blank" rel="noopener noreferrer" aria-label={`Download ${app.name} on the App Store`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/app-store-badge-en.svg" alt="Download on the App Store" className="h-10 transition hover:opacity-80" />
                </a>
              )}
              {app.googlePlay && (
                <a href={app.googlePlay} target="_blank" rel="noopener noreferrer" aria-label={`Get ${app.name} on Google Play`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/google-play-badge-en.svg" alt="Get it on Google Play" className="h-10 transition hover:opacity-80" />
                </a>
              )}
            </div>
          )}

          <a
            href={app.website.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 transition hover:text-primary-800"
          >
            {app.website.label}
            <svg className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}
