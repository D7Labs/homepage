"use client";

interface PaywallCardProps {
  priceCents: number;
  currency: string;
  paying: boolean;
  onPay: () => void;
}

function formatPrice(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

export function PaywallCard({ priceCents, currency, paying, onPay }: PaywallCardProps) {
  return (
    <aside className="rounded-2xl border border-primary-200 bg-primary-50 p-6 shadow-sm">
      <h3 className="text-base font-semibold text-primary-900">Unlock the full document</h3>
      <p className="mt-1 text-sm text-primary-800/80">
        Get the complete file as a downloadable markdown document. One-time purchase, no subscription.
      </p>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-3xl font-bold text-primary-900">
          {formatPrice(priceCents, currency)}
        </span>
        <span className="text-sm text-primary-800/70">one-time</span>
      </div>
      <button
        type="button"
        onClick={onPay}
        disabled={paying}
        className="mt-5 inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-lg bg-primary-700 px-5 py-2.5 text-base font-medium text-on-primary transition-colors hover:bg-primary-800 active:bg-primary-900 disabled:opacity-60 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2"
      >
        {paying ? "Processing payment…" : "Pay & download"}
      </button>
      <p className="mt-3 text-xs text-primary-800/70">
        Secure checkout. You will receive a markdown file you can keep or print.
      </p>
    </aside>
  );
}
