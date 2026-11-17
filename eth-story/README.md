# Ethereum, explained

A scroll-driven, beginner-first story of Ethereum told through one $500 logo job between Lan (Da Nang) and Anna (Berlin). Twelve chapters in six acts, bilingual (English / Tiếng Việt), light theme in Ethereum's own colours. Every simulation plays itself as you scroll — no controls to operate.

**Live:** https://xuannphuoc007.github.io/mi-a7k2x9/eth/

> Educational only. Not affiliated with the Ethereum Foundation. Not financial advice. Lan and Anna are fictional; simulations use simplified, rounded numbers and are labelled as such.

## Story (Problem → Origin → Journey → Simulation → Economics → Reality check)
1. Who goes first? — trust between strangers, platform fees, four ways to settle shown one by one
2. A computer nobody owns — calculator vs computer, vending machine, 2014 sale, 2015 launch (3D ETH coin)
3. Eleven years in fast-forward — ETH price 2015–2026 with bursts on hacks, peaks and upgrades
4. The contract in action — escrow contract plays three endings
5. One notebook, thousands of copies — replicated ledger, 12-second blocks, why gas exists
6. Gas: the ticket price — a rush hour of full blocks, base fee & burn
7. Staking — one year, three validators (honest / offline / slashed)
8. DeFi — a collateralised loan liquidated as ETH falls (Aave-like, rounded)
9. Follow the money — issuance vs burn, real supply since The Merge, four ideas people mix up, a busy year vs a quiet year
10. Layer 2 — bundles, blobs and trade-offs
11. Bitcoin vs Ethereum — side-by-side visual and comparison table
12. Reality check — strengths vs risks, last 12 months of price
13. Back to Lan — the 3D ETH coin assembles; drag to rotate

## Stack
Next.js 15 (static export) · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · React Three Fiber · SVG · Framer Motion.

## Data
Coin Metrics community data (price, fees, supply) to 23 May 2026, then dated press reports. Sources are listed in the site footer (`src/data/coins/eth/references.ts`). Simplified models live in `src/lib/models.ts`.

## Build
```
npm install
NEXT_PUBLIC_BASE_PATH=/mi-a7k2x9/eth npx next build   # static site in out/
```
