import type { Metadata, Viewport } from "next";
import "@fontsource/lexend/400.css";
import "@fontsource/lexend/500.css";
import "@fontsource/lexend/600.css";
import "@fontsource/lexend/700.css";
import "@fontsource/lexend/800.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "LINK — The Missing Link: how Chainlink carries truth into blockchains",
  description:
    "A plain-language, scroll-driven explainer of Chainlink and LINK: blind blockchains, no chain of its own, many nodes and one signature, push vs pull, reserves and dice, the two-guard bridge, the staking alarm, the two flows of LINK, history, banks, today, strengths and weaknesses.",
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
