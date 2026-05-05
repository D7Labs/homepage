/* ============================================================
   SiteNav — Shared navigation bar
   Used across all pages. Dark theme only.
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

export default function SiteNav() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-neutral-200/50 bg-neutral-50/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2.5">
          <D7Logo />
          <span className="font-display text-lg font-semibold tracking-tight text-neutral-950">
            D7 Labs
          </span>
        </a>
        <div className="hidden items-center gap-8 sm:flex">
          <a
            href="/tools"
            className="text-sm text-neutral-600 transition hover:text-primary-500"
          >
            Tools
          </a>
          <a
            href="/#about"
            className="text-sm text-neutral-600 transition hover:text-primary-500"
          >
            About
          </a>
          <a
            href="/#contact"
            className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-neutral-50 transition hover:bg-primary-400"
          >
            Get in Touch
          </a>
        </div>
        {/* Mobile: Get in Touch button */}
        <a
          href="/#contact"
          className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-neutral-50 sm:hidden"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
