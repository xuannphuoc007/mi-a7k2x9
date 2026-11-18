# Solana, explained

A scroll-driven, beginner-first story of Solana and SOL, told through Minh, a student in Hanoi who just wants to pay a friend back for a coffee. Fifteen chapters in six acts, bilingual (English / Tiếng Việt), light theme in Solana purple and teal. Every scene plays itself as you scroll — no controls to operate; the 3D SOL coin can be dragged at the end.

**Live:** https://xuannphuoc007.github.io/mi-a7k2x9/sol/

> Educational only. Not affiliated with Solana Labs, the Solana Foundation, Anza, Jump or anyone named. Not financial, investment or legal advice. Minh is fictional.
>
> **Images:** the Solana, Pump.fun, Raydium and Jupiter logos (trademarks of their owners, used for identification) and illustrated portraits of Anatoly Yakovenko, Raj Gokal and Lily Liu were supplied by the site owner. The coin face is built from the supplied Solana mark. Lawsuit claims are labelled as allegations with the defendants' denials.

## Story
1. **Why are blockchains slow?** — Bitcoin, Ethereum and Solana as three roads for a $2 coffee; ≈100M user transactions a day
2. **Origin** — Anatoly Yakovenko, Proof of History (2017), Loom → Solana, sale prices, the first 500M SOL
3. **The journey** — SOL price 2020–2026 (estimated) with outages, FTX, meme records, ETFs and upgrades
4. **A clock everyone can trust** — Proof of History, leader schedule, Alpenglow (Oct 2026)
5. **Many checkouts at once** — parallel execution, local fee markets, fees, 400 → 200 ms
6. **Who runs the network?** — validators, staking, Nakamoto coefficient, inflation and the 2026 vote
7. **When the network stopped** — outages 2021–2024, 1,000 days without a halt, Firedancer
8. **The FTX winter** — Sam coins, Wormhole, the crash to $8, the estate sale at $64
9. **The meme-coin casino** — Pump.fun, TRUMP, LIBRA, the RICO class action (alleged · denied)
10. **Money apps on Solana** — Jupiter/Raydium swaps, stablecoins, tokenised assets, DTCC
11. **Security, fund or neither?** — SEC 2023, cases dropped 2025, spot SOL ETFs
12. **The people behind it** — Anatoly Yakovenko, Raj Gokal, Lily Liu; Anza and Jump
13. **Bitcoin vs Ethereum vs Solana** — scene + comparison table
14. **Reality check** — strengths vs risks, the last 12 months
15. **Minh's coffee, paid** — draggable 3D SOL coin

## Data
- Price line: Coin Metrics community `CapMrktEstUSD` ÷ a circulating supply calibrated so each month-end matches Coinlore's monthly close (to 23 May 2026); then monthly closes and dated reports (dashed). Labelled as an estimate on the page.
- Every other figure carries a date and a source in `src/data/coins/sol/references.ts`.

## Build
```bash
npm install
NEXT_PUBLIC_BASE_PATH=/mi-a7k2x9/sol npx next build   # static export in out/
```
Stack: Next.js (static export), Tailwind v4, GSAP ScrollTrigger, React Three Fiber.
