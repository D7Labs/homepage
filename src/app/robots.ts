import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://d7labs.dev";

// Explicit AI bot allowlist. The default User-Agent: * rule already permits
// all bots, but listing them explicitly signals intent and survives any
// future tightening of "*" rules. See:
// - https://platform.openai.com/docs/bots
// - https://docs.perplexity.ai/guides/bots
// - https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          "*",
          "GPTBot",          // OpenAI / ChatGPT
          "ChatGPT-User",    // ChatGPT browse / search
          "OAI-SearchBot",   // OpenAI SearchGPT
          "PerplexityBot",   // Perplexity
          "ClaudeBot",       // Anthropic
          "anthropic-ai",
          "Google-Extended", // Gemini + AI Overviews training
          "Bingbot",         // Microsoft Copilot
          "Applebot-Extended",
        ],
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL.replace(/\/$/, "")}/sitemap.xml`,
  };
}
