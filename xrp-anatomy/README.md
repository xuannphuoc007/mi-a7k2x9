# Anatomy of XRP

A cinematic, scroll-driven interactive explainer of XRP and the XRP Ledger — eleven chapters (incl. real-world assets), beginner-friendly, bilingual (English / Tiếng Việt).

**Live:** https://xuannphuoc007.github.io/mi-a7k2x9/xrp/

> Educational only. Not affiliated with Ripple or the XRP Ledger Foundation. Not financial advice. Wallets, balances, routes and liquidity are simulated or illustrative unless labelled LIVE.

## Stack
Next.js 15 (static export) · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · Three.js / React Three Fiber · SVG · Framer Motion · Lucide.

## How the motion works
- One ScrollTrigger converts scroll position into a single story coordinate `g` (chapter index + local progress), smoothed with `gsap.quickTo`.
- Each chapter owns a paused GSAP timeline that is scrubbed with `timeline.progress()` from `g`, so every transformation reverses exactly and chapter jumps render intermediate states in order.
- The 3D coin (12 conceptual layers, particle field, camera) is a pure function of `g` — see `src/animations/cameraController.ts` and `src/components/visualization/CoinCanvas.tsx`.
- Scenes share one 1000×1000 coordinate system (`src/data/coins/xrp/layouts.ts`) so each chapter hands its objects to the next (coin → ledger → validators → wallets → map → liquidity → order book → RWA vault → supply ring → risk map → exploded coin).

## Structure
```
src/
  animations/      scrollController.ts, cameraController.ts
  components/      layout/, storytelling/, visualization/ (Stage, CoinCanvas, scenes/), interactive/ (panels)
  data/coins/xrp/  chapters.ts, anatomy.ts, translations.ts, references.ts, layouts.ts
  simulations/     transactionSimulator.ts, paymentRouter.ts, liquiditySimulator.ts
  hooks/, lib/
```
To explain another asset, add `src/data/coins/<asset>/` with the same files and reuse the engine.

## Develop
```bash
cd xrp-anatomy
npm install
npm run dev                      # http://localhost:3000
NEXT_PUBLIC_BASE_PATH=/mi-a7k2x9/xrp npm run build   # static export to out/
rm -rf ../public/xrp && cp -r out ../public/xrp       # publish with the dashboard's Pages build
```
The repository's existing Vite build copies `public/xrp/` into `dist/xrp/`, so the explainer deploys with the dashboard's GitHub Pages workflow.

## Story structure (v3)

Six acts: The Problem → The Origin → The Journey → The Simulation → The Economics → The Reality Check. New scenes: ProblemScene, OriginScene, JourneyScene, EconomicsScene; new panels: Problem, Journey, Economics (fee-burn calculator), Verdict. Price/activity data: Coin Metrics (CC BY-NC 4.0) to 23 May 2026, then dated news.
