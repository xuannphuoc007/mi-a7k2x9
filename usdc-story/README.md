# The Journey of a Digital Dollar — USDC

Cinematic, scroll-driven explainer of USDC (EN / VI), nine scenes plus an interactive system map:
01 note → token · 02 minting floor · 03 reserve vault · 04 chain network (native vs bridged) · 05 CCTP portal ·
06 the one-dollar question (simulated scenarios) · 07 control layer (blacklist / pause / upgrade) ·
08 March 2023 depeg (historical) · 09 redemption and the flight home · system map (click to fly).

- Next.js static export · React Three Fiber · one render loop; the camera is keyframed on one normalised scroll timeline (fully reversible)
- X-RAY toggle (Cinematic / System) blends materials and reveals real entities without rebuilding the scene
- Reserve figures: Circle transparency report, 12 Nov 2026. Simulated values are labelled.

Build: `NEXT_PUBLIC_BASE_PATH=/mi-a7k2x9/usdc npx next build` → `out/`
