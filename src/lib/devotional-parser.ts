// "other" = detected language not yet fully supported; parser still extracts
// what it can, PDF labels fall back to English.
export type DevotionalLang = "en" | "fr" | "other";

export interface DevotionalDay {
  dayNumber: number;
  title: string;
  hook: string;
  scripture: string;
  crossReferences: string[];
  reflection: string;
  application: string;
  prayer: string;
}

export interface ParsedDevotional {
  seriesTitle: string;
  lang: DevotionalLang;
  days: DevotionalDay[];
}

const TITLE_RE = /^#\s+(.+)$/m;
// Matches "## <any word> N — <title>": handles Day (EN), Jour (FR), and any
// other language's equivalent without breaking the parse entirely.
const DAY_HEADER_RE = /^##\s+\S+\s+(\d+)\s*[—\-:]\s*(.+)$/im;

// Canonical section key → all accepted label spellings (lowercased, accents included)
const SECTION_ALIASES: Record<string, string[]> = {
  hook:              ["hook", "accroche", "introduction", "intro"],
  scripture:         ["scripture", "écriture", "ecriture", "passage", "verset", "versets"],
  "cross-references": [
    "cross-references", "crossreferences", "cross references",
    "références croisées", "references croisees", "références", "references",
    "also see", "à lire aussi", "a lire aussi",
  ],
  reflection:  ["reflection", "réflexion", "reflexion"],
  application: ["application", "apply", "mise en pratique"],
  prayer:      ["prayer", "prière", "priere"],
};

// Flat reverse-lookup: alias → canonical key
const ALIAS_TO_CANONICAL = new Map<string, string>();
for (const [canonical, aliases] of Object.entries(SECTION_ALIASES)) {
  for (const alias of aliases) {
    ALIAS_TO_CANONICAL.set(alias, canonical);
  }
}

function detectLang(text: string): DevotionalLang {
  if (/^##\s+Jour\s+\d+/im.test(text)) return "fr";
  if (/^##\s+Day\s+\d+/im.test(text)) return "en";
  return "other";
}

export function parseDevotionalMarkdown(markdown: string): ParsedDevotional {
  const text = markdown.replace(/\r\n/g, "\n").trim();
  const titleMatch = TITLE_RE.exec(text);
  const seriesTitle = titleMatch?.[1].trim() ?? "Devotional";
  const lang = detectLang(text);

  const blocks = splitDayBlocks(text);
  const days = blocks.map(parseDayBlock).filter((d): d is DevotionalDay => d !== null);
  return { seriesTitle, lang, days };
}

function splitDayBlocks(text: string): string[] {
  const lines = text.split("\n");
  const blocks: string[] = [];
  let current: string[] = [];
  let inDay = false;
  for (const line of lines) {
    if (DAY_HEADER_RE.test(line)) {
      if (inDay && current.length > 0) blocks.push(current.join("\n"));
      current = [line];
      inDay = true;
      continue;
    }
    if (inDay) current.push(line);
  }
  if (inDay && current.length > 0) blocks.push(current.join("\n"));
  return blocks;
}

function parseDayBlock(block: string): DevotionalDay | null {
  const headerMatch = DAY_HEADER_RE.exec(block);
  if (!headerMatch) return null;
  const dayNumber = Number(headerMatch[1]);
  const title = headerMatch[2].trim();
  const body = block.slice(block.indexOf("\n") + 1);
  const sections = extractLabeledSections(body);
  return {
    dayNumber,
    title,
    hook:            lookupSection(sections, "hook"),
    scripture:       lookupSection(sections, "scripture"),
    crossReferences: parseCrossReferences(lookupSection(sections, "cross-references")),
    reflection:      lookupSection(sections, "reflection"),
    application:     lookupSection(sections, "application"),
    prayer:          lookupSection(sections, "prayer"),
  };
}

function lookupSection(sections: Map<string, string>, canonical: string): string {
  // Direct hit on canonical key
  const direct = sections.get(canonical);
  if (direct !== undefined) return direct;
  // Walk all stored keys through the alias map
  for (const [rawKey, value] of sections) {
    if (ALIAS_TO_CANONICAL.get(rawKey) === canonical) return value;
  }
  return "";
}

const LABEL_RE = /^\*\*\s*([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ -]*)\s*:?\s*\*\*\s*:?\s*(.*)$/;

function extractLabeledSections(body: string): Map<string, string> {
  const lines = body.split("\n");
  const out = new Map<string, string>();
  let currentLabel: string | null = null;
  let currentBuf: string[] = [];
  const flush = () => {
    if (currentLabel) {
      const value = currentBuf.join("\n").trim();
      if (value) out.set(currentLabel, value);
    }
    currentBuf = [];
  };
  for (const raw of lines) {
    const m = LABEL_RE.exec(raw.trim());
    if (m) {
      flush();
      currentLabel = m[1].toLowerCase().trim();
      const tail = m[2].trim();
      if (tail) currentBuf.push(tail);
      continue;
    }
    if (currentLabel) currentBuf.push(raw);
  }
  flush();
  return out;
}

function parseCrossReferences(value: string): string[] {
  const cleaned = value.trim();
  if (!cleaned) return [];
  return cleaned
    .split(/\s*[·;|]\s*|\s*,\s*(?=[A-Z0-9])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !/^(none|n\/a|aucune?)$/i.test(s));
}
