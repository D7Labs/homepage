import type { Metadata } from "next";
import Script from "next/script";
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

export const metadata: Metadata = {
  title: "D7 Labs — Technology for the Kingdom",
  description:
    "D7 Labs builds AI-powered tools that help churches extend their impact, deepen discipleship, and reach their communities.",
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
    title: "D7 Labs — Technology for the Kingdom",
    description:
      "AI-powered tools that serve churches and faith communities worldwide.",
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
    </html>
  );
}
