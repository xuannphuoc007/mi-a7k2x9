import type { Metadata, Viewport } from "next";
import "@fontsource-variable/space-grotesk/index.css";
import "@fontsource/be-vietnam-pro/300.css";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource-variable/jetbrains-mono/index.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Journey of a Digital Dollar — USDC",
  description: "Follow the money. A cinematic, scroll-driven documentary about what happens behind every USDC: the reserve vault, the cross-chain portal, and the risks.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#070F20" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
