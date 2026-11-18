# BNB & Binance, explained

A scroll-driven, beginner-first story of Binance — the world's biggest crypto exchange — and its BNB coin, told through Minh, a student in Hanoi buying his first $100 of bitcoin. Fifteen chapters in six acts, bilingual (English / Tiếng Việt), light theme in Binance-style yellow and graphite. Every scene plays itself as you scroll — no controls to operate.

**Live:** https://xuannphuoc007.github.io/mi-a7k2x9/bnb/

> Educational only. Not affiliated with Binance, BNB Chain or anyone named. Not financial, investment or legal advice. Minh is fictional.
>
> **Editorial choices:** the coin is an original illustration (a yellow "BNB" disc), not Binance's trademark logo; people are shown as initials, never portraits. Allegations are labelled by status — *court finding* (2023 guilty pleas), *dropped* (SEC case, 2025), *pardoned* (CZ, 2025), *alleged & denied* (2026 Iran-flow reports) — and each comes with the response of those accused.

## Story
1. **The problem** — Minh, an exchange as marketplace + vault, the promise behind an app balance
2. **Origin** — CZ's path, the 2017 token sale (and Forbes' dispute of its figures), China's ban, fee discounts (3D coin)
3. **The journey** — BNB price 2017–2026 with hacks, legal events and peaks
4. **How an exchange works** — order book, matching, fees, hot vs cold wallets, a row in a database
5. **Proof of reserves** — FTX, Merkle tree, what a snapshot can't show
6. **What BNB is for** — uses, quarterly burns towards 100M, BNB tied to Binance's news
7. **BNB Chain** — 45 validators, fast blocks, the 2022 halt, Nakamoto coefficient
8. **The guilty plea (2023)** — three charges, $4.3B, the monitor, CZ's four months
9. **2025: SEC dropped, pardon, USD1** — supporters vs critics
10. **New questions** — the 10/10 crash and repayments; 2026 Iran-flow allegations, denials and the WSJ lawsuit
11. **The $6.3B hack (Oct 2026)** — hot wallets drained, ~$3B frozen, withdrawals paused, losses covered
12. **The team** — CZ, Yi He, Richard Teng: roles, facts, criticism
13. **Exchange or your own wallet?** — side-by-side table
14. **Reality check** — strengths vs risks, the last 12 months of BNB
15. **Finale** — what Minh does with his $100

## Stack
Next.js (static export), Tailwind v4, GSAP ScrollTrigger, React Three Fiber (coin), SVG scenes on a 1000×1000 stage.

```bash
npm install
npm run dev
NEXT_PUBLIC_BASE_PATH=/mi-a7k2x9/bnb npx next build   # static export to out/
```

Data: Coin Metrics community data (CC BY-NC 4.0) for prices to May 2026; later figures from dated press reports. Full source list in the page footer (`src/data/coins/bnb/references.ts`).
