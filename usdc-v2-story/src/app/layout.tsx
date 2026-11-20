import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "USDC — the digital dollar with its papers in order, and the vault behind it",
  description: "A beginner-friendly, scroll-driven story of Circle's USDC: how a digital dollar is minted and burned, what sits in the vault, who keeps the interest, the 2023 bank weekend, the comeback and the new rules — with clear strengths, weaknesses, dates and sources.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f5ef",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="paper-grain">{children}</body>
    </html>
  );
}
