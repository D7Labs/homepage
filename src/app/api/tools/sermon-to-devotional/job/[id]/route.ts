import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/store";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, ctx: RouteContext): Promise<NextResponse> {
  const { id } = await ctx.params;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const job = getJob(id);
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  return NextResponse.json({
    jobId: job.id,
    mode: job.mode,
    sourceLabel: job.sourceLabel,
    sourceKind: job.sourceKind,
    preview: job.preview,
    priceCents: job.priceCents,
    currency: job.currency,
    paid: job.paid,
    downloadToken: job.paid ? job.downloadToken : undefined,
  });
}
