const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"]);

export function isValidYoutubeUrl(value: string): boolean {
  try {
    const u = new URL(value.trim());
    if (!YOUTUBE_HOSTS.has(u.hostname)) return false;
    return Boolean(extractVideoId(u));
  } catch {
    return false;
  }
}

export function extractVideoIdFromUrl(value: string): string | null {
  try {
    return extractVideoId(new URL(value.trim()));
  } catch {
    return null;
  }
}

function extractVideoId(u: URL): string | null {
  if (u.hostname === "youtu.be") {
    const id = u.pathname.replace(/^\//, "");
    return /^[A-Za-z0-9_-]{6,}$/.test(id) ? id : null;
  }
  const v = u.searchParams.get("v");
  if (v && /^[A-Za-z0-9_-]{6,}$/.test(v)) return v;
  // Path-based formats: /shorts/<id>, /live/<id>, /embed/<id>
  const path = u.pathname.match(/^\/(?:shorts|live|embed)\/([A-Za-z0-9_-]{6,})/);
  if (path) return path[1];
  return null;
}
