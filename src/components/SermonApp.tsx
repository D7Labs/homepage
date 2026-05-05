"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// GA event helper — gtag is injected by @next/third-parties/google in the
// app layout. SSR-safe (no-ops on server).
type Gtag = (command: "event", name: string, params?: Record<string, unknown>) => void;
function track(name: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", name, params);
}
import { FileDropzone } from "@/components/FileDropzone";
import { PaywallCard } from "@/components/PaywallCard";
import { PreviewPanel } from "@/components/PreviewPanel";
import { YouTubeInput } from "@/components/YouTubeInput";
import { fileAcceptForMode, fileHelperForMode, type GuideMode } from "@/lib/types";
import { isValidYoutubeUrl } from "@/lib/youtube-url";

type Stage = "choose" | "uploading" | "processing" | "preview" | "paying" | "ready";

const MODE: GuideMode = "devotional";
const ACCEPT = fileAcceptForMode(MODE);
const HELPER = fileHelperForMode(MODE);

interface ProcessResult {
  jobId: string;
  mode: GuideMode;
  sourceLabel: string;
  preview: string;
  priceCents: number;
  currency: string;
}

interface CheckoutResult {
  jobId: string;
  paid: boolean;
  downloadToken: string;
}

interface ConfirmResponse extends ProcessResult {
  paid: boolean;
  downloadToken: string;
}

interface JobResponse extends ProcessResult {
  paid: boolean;
  downloadToken?: string;
}

export function SermonApp() {
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [stage, setStage] = useState<Stage>("choose");
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [download, setDownload] = useState<CheckoutResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setFile(null);
    setYoutubeUrl("");
    setResult(null);
    setDownload(null);
    setError(null);
    setStage("choose");
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const onFileChange = useCallback((next: File) => {
    setFile(next);
    setYoutubeUrl("");
    setError(null);
  }, []);

  const onYoutubeChange = useCallback((next: string) => {
    setYoutubeUrl(next);
    if (next) {
      setFile(null);
    }
    setError(null);
  }, []);

  const onGenerate = useCallback(async () => {
    const trimmedUrl = youtubeUrl.trim();
    const form = new FormData();
    form.append("mode", MODE);
    if (trimmedUrl) form.append("youtubeUrl", trimmedUrl);
    else if (file) form.append("file", file);
    else return;

    const sourceKind = trimmedUrl ? "youtube" : "file";
    track("sermon_submitted", { source_kind: sourceKind });

    setError(null);
    setStage("processing");
    try {
      const res = await fetch("/api/tools/sermon-to-devotional/process", { method: "POST", body: form });
      const json = (await res.json()) as ProcessResult | { error: string };
      if (!res.ok) {
        setError("error" in json ? json.error : "Something went wrong");
        setStage("choose");
        return;
      }
      const r = json as ProcessResult;
      setResult(r);
      setStage("preview");
      track("preview_shown", { job_id: r.jobId, source_kind: r.mode });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
      setStage("choose");
    }
  }, [file, youtubeUrl]);

  const onPay = useCallback(async () => {
    if (!result) return;
    track("checkout_started", { job_id: result.jobId, value: result.priceCents / 100, currency: result.currency });
    setStage("paying");
    setError(null);
    try {
      const res = await fetch("/api/tools/sermon-to-devotional/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: result.jobId }),
      });
      const json = (await res.json()) as
        | { url: string; sessionId: string }
        | { alreadyPaid: true; downloadToken: string }
        | { error: string };
      if (!res.ok) {
        setError("error" in json ? json.error : "Payment failed");
        setStage("preview");
        return;
      }
      if ("alreadyPaid" in json && json.alreadyPaid) {
        setDownload({ jobId: result.jobId, paid: true, downloadToken: json.downloadToken });
        setStage("ready");
        return;
      }
      if ("url" in json && json.url) {
        window.location.href = json.url;
        return;
      }
      setError("Could not start checkout");
      setStage("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
      setStage("preview");
    }
  }, [result]);

  const queryHandledRef = useRef(false);
  useEffect(() => {
    if (queryHandledRef.current) return;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const canceled = params.get("canceled");
    const cancelJobId = params.get("jobId");

    const clearQuery = () => {
      window.history.replaceState({}, "", window.location.pathname);
    };

    if (sessionId) {
      queryHandledRef.current = true;
      setStage("processing");
      void (async () => {
        try {
          const res = await fetch(
            `/api/tools/sermon-to-devotional/checkout/confirm?session_id=${encodeURIComponent(sessionId)}`,
          );
          const json = (await res.json()) as ConfirmResponse | { error: string };
          if (!res.ok) {
            setError("error" in json ? json.error : "Could not confirm payment");
            setStage("choose");
            clearQuery();
            return;
          }
          const c = json as ConfirmResponse;
          setResult({
            jobId: c.jobId,
            mode: c.mode,
            sourceLabel: c.sourceLabel,
            preview: c.preview,
            priceCents: c.priceCents,
            currency: c.currency,
          });
          setDownload({ jobId: c.jobId, paid: true, downloadToken: c.downloadToken });
          setStage("ready");
          track("payment_completed", { job_id: c.jobId, value: c.priceCents / 100, currency: c.currency });
          clearQuery();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Network error");
          setStage("choose");
          clearQuery();
        }
      })();
      return;
    }

    if (canceled && cancelJobId) {
      queryHandledRef.current = true;
      void (async () => {
        try {
          const res = await fetch(`/api/tools/sermon-to-devotional/job/${encodeURIComponent(cancelJobId)}`);
          const json = (await res.json()) as JobResponse | { error: string };
          if (!res.ok) {
            clearQuery();
            return;
          }
          const j = json as JobResponse;
          setResult({
            jobId: j.jobId,
            mode: j.mode,
            sourceLabel: j.sourceLabel,
            preview: j.preview,
            priceCents: j.priceCents,
            currency: j.currency,
          });
          if (j.paid && j.downloadToken) {
            setDownload({ jobId: j.jobId, paid: true, downloadToken: j.downloadToken });
            setStage("ready");
          } else {
            setStage("preview");
            setError("Payment was cancelled. You can try again whenever you're ready.");
          }
          clearQuery();
        } catch {
          clearQuery();
        }
      })();
    }
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      {error ? (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-error/30 bg-error-light px-4 py-3 text-sm text-error-dark"
        >
          {error}
        </div>
      ) : null}

      {stage === "choose" ? (
        <ChooseStage
          file={file}
          youtubeUrl={youtubeUrl}
          onFile={onFileChange}
          onYoutube={onYoutubeChange}
          onGenerate={onGenerate}
        />
      ) : null}

      {stage === "processing" && result === null ? (
        <ProcessingStage label={processingLabel(file, youtubeUrl)} />
      ) : null}

      {(stage === "preview" || stage === "paying" || stage === "ready") && result ? (
        <ResultStage result={result} stage={stage} download={download} onPay={onPay} onReset={reset} />
      ) : null}
    </main>
  );
}

function processingLabel(file: File | null, youtubeUrl: string): string {
  if (file) return file.name;
  if (youtubeUrl.trim()) return "the YouTube link";
  return "your sermon";
}

interface ChooseStageProps {
  file: File | null;
  youtubeUrl: string;
  onFile: (file: File) => void;
  onYoutube: (url: string) => void;
  onGenerate: () => void;
}

function ChooseStage({
  file,
  youtubeUrl,
  onFile,
  onYoutube,
  onGenerate,
}: ChooseStageProps) {
  const trimmedUrl = youtubeUrl.trim();
  const youtubeReady = trimmedUrl.length > 0 && isValidYoutubeUrl(trimmedUrl);
  const ready = youtubeReady || file !== null;

  return (
    <div className="space-y-10">
      <section className="text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
          Choose your sermon source
        </h2>
        <p className="mt-2 text-sm text-on-surface-secondary">
          Paste a YouTube link or upload a PDF transcript.
        </p>

        <div className="mx-auto mt-6 max-w-3xl space-y-4 text-left">
          <YouTubeInput value={youtubeUrl} onChange={onYoutube} />
          {trimmedUrl && !youtubeReady ? (
            <p className="text-xs text-error-dark">That doesn&apos;t look like a valid YouTube URL.</p>
          ) : null}
          <Divider />
          <FileDropzone
            onFile={onFile}
            accept={ACCEPT}
            fileName={file?.name}
            helperText={HELPER}
          />
        </div>
      </section>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={onGenerate}
          disabled={!ready}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary-700 px-8 py-3 text-base font-semibold text-on-primary transition-colors hover:bg-primary-800 active:bg-primary-900 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2"
        >
          Generate devotional
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-outline-secondary" />
      <span className="text-xs font-medium uppercase tracking-wider text-on-surface-tertiary">or</span>
      <div className="h-px flex-1 bg-outline-secondary" />
    </div>
  );
}

interface ProcessingStageProps {
  label: string;
}

function ProcessingStage({ label }: ProcessingStageProps) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-outline-secondary bg-surface p-10 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-700">
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 animate-spin">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
          <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="mt-4 font-display text-xl font-semibold text-on-surface">
        Generating your devotional…
      </h2>
      <p className="mt-2 text-sm text-on-surface-secondary">
        Processing <span className="font-medium text-on-surface">{label}</span>. This usually takes 30 seconds to a few minutes depending on length.
      </p>
    </div>
  );
}

interface ResultStageProps {
  result: ProcessResult;
  stage: Stage;
  download: CheckoutResult | null;
  onPay: () => void;
  onReset: () => void;
}

function ResultStage({ result, stage, download, onPay, onReset }: ResultStageProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-on-surface-secondary">
          Source: <span className="font-medium text-on-surface">{result.sourceLabel}</span>
        </p>
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-primary-700 underline-offset-4 hover:underline"
        >
          ← Start over
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <PreviewPanel title="Devotional preview" preview={result.preview} />
        <div className="space-y-4">
          {stage === "ready" && download ? (
            <DownloadCard jobId={result.jobId} downloadToken={download.downloadToken} />
          ) : (
            <>
              <PaywallCard
                priceCents={result.priceCents}
                currency={result.currency}
                paying={stage === "paying"}
                onPay={onPay}
              />
              <a
                href={`/api/tools/sermon-to-devotional/preview-pdf?jobId=${encodeURIComponent(result.jobId)}`}
                download
                onClick={() => track("preview_pdf_downloaded")}
                className="inline-flex w-full items-center justify-center gap-1.5 text-sm font-medium text-on-surface-secondary underline-offset-4 transition-colors hover:text-primary-700 hover:underline"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
                </svg>
                Download watermarked preview (PDF)
              </a>
            </>
          )}
          <div className="rounded-2xl border border-outline-secondary bg-surface p-5">
            <h4 className="text-sm font-semibold text-on-surface">What you get</h4>
            <ul className="mt-3 space-y-2 text-sm text-on-surface-secondary">
              <li className="flex items-start gap-2">
                <Check />
                Full 3-day devotional as a formatted PDF
              </li>
              <li className="flex items-start gap-2">
                <Check />
                Yours to keep — print, share, or import
              </li>
              <li className="flex items-start gap-2">
                <Check />
                Strictly grounded in your sermon source
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 text-primary-600">
      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7 7a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4L9 11.6l6.3-6.3a1 1 0 011.4 0z" clipRule="evenodd" />
    </svg>
  );
}

type DownloadFormat = "pdf" | "docx";

interface DownloadCardProps {
  jobId: string;
  downloadToken: string;
}

function DownloadCard({ jobId, downloadToken }: DownloadCardProps) {
  const [format, setFormat] = useState<DownloadFormat>("pdf");
  const href = `/api/tools/sermon-to-devotional/download?jobId=${encodeURIComponent(jobId)}&token=${encodeURIComponent(downloadToken)}&format=${format}`;
  return (
    <aside className="rounded-2xl border border-success/30 bg-success-light p-6 shadow-sm">
      <h3 className="text-base font-semibold text-success-dark">Payment received</h3>
      <p className="mt-1 text-sm text-success-dark/80">Pick your format and download.</p>

      <fieldset className="mt-4">
        <legend className="sr-only">Download format</legend>
        <div className="grid grid-cols-2 gap-2">
          <FormatOption
            value="pdf"
            label="PDF"
            sub="Print-ready"
            checked={format === "pdf"}
            onChange={setFormat}
          />
          <FormatOption
            value="docx"
            label="Word"
            sub="Editable .docx"
            checked={format === "docx"}
            onChange={setFormat}
          />
        </div>
      </fieldset>

      <a
        href={href}
        download
        onClick={() => track("file_downloaded", { format })}
        className="mt-4 inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-lg bg-primary-700 px-5 py-2.5 text-base font-medium text-on-primary transition-colors hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
        </svg>
        Download {format === "pdf" ? "PDF" : "Word"}
      </a>
    </aside>
  );
}

interface FormatOptionProps {
  value: DownloadFormat;
  label: string;
  sub: string;
  checked: boolean;
  onChange: (v: DownloadFormat) => void;
}

function FormatOption({ value, label, sub, checked, onChange }: FormatOptionProps) {
  return (
    <label
      className={`flex cursor-pointer flex-col items-start gap-0.5 rounded-lg border-2 px-3 py-2 transition-colors ${
        checked
          ? "border-primary-600 bg-surface"
          : "border-outline-secondary bg-surface hover:border-outline"
      }`}
    >
      <input
        type="radio"
        name="download-format"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <span className="text-sm font-semibold text-on-surface">{label}</span>
      <span className="text-xs text-on-surface-secondary">{sub}</span>
    </label>
  );
}
