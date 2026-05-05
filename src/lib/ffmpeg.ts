import { spawn } from "node:child_process";
import { mkdtemp, readFile, readdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const FFMPEG = process.env.FFMPEG_PATH || "ffmpeg";
const TARGET_BITRATE = process.env.AUDIO_TARGET_BITRATE || "32k";
const TARGET_RATE = process.env.AUDIO_TARGET_SAMPLE_RATE || "16000";
const CHUNK_SECONDS = Number(process.env.AUDIO_CHUNK_SECONDS || "50");

interface NormalizedAudio {
  bytes: Buffer;
  mime: "audio/mpeg";
  filename: string;
}

interface AudioChunk {
  index: number;
  startSeconds: number;
  bytes: Buffer;
}

async function run(args: string[]): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const proc = spawn(FFMPEG, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (d) => {
      stderr += d.toString();
    });
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}: ${stderr.slice(-500)}`));
    });
  });
}

export function extFromName(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot) : "";
}

export async function normalizeToMp3(input: Buffer, sourceExt: string): Promise<NormalizedAudio> {
  const dir = await mkdtemp(join(tmpdir(), "sermon-mp3-"));
  const inputPath = join(dir, `input${sourceExt || ".bin"}`);
  const outputPath = join(dir, "output.mp3");
  try {
    await writeFile(inputPath, input);
    await run([
      "-y",
      "-i",
      inputPath,
      "-vn",
      "-ac",
      "1",
      "-ar",
      TARGET_RATE,
      "-b:a",
      TARGET_BITRATE,
      "-codec:a",
      "libmp3lame",
      outputPath,
    ]);
    const bytes = await readFile(outputPath);
    return { bytes, mime: "audio/mpeg", filename: "audio.mp3" };
  } finally {
    rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

export async function splitToFlacChunks(input: Buffer, sourceExt: string): Promise<AudioChunk[]> {
  const dir = await mkdtemp(join(tmpdir(), "sermon-chunks-"));
  const inputPath = join(dir, `input${sourceExt || ".bin"}`);
  const pattern = join(dir, "chunk_%03d.flac");
  try {
    await writeFile(inputPath, input);
    await run([
      "-y",
      "-i",
      inputPath,
      "-vn",
      "-ac",
      "1",
      "-ar",
      TARGET_RATE,
      "-c:a",
      "flac",
      "-f",
      "segment",
      "-segment_time",
      String(CHUNK_SECONDS),
      "-reset_timestamps",
      "1",
      pattern,
    ]);
    const entries = (await readdir(dir))
      .filter((n) => /^chunk_\d{3}\.flac$/.test(n))
      .sort();
    const chunks: AudioChunk[] = [];
    for (let i = 0; i < entries.length; i += 1) {
      const bytes = await readFile(join(dir, entries[i]));
      chunks.push({ index: i, startSeconds: i * CHUNK_SECONDS, bytes });
    }
    return chunks;
  } finally {
    rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

export const CHUNK_SAMPLE_RATE_HZ = Number(TARGET_RATE);
