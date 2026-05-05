import { renderToBuffer } from "@react-pdf/renderer";
import { DevotionalPDF } from "@/components/pdf/DevotionalPDF";
import { parseDevotionalMarkdown } from "./devotional-parser";

interface DevotionalPdfMeta {
  sourceLabel: string;
}

export async function renderDevotionalPdf(
  markdown: string,
  meta: DevotionalPdfMeta,
): Promise<Buffer> {
  const devotional = parseDevotionalMarkdown(markdown);
  return renderToBuffer(
    <DevotionalPDF devotional={devotional} sourceLabel={meta.sourceLabel} />,
  );
}

export async function renderDevotionalPreviewPdf(
  markdown: string,
  meta: DevotionalPdfMeta,
): Promise<Buffer> {
  const devotional = parseDevotionalMarkdown(markdown);
  return renderToBuffer(
    <DevotionalPDF devotional={devotional} sourceLabel={meta.sourceLabel} watermarked />,
  );
}
