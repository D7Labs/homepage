import "server-only";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { logInfo, logWarn } from "./log";

// DO Spaces is S3-compatible. Archive is fire-and-forget: failures log but
// never bubble up to the user-facing request — losing an archive entry is
// strictly better than failing a paid checkout.

interface SpacesConfig {
  endpoint: string;
  region: string;
  bucket: string;
  key: string;
  secret: string;
}

let cached: { client: S3Client; bucket: string } | null | undefined;

function loadConfig(): SpacesConfig | null {
  const endpoint = process.env.DO_SPACES_ENDPOINT;
  const region = process.env.DO_SPACES_REGION;
  const bucket = process.env.DO_SPACES_BUCKET;
  const key = process.env.DO_SPACES_KEY;
  const secret = process.env.DO_SPACES_SECRET;
  if (!endpoint || !region || !bucket || !key || !secret) return null;
  return { endpoint, region, bucket, key, secret };
}

function getClient(): { client: S3Client; bucket: string } | null {
  if (cached !== undefined) return cached;
  const cfg = loadConfig();
  if (!cfg) {
    logInfo("spaces", "not configured — archive disabled (set DO_SPACES_* env vars to enable)");
    cached = null;
    return null;
  }
  const client = new S3Client({
    endpoint: cfg.endpoint,
    region: cfg.region,
    credentials: { accessKeyId: cfg.key, secretAccessKey: cfg.secret },
    forcePathStyle: false,
  });
  cached = { client, bucket: cfg.bucket };
  return cached;
}

export interface JobMeta {
  jobId: string;
  mode: string;
  sourceLabel: string;
  sourceKind: string;
  createdAt: number;
  paid: boolean;
  paidAt?: number;
  priceCents: number;
  currency: string;
  customerEmail?: string;
  stripeSessionId?: string;
}

export async function archiveJob(args: { jobId: string; markdown: string; meta: JobMeta }): Promise<void> {
  const c = getClient();
  if (!c) return;
  try {
    await Promise.all([
      c.client.send(
        new PutObjectCommand({
          Bucket: c.bucket,
          Key: `jobs/${args.jobId}/markdown.md`,
          Body: args.markdown,
          ContentType: "text/markdown; charset=utf-8",
        }),
      ),
      c.client.send(
        new PutObjectCommand({
          Bucket: c.bucket,
          Key: `jobs/${args.jobId}/meta.json`,
          Body: JSON.stringify(args.meta, null, 2),
          ContentType: "application/json",
        }),
      ),
    ]);
    logInfo("spaces", `archived job ${args.jobId}`);
  } catch (err) {
    logWarn("spaces", `archive failed for ${args.jobId}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export async function archivePayment(args: { jobId: string; meta: JobMeta }): Promise<void> {
  const c = getClient();
  if (!c) return;
  try {
    await c.client.send(
      new PutObjectCommand({
        Bucket: c.bucket,
        Key: `jobs/${args.jobId}/meta.json`,
        Body: JSON.stringify(args.meta, null, 2),
        ContentType: "application/json",
      }),
    );
    logInfo("spaces", `updated meta for ${args.jobId} (paid)`);
  } catch (err) {
    logWarn("spaces", `payment archive failed for ${args.jobId}: ${err instanceof Error ? err.message : String(err)}`);
  }
}
