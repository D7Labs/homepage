import { NextRequest, NextResponse } from "next/server";
import { logError, logInfo } from "@/lib/log";
import { getAppBaseUrl, getStripe } from "@/lib/stripe";
import { getJob } from "@/lib/store";

export const runtime = "nodejs";

const PRODUCT_NAMES = {
  devotional: "Sermon Devotional PDF",
  transcription: "Sermon Transcript PDF",
} as const;

// Stripe tax code for digital books / e-books — applies to a downloadable
// devotional PDF. Tax is calculated per buyer location at checkout.
const TAX_CODE_EBOOK = "txcd_10103001";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = (await req.json().catch(() => null)) as { jobId?: string } | null;
  const jobId = body?.jobId;
  if (!jobId) return NextResponse.json({ error: "jobId is required" }, { status: 400 });

  const job = getJob(jobId);
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  if (job.paid && job.downloadToken) {
    logInfo("checkout", `job ${jobId} already paid — short-circuiting`);
    return NextResponse.json({ alreadyPaid: true, downloadToken: job.downloadToken });
  }

  const baseUrl = getAppBaseUrl(req);
  const stripe = getStripe();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: job.currency.toLowerCase(),
            product_data: {
              name: PRODUCT_NAMES[job.mode],
              description: `Source: ${job.sourceLabel}`,
              tax_code: TAX_CODE_EBOOK,
            },
            unit_amount: job.priceCents,
            tax_behavior: "exclusive",
          },
          quantity: 1,
        },
      ],
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      billing_address_collection: "required",
      success_url: `${baseUrl}/tools/sermon-to-devotional?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/tools/sermon-to-devotional?canceled=1&jobId=${encodeURIComponent(job.id)}`,
      metadata: { jobId: job.id, mode: job.mode },
      payment_intent_data: {
        metadata: { jobId: job.id, mode: job.mode },
      },
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL");
    }

    logInfo("checkout", `session ${session.id} created for job ${job.id} (${job.priceCents}¢ ${job.currency})`);
    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create checkout session";
    logError("checkout", `create failed: ${message}`, err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
