import { v2 as speech } from "@google-cloud/speech";
import { CHUNK_SAMPLE_RATE_HZ, splitToFlacChunks } from "./ffmpeg";

const PROJECT_ID = process.env.CHIRP3_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || "";
const LOCATION = process.env.CHIRP3_LOCATION || "us";
const MODEL = process.env.CHIRP3_MODEL || "chirp_3";
const CONCURRENCY = Number(process.env.CHIRP3_CONCURRENCY || "4");

let cachedClient: speech.SpeechClient | null = null;

function getClient(): speech.SpeechClient {
  if (cachedClient) return cachedClient;
  cachedClient = new speech.SpeechClient({
    apiEndpoint: `${LOCATION}-speech.googleapis.com`,
  });
  return cachedClient;
}

interface ChirpTranscript {
  text: string;
  language: string;
  chunkCount: number;
}

interface PendingChunk {
  index: number;
  startSeconds: number;
  bytes: Buffer;
}

interface ChunkResult {
  index: number;
  text: string;
  language: string;
}

export async function transcribeAudio(input: { bytes: Buffer; sourceExt: string }): Promise<ChirpTranscript> {
  if (!PROJECT_ID) {
    throw new Error("CHIRP3_PROJECT_ID (or GOOGLE_CLOUD_PROJECT) is required for Chirp 3");
  }
  const chunks = await splitToFlacChunks(input.bytes, input.sourceExt);
  if (chunks.length === 0) throw new Error("ffmpeg produced no audio chunks");
  const results = await transcribeChunksWithConcurrency(chunks, CONCURRENCY);
  results.sort((a, b) => a.index - b.index);
  const text = results
    .map((r) => r.text.trim())
    .filter((t) => t.length > 0)
    .join(" ");
  const language = results.find((r) => r.language)?.language ?? "en";
  return { text: cleanupTranscript(text), language, chunkCount: chunks.length };
}

async function transcribeChunksWithConcurrency(
  chunks: PendingChunk[],
  concurrency: number,
): Promise<ChunkResult[]> {
  const results: ChunkResult[] = [];
  let cursor = 0;
  async function worker(): Promise<void> {
    while (true) {
      const i = cursor;
      cursor += 1;
      if (i >= chunks.length) return;
      const result = await transcribeChunk(chunks[i]);
      results.push(result);
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, chunks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function transcribeChunk(chunk: PendingChunk): Promise<ChunkResult> {
  const client = getClient();
  const [response] = await client.recognize({
    recognizer: `projects/${PROJECT_ID}/locations/${LOCATION}/recognizers/_`,
    config: {
      autoDecodingConfig: {},
      languageCodes: ["auto"],
      model: MODEL,
      features: { enableAutomaticPunctuation: true },
    },
    content: chunk.bytes,
  });
  const parts: string[] = [];
  let language = "";
  for (const result of response.results ?? []) {
    if (!language && result.languageCode) language = result.languageCode;
    const top = result.alternatives?.[0]?.transcript ?? "";
    if (top) parts.push(top.trim());
  }
  return { index: chunk.index, text: parts.join(" "), language };
}

function cleanupTranscript(text: string): string {
  return text
    .replace(/\s+([.,!?;:])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .replace(/(?<=[.!?])\s+(?=[A-Z])/g, "\n\n")
    .trim();
}

export const CHIRP_SAMPLE_RATE_HZ = CHUNK_SAMPLE_RATE_HZ;
