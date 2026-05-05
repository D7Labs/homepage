import {
  AlignmentType,
  Document,
  HeadingLevel,
  PageBreak,
  Packer,
  Paragraph,
  ShadingType,
  TextRun,
} from "docx";
import { parseDevotionalMarkdown, type DevotionalLang, type ParsedDevotional } from "./devotional-parser";
import { parseInlineMarkdown, paragraphsFromText } from "./markdown-inline";

interface DevotionalDocxMeta {
  sourceLabel: string;
}

type Labels = {
  coverBadge: string;
  day: string;
  dayUnit: string;
  daysUnit: string;
  scripture: string;
  alsoSee: string;
  todaysAction: string;
  prayer: string;
};

const LABELS: Record<DevotionalLang, Labels> = {
  en: {
    coverBadge: "Daily Devotional",
    day: "Day",
    dayUnit: "day",
    daysUnit: "days",
    scripture: "Scripture",
    alsoSee: "Also see",
    todaysAction: "Today's action",
    prayer: "Prayer",
  },
  fr: {
    coverBadge: "Dévotionnel quotidien",
    day: "Jour",
    dayUnit: "jour",
    daysUnit: "jours",
    scripture: "Écriture",
    alsoSee: "Voir aussi",
    todaysAction: "Action du jour",
    prayer: "Prière",
  },
  other: {
    coverBadge: "Daily Devotional",
    day: "Day",
    dayUnit: "day",
    daysUnit: "days",
    scripture: "Scripture",
    alsoSee: "Also see",
    todaysAction: "Today's action",
    prayer: "Prayer",
  },
};

const EMERALD = "0EC28A";
const NEUTRAL_900 = "171717";
const NEUTRAL_500 = "737373";
const SECONDARY_50 = "F0FDF4";

export async function renderDevotionalDocx(
  markdown: string,
  meta: DevotionalDocxMeta,
): Promise<Buffer> {
  const devotional = parseDevotionalMarkdown(markdown);
  const L = LABELS[devotional.lang];
  const children: Paragraph[] = [];

  // ---- Cover ----
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 2400, after: 200 },
      children: [
        new TextRun({
          text: L.coverBadge.toUpperCase(),
          bold: true,
          color: EMERALD,
          size: 22, // half-points → 11pt
          characterSpacing: 30,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: devotional.seriesTitle,
          bold: true,
          size: 64, // 32pt
          color: NEUTRAL_900,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 200 },
      children: [
        new TextRun({
          text: `${devotional.days.length} ${devotional.days.length === 1 ? L.dayUnit : L.daysUnit}`,
          size: 28, // 14pt
          color: NEUTRAL_500,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 800, after: 0 },
      children: [
        new TextRun({
          text: `Source · ${meta.sourceLabel}`,
          size: 18, // 9pt
          color: NEUTRAL_500,
          italics: true,
        }),
      ],
    }),
  );

  // ---- Day pages ----
  for (const day of devotional.days) {
    // Page break before each day
    children.push(
      new Paragraph({
        children: [new PageBreak()],
      }),
    );

    // Day badge
    children.push(
      new Paragraph({
        spacing: { before: 0, after: 80 },
        children: [
          new TextRun({
            text: `${L.day.toUpperCase()} ${day.dayNumber}`,
            bold: true,
            color: EMERALD,
            size: 18, // 9pt
            characterSpacing: 28,
          }),
        ],
      }),
    );

    // Day title (H1)
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 0, after: 280 },
        children: [
          new TextRun({
            text: day.title,
            bold: true,
            size: 44, // 22pt
            color: NEUTRAL_900,
          }),
        ],
      }),
    );

    // Hook (italic, leading)
    if (day.hook) {
      children.push(
        new Paragraph({
          spacing: { before: 0, after: 360 },
          children: inlineRuns(day.hook, { italics: true, size: 26, color: NEUTRAL_500 }),
        }),
      );
    }

    // Scripture block (shaded)
    if (day.scripture) {
      children.push(
        new Paragraph({
          spacing: { before: 0, after: 80 },
          shading: { type: ShadingType.CLEAR, color: "auto", fill: SECONDARY_50 },
          border: { left: { color: EMERALD, size: 18, style: "single", space: 12 } },
          children: [
            new TextRun({
              text: L.scripture.toUpperCase(),
              bold: true,
              color: EMERALD,
              size: 18, // 9pt
              characterSpacing: 24,
            }),
          ],
        }),
        new Paragraph({
          spacing: { before: 0, after: 280 },
          shading: { type: ShadingType.CLEAR, color: "auto", fill: SECONDARY_50 },
          border: { left: { color: EMERALD, size: 18, style: "single", space: 12 } },
          children: inlineRuns(day.scripture, { italics: true, size: 24, color: NEUTRAL_500 }),
        }),
      );
    }

    // Cross-references
    if (day.crossReferences.length > 0) {
      children.push(
        new Paragraph({
          spacing: { before: 0, after: 360 },
          children: [
            new TextRun({
              text: `${L.alsoSee.toUpperCase()}:  `,
              bold: true,
              color: NEUTRAL_500,
              size: 16, // 8pt
              characterSpacing: 24,
            }),
            new TextRun({
              text: day.crossReferences.join(" · "),
              color: EMERALD,
              size: 18, // 9pt
            }),
          ],
        }),
      );
    }

    // Reflection paragraphs
    if (day.reflection) {
      for (const p of paragraphsFromText(day.reflection)) {
        children.push(
          new Paragraph({
            spacing: { before: 0, after: 240, line: 360 },
            children: inlineRuns(p, { size: 22, color: NEUTRAL_900 }),
          }),
        );
      }
    }

    // Today's action
    if (day.application) {
      children.push(
        new Paragraph({
          spacing: { before: 280, after: 120 },
          children: [
            new TextRun({
              text: L.todaysAction.toUpperCase(),
              bold: true,
              color: NEUTRAL_500,
              size: 18, // 9pt
              characterSpacing: 24,
            }),
          ],
        }),
        new Paragraph({
          spacing: { before: 0, after: 280, line: 360 },
          border: { left: { color: EMERALD, size: 18, style: "single", space: 12 } },
          children: inlineRuns(day.application, { size: 22, color: NEUTRAL_900 }),
        }),
      );
    }

    // Prayer
    if (day.prayer) {
      children.push(
        new Paragraph({
          spacing: { before: 280, after: 120 },
          children: [
            new TextRun({
              text: L.prayer.toUpperCase(),
              bold: true,
              color: NEUTRAL_500,
              size: 18, // 9pt
              characterSpacing: 24,
            }),
          ],
        }),
        new Paragraph({
          spacing: { before: 0, after: 0, line: 320 },
          shading: { type: ShadingType.CLEAR, color: "auto", fill: "F5F5F5" },
          children: inlineRuns(day.prayer, { italics: true, size: 22, color: NEUTRAL_500 }),
        }),
      );
    }
  }

  const doc = new Document({
    creator: "D7 Labs",
    title: devotional.seriesTitle,
    description: `Devotional generated from sermon: ${meta.sourceLabel}`,
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 22 } },
      },
    },
    sections: [{ properties: {}, children }],
  });

  return Packer.toBuffer(doc) as Promise<Buffer>;
}

interface RunStyle {
  size?: number;
  color?: string;
  italics?: boolean;
  bold?: boolean;
}

// Convert inline-markdown segments to docx TextRuns, merging the segment's
// bold/italic flags with the caller's base style.
function inlineRuns(text: string, base: RunStyle): TextRun[] {
  return parseInlineMarkdown(text).map(
    (seg) =>
      new TextRun({
        text: seg.text,
        size: base.size,
        color: base.color,
        bold: base.bold || seg.bold,
        italics: base.italics || seg.italic,
      }),
  );
}

export function _devotionalForTesting(markdown: string): ParsedDevotional {
  return parseDevotionalMarkdown(markdown);
}
