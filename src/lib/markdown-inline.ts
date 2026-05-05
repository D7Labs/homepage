export interface InlineSegment {
  text: string;
  bold: boolean;
  italic: boolean;
}

export function parseInlineMarkdown(input: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  let i = 0;
  let bold = false;
  let italic = false;
  let buffer = "";
  const flush = () => {
    if (buffer) {
      segments.push({ text: buffer, bold, italic });
      buffer = "";
    }
  };
  while (i < input.length) {
    if (input.startsWith("***", i)) {
      flush();
      bold = !bold;
      italic = !italic;
      i += 3;
      continue;
    }
    if (input.startsWith("**", i)) {
      flush();
      bold = !bold;
      i += 2;
      continue;
    }
    const ch = input[i];
    if (ch === "*" || (ch === "_" && isWordBoundary(input, i))) {
      flush();
      italic = !italic;
      i += 1;
      continue;
    }
    if (ch === "\\" && i + 1 < input.length) {
      buffer += input[i + 1];
      i += 2;
      continue;
    }
    buffer += ch;
    i += 1;
  }
  flush();
  return segments.length > 0 ? segments : [{ text: input, bold: false, italic: false }];
}

export function paragraphsFromText(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n+/g, " ").trim())
    .filter((p) => p.length > 0);
}

function isWordBoundary(input: string, i: number): boolean {
  const prev = input[i - 1] ?? " ";
  const next = input[i + 1] ?? " ";
  const isWord = (c: string) => /[A-Za-z0-9]/.test(c);
  return !(isWord(prev) && isWord(next));
}
