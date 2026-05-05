import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/chirp";
import { extFromName } from "@/lib/ffmpeg";
import { devotionalFromPdf, devotionalFromYoutube } from "@/lib/gemini";
import { buildPreview } from "@/lib/preview";
import { archiveJob } from "@/lib/spaces";
import { newId, saveJob } from "@/lib/store";
import {
  ALLOWED_SOURCES,
  PRICE_CENTS,
  classifyFile,
  type GuideJob,
  type GuideMode,
  type SourceKind,
} from "@/lib/types";
import { extractVideoIdFromUrl, isValidYoutubeUrl } from "@/lib/youtube-url";
import { logError, logInfo, logWarn } from "@/lib/log";

export const runtime = "nodejs";
export const maxDuration = 600;

function isMode(value: unknown): value is GuideMode {
  return value === "transcription" || value === "devotional";
}

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

interface JobInput {
  sourceKind: SourceKind;
  sourceLabel: string;
  fullMarkdown: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const startedAt = Date.now();
  logInfo("process", "POST received");
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    logWarn("process", "invalid multipart body");
    return NextResponse.json({ error: "Invalid multipart body" }, { status: 400 });
  }

  const mode = form.get("mode");
  if (!isMode(mode)) {
    logWarn("process", `missing or invalid mode: ${String(mode)}`);
    return NextResponse.json({ error: "mode must be 'transcription' or 'devotional'" }, { status: 400 });
  }
  logInfo("process", `mode=${mode}`);

  try {
    const job = mode === "transcription"
      ? await runTranscription(form)
      : await runDevotional(form);

    const stored: GuideJob = {
      id: newId(),
      mode,
      sourceLabel: job.sourceLabel,
      sourceKind: job.sourceKind,
      createdAt: Date.now(),
      preview: buildPreview(job.fullMarkdown),
      fullMarkdown: job.fullMarkdown,
      paid: false,
      priceCents: PRICE_CENTS[mode],
      currency: "USD",
    };
    saveJob(stored);
    // Fire-and-forget archive to DO Spaces (no-op if not configured)
    void archiveJob({
      jobId: stored.id,
      markdown: stored.fullMarkdown,
      meta: {
        jobId: stored.id,
        mode: stored.mode,
        sourceLabel: stored.sourceLabel,
        sourceKind: stored.sourceKind,
        createdAt: stored.createdAt,
        paid: false,
        priceCents: stored.priceCents,
        currency: stored.currency,
      },
    });
    const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
    logInfo(
      "process",
      `done jobId=${stored.id} mode=${mode} sourceKind=${job.sourceKind} chars=${job.fullMarkdown.length} in ${elapsed}s`,
    );
    return NextResponse.json({
      jobId: stored.id,
      mode: stored.mode,
      sourceLabel: stored.sourceLabel,
      sourceKind: stored.sourceKind,
      preview: stored.preview,
      priceCents: stored.priceCents,
      currency: stored.currency,
    });
  } catch (err) {
    const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
    if (err instanceof HttpError) {
      logWarn("process", `client error (${err.status}): ${err.message} (after ${elapsed}s)`);
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : "Processing failed";
    logError("process", `failed after ${elapsed}s`, err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

async function runTranscription(form: FormData): Promise<JobInput> {
  const file = form.get("file");
  if (!(file instanceof File)) {
    throw new HttpError(400, "Upload an audio or video file for transcription.");
  }
  const kind = classifyFile(file.type, file.name);
  if (!ALLOWED_SOURCES.transcription.includes(kind as SourceKind)) {
    throw new HttpError(415, "Transcription only accepts audio or video files.");
  }
  logInfo("process", `transcription: ${file.name} (${kind}, ${(file.size / 1024 / 1024).toFixed(1)}MB)`);
  const bytes = Buffer.from(await file.arrayBuffer());
  const result = await transcribeAudio({ bytes, sourceExt: extFromName(file.name) });
  logInfo("process", `transcription: ${result.chunkCount} chunks, ${result.text.length} chars, lang=${result.language}`);
  const markdown = formatTranscriptMarkdown(file.name, result.text);
  return {
    sourceKind: kind as SourceKind,
    sourceLabel: file.name,
    fullMarkdown: markdown,
  };
}

async function runDevotional(form: FormData): Promise<JobInput> {
  const file = form.get("file");
  const youtubeRaw = form.get("youtubeUrl");
  const youtubeUrl = typeof youtubeRaw === "string" ? youtubeRaw.trim() : "";

  if (youtubeUrl) return devotionalFromYoutubeLink(youtubeUrl);
  if (file instanceof File) return devotionalFromUploadedPdf(file);

  throw new HttpError(400, "Provide a YouTube link or upload a PDF transcript.");
}

async function devotionalFromYoutubeLink(url: string): Promise<JobInput> {
  if (!isValidYoutubeUrl(url)) throw new HttpError(400, "That doesn't look like a valid YouTube URL.");
  const videoId = extractVideoIdFromUrl(url) ?? "video";
  logInfo("process", `devotional from YouTube: ${url} (videoId=${videoId})`);
  const markdown = await devotionalFromYoutube(url);
  logInfo("process", `devotional ready: ${markdown.length} chars`);
  return {
    sourceKind: "youtube",
    sourceLabel: `YouTube — ${videoId}`,
    fullMarkdown: markdown,
  };
}

async function devotionalFromUploadedPdf(file: File): Promise<JobInput> {
  const kind = classifyFile(file.type, file.name);
  if (kind !== "pdf") {
    throw new HttpError(415, "Upload a PDF transcript.");
  }
  logInfo("process", `devotional from PDF: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`);
  const bytes = Buffer.from(await file.arrayBuffer());
  const markdown = await devotionalFromPdf(bytes);
  logInfo("process", `devotional ready: ${markdown.length} chars`);
  return { sourceKind: "pdf", sourceLabel: file.name, fullMarkdown: markdown };
}

function formatTranscriptMarkdown(filename: string, text: string): string {
  const title = filename.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim() || "Sermon Transcript";
  return `# ${title}\n\n${text}`;
}
