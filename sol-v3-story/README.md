# SOL — The Ship of Light, beginner edition (Con tàu ánh sáng — bản dễ hiểu)

A scroll-driven, bilingual (EN/VI) explainer of how Solana moves fast and what that costs. Part of the mi-a7k2x9 series, alongside the original `/sol/` and the more technical `/sol-v2/` (both kept unchanged). Written for people new to crypto: short sentences, few technical words.

**Live:** https://xuannphuoc007.github.io/mi-a7k2x9/sol-v3/

Every transaction is a beam of light, and the 2D stage plays each scene by itself as you scroll. Text cards sit on the left and the flight path runs along the bottom. The theme is light, and Nhi is a fictional seller who gets paid 20 USDC.

## Chapters
1. What is Solana? — a shared record book kept by ≈ 650 computers; nobody can change it alone; the SOL coin
2. Nhi gets paid — 20 USDC in under a second for ≈ $0.0004; Bitcoin / Ethereum / Solana page times
3. Taking turns — one computer writes at a time, the rota is set a day ahead, payments go straight to the writer
4. At the same time — unrelated payments run together; same coin waits
5. Fees — tiny base fee, priority fee, a busy coin can use only ≈ 12% of a page
6. When it stopped — 2021–2024 halts, 1,000 days without one
7. Expensive machines — 384–512 GB RAM, 2,560 → ≈ 650 computers, 18 operators could stop it
8. The SOL coin — fees, staking (68%), ≈ 3.6% new SOL a year, price vs top
9. In short — strengths, weaknesses, what it means

## Build
```bash
npm install
NEXT_PUBLIC_BASE_PATH=/mi-a7k2x9/sol-v3 npx next build   # static export in out/
```
Stack: Next.js (static export), Tailwind v4, GSAP ScrollTrigger, framer-motion, SVG scenes.

Sources with dates are listed in `src/data/coins/sol/references.ts`. The Solana logo and coin face were supplied by the site owner (trademarks of their owner). Educational only, not investment advice.
