export type GuideMode = "transcription" | "devotional";

export type SourceKind = "audio" | "video" | "pdf" | "youtube";

export interface GuideJob {
  id: string;
  mode: GuideMode;
  sourceLabel: string;
  sourceKind: SourceKind;
  createdAt: number;
  preview: string;
  fullMarkdown: string;
  paid: boolean;
  downloadToken?: string;
  priceCents: number;
  currency: "USD";
}

export const PRICE_CENTS: Record<GuideMode, number> = {
  transcription: 499,
  devotional: 299,
};

export const ACCEPTED_MIME = {
  audio: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/m4a", "audio/x-m4a", "audio/webm", "audio/ogg"],
  video: ["video/mp4", "video/quicktime", "video/webm", "video/x-matroska"],
  pdf: ["application/pdf"],
} as const;

export const ALLOWED_SOURCES: Record<GuideMode, SourceKind[]> = {
  transcription: ["audio", "video"],
  devotional: ["youtube", "pdf"],
};

export function classifyFile(mime: string, name: string): "audio" | "video" | "pdf" | "unknown" {
  const lower = name.toLowerCase();
  if (ACCEPTED_MIME.pdf.includes(mime as never) || lower.endsWith(".pdf")) return "pdf";
  if (ACCEPTED_MIME.video.includes(mime as never) || /\.(mp4|mov|webm|mkv)$/.test(lower)) return "video";
  if (ACCEPTED_MIME.audio.includes(mime as never) || /\.(mp3|wav|m4a|ogg|webm)$/.test(lower)) return "audio";
  return "unknown";
}

export function fileAcceptForMode(mode: GuideMode): string {
  if (mode === "transcription") {
    return "audio/*,video/*,.mp3,.wav,.m4a,.mp4,.mov,.webm";
  }
  return "application/pdf,.pdf";
}

export function fileHelperForMode(mode: GuideMode): string {
  if (mode === "transcription") {
    return "Audio (mp3, wav, m4a) or video (mp4, mov, webm)";
  }
  return "PDF transcript";
}
