# LINK, explained — a metro ride through Chainlink

Scroll-driven, bilingual (EN/VI) explainer of Chainlink and the LINK token, told as a metro journey:
every chapter is a station. A realistic 3D metro train (React Three Fiber) stays in frame while the
world slides past; a station information board shows a poster per chapter that builds beat by beat,
and a colour-coded route map draws itself as the train travels.

Stations (11): blind blockchain (oracles) · price feeds · the LINK token · cross-chain (CCIP) ·
banks on board · 2017–2021 · LUNA, 2022 · LINK today · strengths · weaknesses · conclusion.

- Train model: lofted car bodies with a per-pixel livery shader (`src/components/train/paint.ts`),
  bogies, gangways, pantograph; world: viaduct, catenary, city, glass-arch stations.
- Copy: `src/data/coins/link/story.ts`, interface/posters: `translations.ts`, sources: `references.ts`.
- Build: `NEXT_PUBLIC_BASE_PATH=/mi-a7k2x9/link npx next build` → `out/`.

Chainlink logo supplied by the reader (trademark of its owner). Educational content, not investment advice.
