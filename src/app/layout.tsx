import type { Metadata } from "next";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
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

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://d7labs.dev").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "D7 Labs — Independent product studio",
  description:
    "D7 Labs is an independent studio that designs, builds, and ships its own AI-powered software products.",
  keywords: [
    "D7 Labs",
    "product studio",
    "AI products",
    "software studio",
    "app development",
    "Davenson Lombard",
    "Chant d'Espérance",
    "Ezra Studio",
  ],
  openGraph: {
    title: "D7 Labs — Independent product studio",
    description:
      "An independent studio that designs, builds, and ships its own AI-powered software products.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plusJakarta.variable}`}>
      <body>
        {children}
        <Script
          src="https://tally.so/widgets/embed.js"
          strategy="lazyOnload"
        />
      </body>
      <GoogleAnalytics gaId="G-FPZ2FD25WV" />
    </html>
  );
}
