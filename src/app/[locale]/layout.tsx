import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import { routing } from "@/i18n/routing";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const m = messages.metadata;

  return {
    title: m.title,
    description: m.description,
    keywords: [
      "D7 Labs",
      "church technology",
      "AI for churches",
      "faith tech",
      "Davenson Lombard",
      "Chant d'Espérance",
      "church software",
    ],
    openGraph: {
      title: m.title,
      description: m.ogDescription,
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${spaceGrotesk.variable} ${plusJakarta.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Script
          src="https://tally.so/widgets/embed.js"
          strategy="lazyOnload"
        />
      </body>
      <GoogleAnalytics gaId="G-FPZ2FD25WV" />
    </html>
  );
}
