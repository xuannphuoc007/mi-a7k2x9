# Solana, explained

A scroll-driven, beginner-first story of Solana and SOL, told through Minh, a student in Hanoi who just wants to pay a friend back for a coffee. Fifteen chapters in six acts, bilingual (English / Tiếng Việt), light theme in Solana purple and teal. Every scene plays itself as you scroll — no controls to operate; the 3D SOL coin can be dragged at the end.

**Live:** https://xuannphuoc007.github.io/mi-a7k2x9/sol/

> Educational only. Not affiliated with Solana Labs, the Solana Foundation, Anza, Jump or anyone named. Not financial, investment or legal advice. Minh is fictional.
>
> **Images:** the Solana, Pump.fun, Raydium and Jupiter logos (trademarks of their owners, used for identification) and illustrated portraits of Anatoly Yakovenko, Raj Gokal and Lily Liu were supplied by the site owner. The coin face is built from the supplied Solana mark. Lawsuit claims are labelled as allegations with the defendants' denials.

## Story
Plain language first — almost no jargon.
1. **Why Solana?** — Bitcoin, Ethereum and Solana as three roads for a $2 coffee
2. **Milestone 1 · Speed and cost** — Anatoly Yakovenko, a shared clock, many checkouts, fees
3. **Milestone 2 · NFTs (2021–2022)** — Magic Eden, "Solana summer", one weekend of two failures
4. **Milestone 3 · FTX collapses (2022)** — Sam coins, the crash to $8, "Solana is dead?"
5. **Milestone 4 · The comeback (2023)** — BONK, the Pyth/Jito airdrops, +900%
6. **Milestone 5 · Meme coins & Pump.fun (2024–2025)** — TRUMP, LIBRA, the lawsuit (alleged)
7. **Six years in one picture** — SOL price 2020–2026 (estimated) with numbered pins
8. **Solana today** — digital dollars, tokenised assets, U.S. funds, 1,000 days without an outage
9. **The people behind it** — Anatoly Yakovenko, Raj Gokal, Lily Liu; Anza and Jump
10. **Bitcoin vs Ethereum vs Solana** — scene + comparison table
11. **Strengths** — five cards
12. **Weaknesses** — five cards
13. **Weighing it up** — the balance and the last 12 months
14. **Conclusion** — what it means for users and investors; draggable 3D SOL coin

## Data
- Price line: Coin Metrics community `CapMrktEstUSD` ÷ a circulating supply calibrated so each month-end matches Coinlore's monthly close (to 23 May 2026); then monthly closes and dated reports (dashed). Labelled as an estimate on the page.
- Every other figure carries a date and a source in `src/data/coins/sol/references.ts`.

## Build
```bash
npm install
NEXT_PUBLIC_BASE_PATH=/mi-a7k2x9/sol npx next build   # static export in out/
```
Stack: Next.js (static export), Tailwind v4, GSAP ScrollTrigger, React Three Fiber.
