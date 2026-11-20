import type { Metadata, Viewport } from "next";
import "@fontsource/lexend/400.css";
import "@fontsource/lexend/500.css";
import "@fontsource/lexend/600.css";
import "@fontsource/lexend/700.css";
import "@fontsource/lexend/800.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "LINK — a metro ride through Chainlink, the network that carries data onto blockchains",
  description:
    "A plain-language, scroll-driven metro journey through Chainlink and its LINK token: oracles, price feeds, the token, cross-chain bridges, banks, history, the LUNA incident, LINK in 2026, strengths and weaknesses — with dates and sources.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#eaf2f7",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
