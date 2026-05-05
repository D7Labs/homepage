import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { logError, logInfo, logWarn } from "@/lib/log";
import { archivePayment } from "@/lib/spaces";
import { getStripe } from "@/lib/stripe";
import { getJob, saveJob } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required" }, { status: 400 });
  }

  const stripe = getStripe();

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to retrieve session";
    logError("confirm", `retrieve failed for ${sessionId}: ${message}`, err);
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const jobId = session.metadata?.jobId;
  if (!jobId) {
    logWarn("confirm", `session ${sessionId} has no jobId metadata`);
    return NextResponse.json({ error: "Session missing job reference" }, { status: 400 });
  }

  const job = getJob(jobId);
  if (!job) {
    logWarn("confirm", `session ${sessionId} references missing job ${jobId}`);
    return NextResponse.json({ error: "Job no longer available" }, { status: 410 });
  }

  if (session.payment_status !== "paid") {
    logWarn("confirm", `session ${sessionId} not paid (status=${session.payment_status})`);
    return NextResponse.json(
      { error: "Payment not completed", paymentStatus: session.payment_status },
      { status: 402 },
    );
  }

  if (!job.paid || !job.downloadToken) {
    job.paid = true;
    job.downloadToken = randomBytes(24).toString("hex");
    saveJob(job);
    logInfo("confirm", `job ${jobId} marked paid via session ${sessionId}`);

    // Archive paid status + customer email to Spaces (fire-and-forget)
    void archivePayment({
      jobId: job.id,
      meta: {
        jobId: job.id,
        mode: job.mode,
        sourceLabel: job.sourceLabel,
        sourceKind: job.sourceKind,
        createdAt: job.createdAt,
        paid: true,
        paidAt: Date.now(),
        priceCents: job.priceCents,
        currency: job.currency,
        customerEmail: session.customer_details?.email ?? undefined,
        stripeSessionId: session.id,
      },
    });
  }

  return NextResponse.json({
    jobId: job.id,
    mode: job.mode,
    sourceLabel: job.sourceLabel,
    sourceKind: job.sourceKind,
    preview: job.preview,
    priceCents: job.priceCents,
    currency: job.currency,
    paid: true,
    downloadToken: job.downloadToken,
  });
}
