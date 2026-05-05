import { logError, logInfo } from "./log";
import { extractVideoIdFromUrl } from "./youtube-url";

const MODEL = process.env.SERMON_GUIDE_MODEL || "gemini-3.1-pro-preview";
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

interface InlinePart {
  inlineData: { mimeType: string; data: string };
}

interface FileDataPart {
  fileData: { fileUri: string; mimeType?: string };
}

interface TextPart {
  text: string;
}

type Part = InlinePart | FileDataPart | TextPart;

interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  error?: { message?: string };
}

async function callGemini(parts: Part[]): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_API_KEY is not set");
  const url = `${ENDPOINT}/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const startedAt = Date.now();
  logInfo("gemini", `calling ${MODEL} with ${parts.length} part(s)`);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts }] }),
  });
  const json = (await res.json()) as GeminiResponse;
  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  if (!res.ok) {
    logError("gemini", `error ${res.status} after ${elapsed}s: ${json.error?.message ?? res.statusText}`);
    throw new Error(`Gemini ${res.status}: ${json.error?.message ?? res.statusText}`);
  }
  const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  if (!text) {
    logError("gemini", `empty response after ${elapsed}s`);
    throw new Error("Gemini returned no text");
  }
  logInfo("gemini", `ok in ${elapsed}s — ${text.length} chars`);
  return text.trim();
}

const DEVOTIONAL_FORMAT = `Write a 3-day devotional series grounded strictly in the source sermon. Each day is a substantial daily reading — ~500–700 words per day, not a quick devotional snippet.

Before writing, do this internally (do not output it):
1. List the sermon's main points in order, with the scripture passage attached to each.
2. List every scripture reference the speaker cites or alludes to (primary passage and supporting passages).
3. Pick the three strongest, most distinct main points — one per day.

Then produce pure markdown only — no preamble, no commentary, no closing remarks. Use this exact structure:

# <Sermon-derived series title>

## Day 1 — <Distinct theme drawn from one of the sermon's main points>
**Hook:** <1–2 sentences. A question or short scenario that pulls the reader into today's theme.>

**Scripture:** <The primary passage for this day. Include the reference and the actual quote as the speaker uses it. Use the translation phrasing the speaker uses. If the passage is long, quote the verses the speaker actually focused on.>

**Cross-references:** <Other passages the speaker invokes in support of today's theme, separated by " · " (e.g. "Romans 8:28 · Philippians 4:6-7 · Psalm 23:1"). Omit this entire line if the speaker cited no supporting passages on this theme.>

**Reflection:** <4–6 paragraphs, 350–500 words total. Each paragraph 3–5 sentences. Walk the reader through the speaker's argument: what the passage means, what the speaker said about it, why it matters today. Where it sharpens a point, briefly quote the speaker in quotation marks — but only words the speaker actually said. Do not extend beyond what the sermon teaches.>

**Application:** <2–3 sentences, 50–80 words. One concrete, time-bound action for today plus a one-line "why" connecting it to the day's theme.>

**Prayer:** <60–100 words. A first-person prayer in the voice of the reader that echoes the day's theme and asks for grace to live it out.>

## Day 2 — <Distinct theme>
(same structure)

## Day 3 — <Distinct theme>
(same structure)

Universal rules:
- Strict grounding: every theological claim and every illustration must be traceable to a moment in the sermon. If you cannot point to where the speaker said it, do not write it.
- No invention: do not bring in theology, doctrine, or scripture references that are not in the source. Do not "round out" what the speaker only hinted at.
- Verbatim scripture: quote scripture exactly as the speaker quotes it — same translation, same phrasing, same word order.
- Verbatim speaker quotes: words inside quotation marks must be exact phrases the speaker actually said. If you are not certain, paraphrase without quotation marks.
- Cite generously: every day includes the primary passage. Cross-references appear whenever the speaker invokes supporting passages — list them. A devotional with no scripture references is a failure mode.
- Distinct themes: each day works a different main point of the sermon. Do not paraphrase the same idea three times.
- Tone: warm and pastoral, like a thoughtful small-group leader writing to one person. Plain language. No theological jargon, no academic register, no buddy-text register.
- Language: write the entire devotional — body text AND every structural label — in the same language as the source sermon. Never leave a structural label in English when the sermon is in another language. For French, use exactly these labels: "Jour 1", "Jour 2", "Jour 3" (for the ## headings), "Accroche", "Écriture", "Références croisées", "Réflexion", "Application", "Prière" (for the ** bold labels).`;

const YOUTUBE_PROMPT = `You are a devotional writer working from a YouTube sermon video.

The source is the YouTube video attached below. You must watch and listen to the entire video before writing — the audio and visual cues are your only ground truth.

Listening pass — extract first, then write:
- Identify the speaker, the announced sermon title (from intro or title card if visible), and the primary scripture passage.
- Capture the speaker's main points in order, key illustrations or stories they tell, and the call to action they end on.
- Note vocal emphasis, emotional weight, and pastoral tone — let those shape the warmth of the devotional.
- Quote scripture as the speaker actually quotes it, including the translation phrasing they use.
- If a phrase or refrain is repeated for emphasis, it is a signal of importance — surface it.
- Do not summarize unrelated content (announcements, music, prayer requests) that bookend the sermon. Focus only on the preached message.

${DEVOTIONAL_FORMAT}`;

const TRANSCRIPT_PROMPT = `You are a devotional writer working from a written sermon transcript.

The source is the sermon text provided below. Read it carefully and treat it as the only ground truth.

Reading pass — extract first, then write:
- Identify the primary scripture passage, the speaker's main points in order, and the call to action.
- Quote scripture exactly as it appears in the transcript, including translation phrasing.
- The transcript may contain verbal artifacts — false starts, "ums", repeated phrases, filler. Treat repetition or hesitation as one idea; do not echo verbal artifacts in the devotional.
- Where the transcript has an aside or tangent, weight the central argument over the digression.
- If the transcript is in French, write the devotional in French, including all structural labels (Jour 1, Accroche, Écriture, Réflexion, Application, Prière, etc.).

${DEVOTIONAL_FORMAT}`;

const PDF_PROMPT = `You are a devotional writer working from a sermon transcript delivered as a PDF.

The source is the attached PDF. Read every page carefully — the document may include the sermon title, scripture passages, headings, and the full body text. Treat the document as the only ground truth.

Reading pass — extract first, then write:
- Identify the primary scripture passage, the speaker's main points in order, and the call to action.
- Quote scripture exactly as it appears in the PDF, including translation phrasing.
- Respect any headings or section structure the document provides — they often signal the speaker's main points.
- Ignore obvious non-sermon scaffolding such as cover pages, bulletins, or footer boilerplate. Focus on the preached content.
- If the PDF is in French, write the devotional in French, including all structural labels (Jour 1, Accroche, Écriture, Réflexion, Application, Prière, etc.).

${DEVOTIONAL_FORMAT}`;

export async function devotionalFromTranscript(transcript: string): Promise<string> {
  return callGemini([
    { text: TRANSCRIPT_PROMPT },
    { text: `\n\n--- SOURCE SERMON TRANSCRIPT ---\n\n${transcript}` },
  ]);
}

export async function devotionalFromPdf(pdf: Buffer): Promise<string> {
  return callGemini([
    { text: PDF_PROMPT },
    { inlineData: { mimeType: "application/pdf", data: pdf.toString("base64") } },
  ]);
}

export async function devotionalFromYoutube(url: string): Promise<string> {
  // Gemini's File API expects canonical youtube.com/watch?v=<id> URLs.
  // /live/, /shorts/, /embed/, and youtu.be URLs return HTML when Gemini
  // fetches them, triggering "Unsupported MIME type: text/html". Normalize.
  const videoId = extractVideoIdFromUrl(url);
  const fileUri = videoId ? `https://www.youtube.com/watch?v=${videoId}` : url;
  return callGemini([
    { text: YOUTUBE_PROMPT },
    { fileData: { fileUri } },
  ]);
}
