"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";

interface PreviewPanelProps {
  title: string;
  preview: string;
}

// Labels hidden from preview (internal production labels the reader shouldn't see)
const HIDDEN_LABEL_RE = /^\s*\*\*\s*(Hook|Accroche|Reflection|Réflexion|Reflexion)\s*:?\s*\*\*\s*:?\s*/gim;

// "Application" is the same word in EN and FR; rename it to a reader-facing label
const APPLICATION_RE = /\*\*\s*Application\s*:?\s*\*\*/gi;

function detectMarkdownLang(markdown: string): "fr" | "en" {
  if (/^##\s+Jour\s+\d+/im.test(markdown)) return "fr";
  return "en";
}

function prepareForPreview(markdown: string): string {
  const lang = detectMarkdownLang(markdown);
  const applicationLabel = lang === "fr" ? "**Action du jour :**" : "**Today's action:**";
  return markdown
    .replace(HIDDEN_LABEL_RE, "")
    .replace(APPLICATION_RE, applicationLabel);
}

interface PageSplit {
  seriesTitle: string;
  pages: string[]; // each page is the markdown for one Day (## heading + body)
}

// Split the cleaned preview into one page per Day-level (## ...) heading.
// The series title (# ...) is extracted separately and shown above all pages.
function splitIntoPages(markdown: string): PageSplit {
  const titleMatch = /^#\s+(.+)$/m.exec(markdown);
  const seriesTitle = titleMatch?.[1].trim() ?? "";

  const lines = markdown.split("\n");
  const pages: string[] = [];
  let current: string[] = [];
  let inDay = false;
  for (const line of lines) {
    if (/^##\s+/.test(line)) {
      if (inDay && current.length > 0) pages.push(current.join("\n").trim());
      current = [line];
      inDay = true;
    } else if (inDay) {
      current.push(line);
    }
  }
  if (inDay && current.length > 0) pages.push(current.join("\n").trim());

  // Fallback: if no ## headings were found, render the whole preview as a single page
  if (pages.length === 0) pages.push(markdown);

  return { seriesTitle, pages };
}

// 6-column × 8-row diagonal grid of "D7 Labs" labels covering the preview.
// DOM-based (not SVG-bg) so the page-loaded Space Grotesk font cascades in.
const WATERMARK_COLS = 6;
const WATERMARK_ROWS = 8;

const MARKDOWN_COMPONENTS = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="mb-4 font-display text-2xl font-bold tracking-tight text-on-surface">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mt-1 mb-4 font-display text-2xl font-bold tracking-tight text-on-surface">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mt-5 mb-2 font-display text-lg font-semibold text-on-surface">{children}</h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-3 text-[15px] leading-7 text-on-surface-secondary [&>strong]:text-on-surface">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-on-surface">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => <em className="italic">{children}</em>,
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-3 list-disc space-y-1 pl-5 text-[15px] leading-7 text-on-surface-secondary">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-3 list-decimal space-y-1 pl-5 text-[15px] leading-7 text-on-surface-secondary">{children}</ol>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="my-4 border-l-2 border-primary-500 bg-primary-50 px-4 py-2 italic text-on-surface-secondary">
      {children}
    </blockquote>
  ),
};

export function PreviewPanel({ title, preview }: PreviewPanelProps) {
  const cleaned = useMemo(() => prepareForPreview(preview), [preview]);
  const split = useMemo(() => splitIntoPages(cleaned), [cleaned]);
  const [pageIdx, setPageIdx] = useState(0);

  const totalPages = split.pages.length;
  const currentPage = split.pages[Math.min(pageIdx, totalPages - 1)] ?? "";
  const showPager = totalPages > 1;

  const goPrev = () => setPageIdx((p) => Math.max(0, p - 1));
  const goNext = () => setPageIdx((p) => Math.min(totalPages - 1, p + 1));

  return (
    <section className="rounded-2xl border border-outline-secondary bg-surface shadow-sm">
      <header className="flex items-center justify-between border-b border-outline-secondary px-6 py-4">
        <div>
          <h3 className="text-base font-semibold text-on-surface">{title}</h3>
          {split.seriesTitle ? (
            <p className="mt-0.5 text-sm text-on-surface-secondary">{split.seriesTitle}</p>
          ) : null}
        </div>
        <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-primary-700">
          Preview
        </span>
      </header>

      {showPager ? (
        <div className="flex items-center justify-between border-b border-outline-secondary px-6 py-2.5">
          <span className="text-xs font-medium uppercase tracking-wider text-on-surface-tertiary">
            Page {pageIdx + 1} of {totalPages}
          </span>
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Preview pages">
            {split.pages.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === pageIdx}
                aria-label={`Go to page ${i + 1}`}
                onClick={() => setPageIdx(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === pageIdx ? "bg-primary-600" : "bg-outline hover:bg-on-surface-tertiary"
                }`}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="relative px-6 py-6">
        <article className="markdown-preview text-on-surface">
          <ReactMarkdown components={MARKDOWN_COMPONENTS}>{currentPage}</ReactMarkdown>
        </article>
        {/* Repeating diagonal D7 Labs watermark — DOM-based so Space Grotesk applies */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 select-none overflow-hidden"
        >
          {Array.from({ length: WATERMARK_ROWS * WATERMARK_COLS }).map((_, i) => {
            const row = Math.floor(i / WATERMARK_COLS);
            const col = i % WATERMARK_COLS;
            const left = `${(col + (row % 2 ? 0.5 : 0)) * (100 / WATERMARK_COLS) - 5}%`;
            const top = `${row * (100 / WATERMARK_ROWS) + 4}%`;
            return (
              <span
                key={i}
                className="absolute font-display text-2xl font-bold uppercase tracking-widest text-on-surface"
                style={{
                  left,
                  top,
                  opacity: 0.13,
                  transform: "rotate(-35deg)",
                  whiteSpace: "nowrap",
                }}
              >
                D7 Labs
              </span>
            );
          })}
        </div>
      </div>

      {showPager ? (
        <footer className="flex items-center justify-between border-t border-outline-secondary px-6 py-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={pageIdx === 0}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-on-surface transition-colors hover:text-primary-700 disabled:cursor-not-allowed disabled:text-on-surface-tertiary disabled:hover:text-on-surface-tertiary"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={pageIdx === totalPages - 1}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-on-surface transition-colors hover:text-primary-700 disabled:cursor-not-allowed disabled:text-on-surface-tertiary disabled:hover:text-on-surface-tertiary"
          >
            Next
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </footer>
      ) : null}
    </section>
  );
}
