/* ============================================================
   SiteFooter — Shared footer
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

export default function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <D7Logo size={20} />
          <span className="font-display text-sm font-medium text-neutral-700">D7 Labs</span>
        </div>
        <p className="text-xs text-neutral-500">
          &copy; {new Date().getFullYear()} D7 Labs. Built with purpose.
        </p>
      </div>
    </footer>
  );
}
