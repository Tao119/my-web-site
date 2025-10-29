import "@/styles/style.scss";
import "@/styles/globals.css";
import { portfolioConfig } from "@/lib/portfolio-config";

export const metadata = {
  title: portfolioConfig.site.title,
  description: portfolioConfig.site.description,
  authors: [{ name: portfolioConfig.site.author }],
  keywords: ["ポートフォリオ", "Web開発", "フルスタック", "Unity", "AI", "ML"],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/destyle.css@1.0.15/destyle.css"
        />
        {/* Google Fonts for Neobrutalism Typography */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Favicon and meta tags */}
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1e3a8a" />
      </head>
      <body className="font-sans antialiased bg-white text-black">
        {children}
      </body>
    </html>
  );
}
