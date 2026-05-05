import React from "react";
import { Document, Font, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { DevotionalLang, ParsedDevotional } from "@/lib/devotional-parser";
import { parseInlineMarkdown, paragraphsFromText } from "@/lib/markdown-inline";

// Register Space Grotesk Bold for the watermark. @react-pdf fetches once and caches.
// URL is from Google Fonts' static CDN; safe for server-side render.
Font.register({
  family: "Space Grotesk",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/spacegrotesk/v22/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj4PVksj.ttf",
      fontWeight: 700,
    },
  ],
});

type Labels = {
  coverBadge: string;
  day: string;
  dayUnit: string;    // singular "day" / "jour"
  daysUnit: string;   // plural  "days" / "jours"
  scripture: string;
  alsoSee: string;
  todaysAction: string;
  prayer: string;
};

const LABELS: Record<DevotionalLang, Labels> = {
  en: {
    coverBadge:   "Daily Devotional",
    day:          "Day",
    dayUnit:      "day",
    daysUnit:     "days",
    scripture:    "Scripture",
    alsoSee:      "Also see",
    todaysAction: "Today's action",
    prayer:       "Prayer",
  },
  fr: {
    coverBadge:   "Dévotionnel quotidien",
    day:          "Jour",
    dayUnit:      "jour",
    daysUnit:     "jours",
    scripture:    "Écriture",
    alsoSee:      "Voir aussi",
    todaysAction: "Action du jour",
    prayer:       "Prière",
  },
  // Fallback for unsupported languages: English structural labels, source-language content
  other: {
    coverBadge:   "Daily Devotional",
    day:          "Day",
    dayUnit:      "day",
    daysUnit:     "days",
    scripture:    "Scripture",
    alsoSee:      "Also see",
    todaysAction: "Today's action",
    prayer:       "Prayer",
  },
};

const FONT_HEADING = "Helvetica";
const FONT_HEADING_BOLD = "Helvetica-Bold";
const FONT_BODY = "Times-Roman";
const FONT_BODY_BOLD = "Times-Bold";
const FONT_BODY_ITALIC = "Times-Italic";
const FONT_BODY_BOLD_ITALIC = "Times-BoldItalic";

const colors = {
  emerald: "#0EC28A",
  emeraldDark: "#0A9A6E",
  neutral900: "#171717",
  neutral700: "#404040",
  neutral500: "#737373",
  neutral200: "#E5E5E5",
  neutral100: "#F5F5F5",
  secondary50: "#F0FDF4",
  white: "#FFFFFF",
};

const s = StyleSheet.create({
  coverPage: {
    backgroundColor: colors.emeraldDark,
    padding: 60,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  coverBadge: {
    fontFamily: FONT_HEADING_BOLD,
    fontSize: 11,
    color: "#FFFFFFCC",
    textTransform: "uppercase",
    marginBottom: 16,
    letterSpacing: 1.5,
  },
  coverTitle: {
    fontFamily: FONT_HEADING_BOLD,
    fontSize: 32,
    color: colors.white,
    textAlign: "center",
    marginBottom: 12,
  },
  coverSubtitle: {
    fontFamily: FONT_BODY,
    fontSize: 16,
    color: "#FFFFFFD9",
    textAlign: "center",
  },
  coverAccent: {
    width: 48,
    height: 3,
    backgroundColor: "#FFFFFF80",
    marginTop: 28,
  },
  coverFooter: {
    position: "absolute",
    bottom: 36,
    left: 60,
    right: 60,
    textAlign: "center",
    fontFamily: FONT_HEADING,
    fontSize: 9,
    color: "#FFFFFFAA",
    letterSpacing: 1.2,
  },

  dayPage: {
    padding: 48,
    paddingTop: 56,
    fontFamily: FONT_BODY,
    fontSize: 11,
    color: colors.neutral900,
  },
  dayBadge: {
    fontFamily: FONT_HEADING_BOLD,
    fontSize: 9,
    color: colors.emerald,
    textTransform: "uppercase",
    marginBottom: 6,
    letterSpacing: 1.4,
  },
  dayTitle: {
    fontFamily: FONT_HEADING_BOLD,
    fontSize: 22,
    color: colors.neutral900,
    marginBottom: 16,
  },

  hookText: {
    fontFamily: FONT_BODY_ITALIC,
    fontSize: 13,
    color: colors.neutral700,
    lineHeight: 1.5,
    marginBottom: 22,
  },

  scriptureBlock: {
    backgroundColor: colors.secondary50,
    borderLeftWidth: 3,
    borderLeftColor: colors.emerald,
    padding: 14,
    paddingLeft: 16,
    marginBottom: 14,
  },
  scriptureLabel: {
    fontFamily: FONT_HEADING_BOLD,
    fontSize: 9,
    color: colors.emerald,
    textTransform: "uppercase",
    marginBottom: 6,
    letterSpacing: 1.2,
  },
  scriptureText: {
    fontFamily: FONT_BODY_ITALIC,
    fontSize: 12,
    color: colors.neutral700,
    lineHeight: 1.5,
  },
  crossRefsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 22,
  },
  crossRefsLabel: {
    fontFamily: FONT_HEADING_BOLD,
    fontSize: 8,
    color: colors.neutral500,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginRight: 8,
    paddingTop: 3,
  },
  crossRefChip: {
    fontFamily: FONT_HEADING,
    fontSize: 9,
    color: colors.emerald,
    backgroundColor: colors.secondary50,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginRight: 6,
    marginBottom: 4,
    borderRadius: 2,
  },

  sectionLabel: {
    fontFamily: FONT_HEADING_BOLD,
    fontSize: 9,
    color: colors.neutral500,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 4,
    letterSpacing: 1.2,
  },
  bodyText: {
    fontFamily: FONT_BODY,
    fontSize: 11,
    color: colors.neutral900,
    lineHeight: 1.6,
    marginBottom: 22,
  },

  actionBlock: {
    borderLeftWidth: 3,
    borderLeftColor: colors.emerald,
    paddingLeft: 14,
    marginBottom: 22,
  },
  actionText: {
    fontFamily: FONT_BODY,
    fontSize: 11,
    color: colors.neutral900,
    lineHeight: 1.6,
  },

  prayerBlock: {
    backgroundColor: colors.neutral100,
    padding: 16,
    marginBottom: 8,
  },
  prayerText: {
    fontFamily: FONT_BODY_ITALIC,
    fontSize: 11,
    color: colors.neutral500,
    lineHeight: 1.5,
  },

  footer: {
    position: "absolute",
    bottom: 28,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontFamily: FONT_HEADING,
    fontSize: 8,
    color: colors.neutral500,
  },
});

interface Props {
  devotional: ParsedDevotional;
  sourceLabel: string;
  watermarked?: boolean;
}

const watermarkStyles = StyleSheet.create({
  layer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  text: {
    position: "absolute",
    fontFamily: "Space Grotesk",
    fontWeight: 700,
    fontSize: 38,
    color: "#171717",
    opacity: 0.13,
    letterSpacing: 4,
    transform: "rotate(-35deg)",
  },
});

// Diagonal "D7 Labs" repeating watermark, rendered fixed on every page.
// Letter page is 612×792pt; a 4-col × 5-row grid covers it adequately at -35°.
function Watermark() {
  const positions = [
    { top: 60, left: 30 },   { top: 60, left: 200 },  { top: 60, left: 370 },  { top: 60, left: 540 },
    { top: 200, left: 30 },  { top: 200, left: 200 }, { top: 200, left: 370 }, { top: 200, left: 540 },
    { top: 340, left: 30 },  { top: 340, left: 200 }, { top: 340, left: 370 }, { top: 340, left: 540 },
    { top: 480, left: 30 },  { top: 480, left: 200 }, { top: 480, left: 370 }, { top: 480, left: 540 },
    { top: 620, left: 30 },  { top: 620, left: 200 }, { top: 620, left: 370 }, { top: 620, left: 540 },
  ];
  return (
    <View fixed style={watermarkStyles.layer}>
      {positions.map((pos, i) => (
        <Text key={i} style={[watermarkStyles.text, pos]}>
          D7 Labs
        </Text>
      ))}
    </View>
  );
}

const paragraphs = paragraphsFromText;

interface RichTextProps {
  value: string;
  baseStyle: Style;
  italicFont?: string;
  boldFont?: string;
  boldItalicFont?: string;
  baseFont?: string;
}

function RichText({
  value,
  baseStyle,
  italicFont = FONT_BODY_ITALIC,
  boldFont = FONT_BODY_BOLD,
  boldItalicFont = FONT_BODY_BOLD_ITALIC,
  baseFont = FONT_BODY,
}: RichTextProps) {
  const segments = parseInlineMarkdown(value);
  return (
    <Text style={baseStyle}>
      {segments.map((seg, i) => {
        const fontFamily = seg.bold && seg.italic
          ? boldItalicFont
          : seg.bold
            ? boldFont
            : seg.italic
              ? italicFont
              : baseFont;
        return (
          <Text key={i} style={{ fontFamily }}>
            {seg.text}
          </Text>
        );
      })}
    </Text>
  );
}

export function DevotionalPDF({ devotional, sourceLabel, watermarked = false }: Props) {
  const dayCount = devotional.days.length;
  const L = LABELS[devotional.lang];
  return (
    <Document>
      <Page size="LETTER" style={s.coverPage}>
        <Text style={s.coverBadge}>{L.coverBadge}</Text>
        <Text style={s.coverTitle}>{devotional.seriesTitle}</Text>
        <Text style={s.coverSubtitle}>
          {dayCount} {dayCount === 1 ? L.dayUnit : L.daysUnit}
        </Text>
        <View style={s.coverAccent} />
        <Text style={s.coverFooter}>Source · {sourceLabel}</Text>
        {watermarked ? <Watermark /> : null}
      </Page>

      {devotional.days.map((day) => (
        <Page key={day.dayNumber} size="LETTER" style={s.dayPage} wrap>
          <Text style={s.dayBadge}>{L.day} {day.dayNumber}</Text>
          <Text style={s.dayTitle}>{day.title}</Text>

          {day.hook ? (
            <RichText value={day.hook} baseStyle={s.hookText} baseFont={FONT_BODY_ITALIC} italicFont={FONT_BODY} />
          ) : null}

          {day.scripture ? (
            <View style={s.scriptureBlock} wrap={false}>
              <Text style={s.scriptureLabel}>{L.scripture}</Text>
              <RichText value={day.scripture} baseStyle={s.scriptureText} baseFont={FONT_BODY_ITALIC} italicFont={FONT_BODY} />
            </View>
          ) : null}

          {day.crossReferences.length > 0 ? (
            <View style={s.crossRefsRow} wrap={false}>
              <Text style={s.crossRefsLabel}>{L.alsoSee}</Text>
              {day.crossReferences.map((ref, i) => (
                <Text key={i} style={s.crossRefChip}>
                  {ref}
                </Text>
              ))}
            </View>
          ) : null}

          {day.reflection
            ? paragraphs(day.reflection).map((p, i) => (
                <RichText key={i} value={p} baseStyle={s.bodyText} />
              ))
            : null}

          {day.application ? (
            <>
              <Text style={s.sectionLabel}>{L.todaysAction}</Text>
              <View style={s.actionBlock} wrap={false}>
                <RichText value={day.application} baseStyle={s.actionText} />
              </View>
            </>
          ) : null}

          {day.prayer ? (
            <>
              <Text style={s.sectionLabel}>{L.prayer}</Text>
              <View style={s.prayerBlock} wrap={false}>
                <RichText value={day.prayer} baseStyle={s.prayerText} baseFont={FONT_BODY_ITALIC} italicFont={FONT_BODY} />
              </View>
            </>
          ) : null}

          <View style={s.footer} fixed>
            <Text style={s.footerText}>{devotional.seriesTitle}</Text>
            <Text style={s.footerText}>{L.day} {day.dayNumber}</Text>
          </View>
          {watermarked ? <Watermark /> : null}
        </Page>
      ))}
    </Document>
  );
}
