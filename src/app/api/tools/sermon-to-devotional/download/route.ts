import { NextRequest, NextResponse } from "next/server";
import { renderDevotionalDocx } from "@/lib/docx";
import { renderDevotionalPdf } from "@/lib/pdf";
import { getJob } from "@/lib/store";

export const runtime = "nodejs";
export const maxDuration = 60;

type Format = "pdf" | "docx";

const MIME: Record<Format, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

function isFormat(value: unknown): value is Format {
  return value === "pdf" || value === "docx";
}

function safeFilename(source: string, mode: string, format: Format): string {
  const stem = source.replace(/\.[^.]+$/, "").replace(/[^A-Za-z0-9_-]+/g, "-").slice(0, 60) || "sermon";
  return `${stem}-${mode}.${format}`;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const jobId = url.searchParams.get("jobId");
  const token = url.searchParams.get("token");
  const formatParam = url.searchParams.get("format") ?? "pdf";
  if (!jobId || !token) {
    return NextResponse.json({ error: "jobId and token required" }, { status: 400 });
  }
  if (!isFormat(formatParam)) {
    return NextResponse.json({ error: "format must be 'pdf' or 'docx'" }, { status: 400 });
  }
  const job = getJob(jobId);
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  if (!job.paid || job.downloadToken !== token) {
    return NextResponse.json({ error: "Payment required" }, { status: 402 });
  }
  if (job.mode !== "devotional") {
    return NextResponse.json({ error: "Unsupported mode" }, { status: 400 });
  }

  const file =
    formatParam === "docx"
      ? await renderDevotionalDocx(job.fullMarkdown, { sourceLabel: job.sourceLabel })
      : await renderDevotionalPdf(job.fullMarkdown, { sourceLabel: job.sourceLabel });

  return new NextResponse(new Uint8Array(file), {
    status: 200,
    headers: {
      "Content-Type": MIME[formatParam],
      "Content-Disposition": `attachment; filename="${safeFilename(job.sourceLabel, job.mode, formatParam)}"`,
      "Content-Length": String(file.length),
    },
  });
}
