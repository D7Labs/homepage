import { NextRequest, NextResponse } from "next/server";
import { renderDevotionalPreviewPdf } from "@/lib/pdf";
import { getJob } from "@/lib/store";

export const runtime = "nodejs";
export const maxDuration = 60;

function safeFilename(source: string): string {
  const stem = source.replace(/\.[^.]+$/, "").replace(/[^A-Za-z0-9_-]+/g, "-").slice(0, 60) || "sermon";
  return `${stem}-devotional-preview.pdf`;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const jobId = url.searchParams.get("jobId");
  if (!jobId) {
    return NextResponse.json({ error: "jobId required" }, { status: 400 });
  }
  const job = getJob(jobId);
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  if (job.mode !== "devotional") {
    return NextResponse.json({ error: "Unsupported mode" }, { status: 400 });
  }

  const pdf = await renderDevotionalPreviewPdf(job.fullMarkdown, {
    sourceLabel: job.sourceLabel,
  });
  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeFilename(job.sourceLabel)}"`,
      "Content-Length": String(pdf.length),
    },
  });
}
