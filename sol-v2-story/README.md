# SOL — The Ship of Light (Con tàu ánh sáng)

A scroll-driven, bilingual (EN/VI) explainer of how Solana moves fast and what that costs. Part of the mi-a7k2x9 series, alongside the original `/sol/` edition (kept unchanged).

**Live:** https://xuannphuoc007.github.io/mi-a7k2x9/sol-v2/

Every transaction is a beam of light, and the 2D stage plays each scene by itself as you scroll. Text cards sit on the left and the flight path runs along the bottom. The theme is light, and Nhi is a fictional seller who gets paid 20 USDC.

## Chapters
1. One beam of light — 20 USDC, under a second, 0.000005 SOL fee; Bitcoin / Ethereum / Solana block times
2. The rota — leaders, stake-weighted schedule per epoch (432,000 blocks ≈ 24 h), 4 blocks each
3. No waiting room — mempool vs Gulf Stream; 150-block (≈ 30 s) expiry
4. The counter — Proof of History; Alpenglow (21 Oct 2026) moves voting off it
5. Blocks in pieces — shreds, spare pieces, Turbine; the Feb 2023 oversized block
6. Many lanes — Sealevel parallel execution; same-account transactions queue
7. Fees — half of the base fee burned; priority fees 100% to the leader (Feb 2025); 12M of 100M CU per hot account
8. When it stopped — 2021–2024 halts; 1,000 days without one
9. An expensive engine — hardware, validator count 2,560 → 795 → 654, software concentration
10. Faster in 2026 — 100M CU blocks, 200 ms slots, Alpenglow finality
11. The SOL token — staking, 3.60% issuance, double disinflation vote, price vs top
12. Verdict — strengths, weaknesses, what it means

## Build
```bash
npm install
NEXT_PUBLIC_BASE_PATH=/mi-a7k2x9/sol-v2 npx next build   # static export in out/
```
Stack: Next.js (static export), Tailwind v4, GSAP ScrollTrigger, framer-motion, SVG scenes.

Sources with dates are listed in `src/data/coins/sol/references.ts`. The Solana logo and coin face were supplied by the site owner (trademarks of their owner). Educational only, not investment advice.
