"use client";
/**
 * Thirteen scenes, one per chapter, on a 640 × 560 stage. Each builds up beat by beat (b)
 * and some read the in-chapter progress (p) for continuous motion (the alarm clock).
 * Loops (particles, flowing dashes) run on their own so nothing ever looks frozen.
 */
import { C } from "@/data/coins/link/chapters";
import type { Dict } from "@/data/coins/link/translations";
import { Chain, Check, Coin, Cross, Glass, hexPts, Node, Particle, Pill, T, vis } from "./kit";

export type SceneProps = { b: number; p: number; t: Dict };

/* 01 — the missing link */
function Missing({ b, t }: SceneProps) {
  const s = t.scenes;
  const icons = ["$", "▦", "⚄", "🏦"];
  return (
    <g>
      <Glass x={110} y={190} w={250} h={230} label={s.chains[0]} sub={b >= 1 ? s.sealed : undefined}>
        <rect x={138} y={232} width={194} height={120} rx={14} fill="#fff" stroke={C.line} />
        <T x={235} y={262} size={13} color={C.mute} weight={600}>
          {s.app}
        </T>
        <rect x={156} y={276} width={158} height={26} rx={8} fill={C.blueSoft} />
        <rect x={156} y={308} width={110} height={26} rx={8} fill={C.blueSoft} />
        <g className={b >= 2 ? "" : "blink"}>
          <rect x={150} y={366} width={170} height={36} rx={10} fill={b >= 2 ? "#dff5ec" : "#fde7e4"} />
          <T x={235} y={390} size={17} weight={800} color={b >= 2 ? C.sign : C.warn}>
            {b >= 2 ? s.got : s.ask}
          </T>
        </g>
      </Glass>
      {/* glass wall and the outside world */}
      <g className={vis(b >= 1)}>
        <line x1={438} y1={70} x2={438} y2={480} stroke="#b9c8da" strokeWidth={3} strokeDasharray="8 8" />
        {s.world.map((w, i) => (
          <g key={w} transform={`translate(${470} ${110 + i * 92})`}>
            <rect width={140} height={58} rx={14} fill="#fff" stroke={C.line} filter="url(#soft)" />
            <circle cx={30} cy={29} r={17} fill={C.blueSoft} />
            <T x={30} y={35} size={17} weight={800} color={C.blue}>
              {icons[i]}
            </T>
            <T x={58} y={35} size={15} anchor="start">
              {w}
            </T>
          </g>
        ))}
      </g>
      {/* the missing link appears */}
      <g className={vis(b >= 2)}>
        <Chain x1={470} y1={139} x2={366} y2={300} on={b >= 2} r={10} />
        <Node x={428} y={210} r={20} ring={C.sky} />
        <Pill x={428} y={258} text={s.oracle} size={13} />
        <Particle path="M470 139 L366 300" dur={1.6} r={5} color={C.amber} />
        <Particle path="M470 139 L366 300" dur={1.6} delay={0.8} r={5} color={C.amber} />
      </g>
    </g>
  );
}

/* 02 — no chain of its own */
function NoChain({ b, t }: SceneProps) {
  const s = t.scenes;
  const blocks = [
    { x: 40, y: 92 },
    { x: 262, y: 50 },
    { x: 486, y: 92 },
    { x: 410, y: 262 },
    { x: 116, y: 262 },
  ];
  const W = 104,
    H = 78;
  const ctr = blocks.map((q) => ({ x: q.x + W / 2, y: q.y + H / 2 }));
  return (
    <g>
      {blocks.map((q, i) => (
        <Glass key={i} x={q.x} y={q.y} w={W} h={H} label={s.chains[i]}>
          {i === 0 && <Coin x={q.x + W / 2} y={q.y + H / 2 + 2} r={16} label="" />}
        </Glass>
      ))}
      {/* where Chainlink's own block would be */}
      <g className={vis(b < 2)}>
        <rect x={262} y={168} width={W} height={H} rx={6} fill="none" stroke={C.warn} strokeWidth={2.5} strokeDasharray="7 6" />
        <path d={`M268 174 L${262 + W - 6} ${168 + H - 6}`} stroke={C.warn} strokeWidth={2.5} />
        <T x={314} y={168 + H + 22} size={14} color={C.warn} weight={700}>
          {s.noChain}
        </T>
      </g>
      {/* the chain between every block */}
      {ctr.map((a, i) => {
        const z = ctr[(i + 1) % ctr.length];
        return <Chain key={i} x1={a.x} y1={a.y} x2={z.x} y2={z.y} on={b >= 1} delay={i * 0.25} r={8} />;
      })}
      <g className={vis(b >= 1)}>
        {[0, 2, 4].map((i) => {
          const a = ctr[i],
            z = ctr[(i + 1) % ctr.length];
          const mx = (a.x + z.x) / 2,
            my = (a.y + z.y) / 2;
          return (
            <g key={i}>
              {[-1, 0, 1].map((k) => (
                <polygon key={k} points={hexPts(mx + k * 16, my - 20 + Math.abs(k) * 8, 8)} fill="url(#gHex)" />
              ))}
              {i === 0 && (
                <T x={mx} y={my - 36} size={12} weight={800} color={C.blueDeep}>
                  {s.don}
                </T>
              )}
            </g>
          );
        })}
      </g>
      <T x={320} y={395} size={14} color={C.blueDeep} weight={700}>
        {s.erc}
      </T>
      {/* how they earn */}
      <g className={vis(b >= 2)}>
        <T x={320} y={428} size={12} color={C.mute} weight={700} className="tag">
          {s.gasTitle.toUpperCase()}
        </T>
        <rect x={24} y={440} width={290} height={92} rx={16} fill="#fff" stroke={C.line} />
        <rect x={326} y={440} width={290} height={92} rx={16} fill={C.blueSoft} stroke="#c8d6f6" />
        <Glass x={44} y={470} w={52} h={44} />
        {[0, 1, 2].map((k) => (
          <circle key={k} cx={70} cy={455} r={5} fill={C.amber}>
            <animate attributeName="cy" values="440;492" dur="1.4s" begin={`${k * 0.45}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="1.4s" begin={`${k * 0.45}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <T x={120} y={482} size={13} anchor="start" weight={700}>
          ETH · SOL · BNB
        </T>
        <T x={120} y={504} size={12.5} anchor="start" color={C.mute}>
          {s.gas}
        </T>
        <Coin x={362} y={486} r={20} label="" />
        <T x={396} y={482} size={13} anchor="start" weight={700}>
          LINK
        </T>
        <T x={396} y={504} size={12.5} anchor="start" color={C.mute}>
          {s.svc}
        </T>
      </g>
    </g>
  );
}

/* 03 — many nodes, one signature */
function Ocr({ b, t }: SceneProps) {
  const s = t.scenes;
  const src = ["100.1", "99.9", "100.2", "100.0", "100.1"];
  const vals = [100.1, 99.9, 100.2, 92.0, 100.0, 100.1, 100.3, 100.1, 100.0];
  const cx = 290,
    cy = 268,
    R = 118;
  const nodes = vals.map((v, i) => {
    const a = (-90 + i * 40) * (Math.PI / 180);
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a), v };
  });
  return (
    <g>
      <T x={56} y={74} size={12} color={C.mute} weight={700}>
        {s.sources.toUpperCase()}
      </T>
      {src.map((v, i) => (
        <g key={i}>
          <rect x={20} y={92 + i * 74} width={72} height={44} rx={10} fill="#fff" stroke={C.line} />
          <T x={56} y={120 + i * 74} size={15} weight={700}>
            {v}
          </T>
        </g>
      ))}
      {/* sources → nodes */}
      <g className={vis(true)}>
        {nodes.map((n, i) => (
          <line key={i} x1={92} y1={114 + (i % 5) * 74} x2={n.x} y2={n.y} stroke={C.sky} strokeWidth={1.3} opacity={b === 0 ? 0.55 : 0.15} className="flow" />
        ))}
      </g>
      {/* off-chain talk */}
      <g className={vis(b >= 1)}>
        {nodes.map((a, i) =>
          nodes.slice(i + 1).map((z, j) => <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={z.x} y2={z.y} stroke={C.sign} strokeWidth={1} opacity={0.22} />),
        )}
      </g>
      {nodes.map((n, i) => {
        const out = n.v < 95;
        return (
          <g key={i}>
            <Node x={n.x} y={n.y} r={18} ring={b >= 1 && out ? C.warn : undefined} color={b >= 1 && out ? "#f3b2ab" : "url(#gHex)"} />
            <T x={n.x} y={n.y - 27} size={12.5} weight={700} color={out && b >= 1 ? C.warn : C.ink}>
              {n.v.toFixed(1)}
            </T>
            {b >= 2 && !out && i % 4 !== 1 && <Check x={n.x + 15} y={n.y + 13} r={8} />}
          </g>
        );
      })}
      <g className={vis(b === 1)}>
        <Pill x={cx} y={cy - 6} text={`${s.median} 100.1`} color={C.sign} size={15} />
        <T x={cx} y={cy + 24} size={12} color={C.warn} weight={600}>
          ↖ {s.outlier}
        </T>
      </g>
      {/* one envelope, many seals */}
      <g className={vis(b >= 2)}>
        <g transform={`translate(${cx - 42} ${cy - 30})`}>
          <rect width={84} height={58} rx={8} fill="#fff" stroke={C.sign} strokeWidth={2.5} filter="url(#soft)" />
          <path d="M3 5 L42 32 L81 5" stroke={C.sign} strokeWidth={2.5} fill="none" />
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <circle key={k} cx={14 + k * 11.5} cy={47} r={4.2} fill={C.sign} />
          ))}
        </g>
        <T x={cx} y={cy + 48} size={12.5} color={C.sign} weight={700}>
          {s.signed}
        </T>
      </g>
      {/* into the chain */}
      <g className={vis(b >= 3)}>
        <Glass x={500} y={208} w={104} h={124} label={s.chains[0]} />
        <path d={`M${cx + 44} ${cy} L500 ${cy}`} stroke={C.sign} strokeWidth={3} strokeDasharray="6 6" className="flow" />
        <rect width={26} height={18} rx={3} fill="#fff" stroke={C.sign} strokeWidth={2}>
          <animateMotion dur="1.8s" repeatCount="indefinite" path={`M${cx + 40} ${cy - 9} L${520} ${cy - 9}`} />
        </rect>
        <g transform="translate(330 470)">
          <rect x={-150} y={-30} width={300} height={74} rx={16} fill="#fff" stroke={C.line} />
          <T x={-75} y={2} size={22} weight={800} color={C.mute}>
            9
          </T>
          <line x1={-92} y1={-6} x2={-58} y2={-6} stroke={C.warn} strokeWidth={3} />
          <T x={-75} y={24} size={11.5} color={C.mute}>
            {s.txs}
          </T>
          <T x={-10} y={2} size={18} color={C.mute}>
            →
          </T>
          <T x={70} y={2} size={22} weight={800} color={C.sign}>
            {s.oneTx}
          </T>
          <T x={70} y={24} size={12} color={C.sign} weight={700}>
            {s.gasCut}
          </T>
        </g>
      </g>
    </g>
  );
}

/* 04 — push or pull */
function PushPull({ b, t }: SceneProps) {
  const s = t.scenes;
  // a wobbly price, pushed when it leaves the ±0.5% band
  const pts = [0, 4, -3, 6, 12, 9, 15, 22, 18, 26, 31, 27, 35];
  const path = pts.map((v, i) => `${i ? "L" : "M"}${36 + i * 21} ${190 - v * 2.2}`).join(" ");
  return (
    <g>
      {/* PUSH */}
      <g style={{ opacity: b === 1 ? 0.35 : 1, transition: "opacity .5s" }}>
        <Pill x={160} y={58} text={s.push} color={C.blue} size={14} />
        <rect x={24} y={90} width={276} height={150} rx={14} fill="#fff" stroke={C.line} />
        <rect x={34} y={166} width={256} height={46} fill={C.blueSoft} />
        <T x={286} y={160} size={11.5} anchor="end" color={C.blue} weight={700}>
          ± {s.dev}
        </T>
        <path d={path} stroke={C.ink} strokeWidth={2.6} fill="none" />
        {[4, 7, 10].map((i) => (
          <g key={i}>
            <circle cx={36 + i * 21} cy={190 - pts[i] * 2.2} r={6} fill={C.blue} />
            <line x1={36 + i * 21} y1={196 - pts[i] * 2.2} x2={36 + i * 21} y2={300} stroke={C.blue} strokeWidth={2} strokeDasharray="4 5" className="flow" />
          </g>
        ))}
        <g transform="translate(60 268)">
          <circle r={16} fill="#fff" stroke={C.ink} strokeWidth={2} />
          <line x1={0} y1={0} x2={0} y2={-10} stroke={C.ink} strokeWidth={2.2}>
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite" />
          </line>
          <T x={24} y={5} size={12.5} anchor="start" color={C.mute}>
            {s.hb}
          </T>
        </g>
        <Glass x={88} y={312} w={160} h={120} label={s.chains[0]} />
      </g>
      {/* PULL */}
      <g className={vis(b >= 1)}>
        <Pill x={480} y={58} text={s.pull} color={C.sky} size={14} />
        <rect x={340} y={90} width={276} height={150} rx={14} fill="#fff" stroke={C.line} />
        <clipPath id="belt">
          <rect x={344} y={100} width={268} height={70} />
        </clipPath>
        <g clipPath="url(#belt)">
          <g>
            <animateTransform attributeName="transform" type="translate" from="0 0" to="-44 0" dur="0.9s" repeatCount="indefinite" />
            {Array.from({ length: 12 }, (_, k) => (
              <g key={k} transform={`translate(${300 + k * 44} 116)`}>
                <rect width={34} height={40} rx={5} fill="#fff" stroke={C.sky} strokeWidth={1.8} />
                <circle cx={17} cy={30} r={4.5} fill={C.sign} />
                <line x1={7} y1={11} x2={27} y2={11} stroke={C.sky} strokeWidth={2} />
                <line x1={7} y1={18} x2={22} y2={18} stroke={C.sky} strokeWidth={2} />
              </g>
            ))}
          </g>
        </g>
        <T x={478} y={204} size={12.5} color={C.mute}>
          ⚡ {s.subsec}
        </T>
        <path d="M478 214 L478 304" stroke={C.sky} strokeWidth={3} strokeDasharray="5 5" className="flow" />
        <rect width={26} height={30} rx={4} fill="#fff" stroke={C.sky} strokeWidth={2}>
          <animateMotion dur="1.1s" repeatCount="indefinite" path="M465 160 L465 330" />
        </rect>
        <Glass x={398} y={312} w={160} h={120} label={s.chains[2]} accent={C.sky}>
          <Check x={478} y={376} r={16} />
        </Glass>
        <T x={478} y={480} size={12.5} color={C.sign} weight={700}>
          {s.verify}
        </T>
      </g>
      <g className={vis(b >= 2)}>
        <Pill x={320} y={528} text={s.both} color={C.sign} size={14} />
      </g>
    </g>
  );
}

/* 05 — reserves and dice */
function Proofs({ b, t }: SceneProps) {
  const s = t.scenes;
  const supply = b >= 1 ? 118 : 70;
  return (
    <g>
      {/* Proof of Reserve */}
      <g style={{ opacity: b >= 2 ? 0.4 : 1, transition: "opacity .5s" }}>
        <rect x={24} y={70} width={130} height={170} rx={16} fill="#fff" stroke={C.gold} strokeWidth={3} filter="url(#soft)" />
        <circle cx={89} cy={130} r={30} fill="none" stroke={C.gold} strokeWidth={5} />
        <circle cx={89} cy={130} r={6} fill={C.gold} />
        <rect x={44} y={176} width={90} height={44} rx={6} fill="#fbe7a6" />
        <T x={89} y={204} size={13} weight={800} color="#8a6608">
          {s.vault} 100
        </T>
        <Chain x1={154} y1={150} x2={218} y2={150} r={7} on />
        <Node x={236} y={150} r={16} />
        <Chain x1={236} y1={168} x2={236} y2={258} r={7} on />
        <Glass x={160} y={268} w={160} h={170} label={s.chains[0]} accent={C.gold}>
          {/* reserve vs supply bars */}
          <rect x={192} y={420 - 100} width={34} height={100} rx={4} fill="#f4d987" />
          <T x={209} y={430} size={11} color={C.mute}>
            {s.vault}
          </T>
          <line x1={186} y1={320} x2={300} y2={320} stroke={C.gold} strokeWidth={2} strokeDasharray="5 4" />
          <rect x={250} y={420 - supply} width={34} height={supply} rx={4} fill={b >= 1 ? "#f2a49b" : C.sky} style={{ transition: "all .8s" }} />
          <T x={267} y={430} size={11} color={C.mute}>
            {s.supply}
          </T>
        </Glass>
        <g transform="translate(250 486)">
          {b >= 1 ? <Cross x={-118} y={0} r={13} /> : <Check x={-118} y={0} r={13} />}
          <T x={-98} y={5} size={14} anchor="start" weight={700} color={b >= 1 ? C.warn : C.sign}>
            {s.mint}: {b >= 1 ? s.blocked : s.ok}
          </T>
        </g>
      </g>
      {/* VRF */}
      <g className={vis(b >= 2)}>
        <g transform="translate(400 70)">
          <g className="wobble">
          <rect width={74} height={74} rx={16} fill="#fff" stroke={C.ink} strokeWidth={3} filter="url(#soft)" />
          {[
            [20, 20],
            [54, 20],
            [37, 37],
            [20, 54],
            [54, 54],
          ].map(([x, y], k) => (
            <circle key={k} cx={x} cy={y} r={6} fill={C.ink} />
          ))}
          </g>
        </g>
        <Chain x1={437} y1={150} x2={437} y2={196} r={7} />
        <g transform="translate(400 200)">
          <rect width={170} height={56} rx={12} fill="#fff" stroke={C.sign} strokeWidth={2.5} />
          <T x={34} y={38} size={26} weight={800}>
            7
          </T>
          <Check x={74} y={28} r={11} />
          <T x={92} y={33} size={13} anchor="start" color={C.sign} weight={700}>
            {s.proof}
          </T>
        </g>
        <Glass x={410} y={300} w={170} h={130} label={s.chains[2]} accent={C.sign}>
          <T x={495} y={375} size={34} weight={800} color={C.sign}>
            7
          </T>
        </Glass>
        <T x={495} y={292} size={12.5} color={C.sign} weight={700}>
          ↓ {s.accepted}
        </T>
      </g>
      <g className={vis(b >= 3)}>
        <g transform="translate(286 200)">
          <rect width={100} height={50} rx={10} fill="#fff" stroke={C.warn} strokeWidth={2.5} strokeDasharray="6 4" />
          <T x={28} y={34} size={24} weight={800} color={C.warn}>
            9
          </T>
          <Cross x={70} y={25} r={11} />
        </g>
        <T x={336} y={272} size={12.5} color={C.warn} weight={700}>
          {s.tampered} → {s.rejected}
        </T>
      </g>
    </g>
  );
}

/* 06 — a gate with two guards */
function Ccip({ b, t }: SceneProps) {
  const s = t.scenes;
  return (
    <g>
      {/* broken bridges */}
      <g style={{ opacity: b >= 1 ? 0.25 : 1, transition: "opacity .5s" }}>
        {s.hacks.map((h, i) => (
          <g key={h.n}>
            <Chain x1={150} y1={92 + i * 52} x2={490} y2={92 + i * 52} r={8} color={C.warn} broken />
            <Pill x={320} y={78 + i * 52} text={`${h.n} ${h.v}`} color={C.warn} size={12.5} />
          </g>
        ))}
      </g>
      <Glass x={24} y={250} w={120} h={130} label={s.chains[0]} accent={C.guard} />
      <Glass x={480} y={250} w={120} h={130} label={s.chains[3]} accent={C.guard} />
      <g className={vis(b >= 1)}>
        <Chain x1={150} y1={315} x2={490} y2={315} r={9} color={C.guard} on={b >= 1} />
        {/* booth 1 — commit */}
        <g transform="translate(232 250)">
          <rect x={-38} y={-10} width={76} height={92} rx={12} fill="#fff" stroke={C.blue} strokeWidth={2.5} filter="url(#soft)" />
          <Node x={0} y={28} r={16} />
          <T x={0} y={-18} size={12} color={C.blue} weight={800}>
            {s.commit} · Go
          </T>
        </g>
        {/* booth 2 — risk management network */}
        <g transform="translate(398 250)">
          <rect x={-38} y={-10} width={76} height={92} rx={12} fill="#fff" stroke={C.guard} strokeWidth={2.5} filter="url(#soft)" />
          <Node x={0} y={28} r={16} color={C.guard} />
          <T x={0} y={-18} size={12} color={C.guard} weight={800}>
            RMN · Rust
          </T>
        </g>
        <T x={315} y={418} size={12.5} color={C.guard} weight={700}>
          {s.rmn} · {s.goRust}
        </T>
        <rect width={22} height={16} rx={3} fill="#fff" stroke={C.guard} strokeWidth={2}>
          <animateMotion dur="2.6s" repeatCount="indefinite" path="M150 307 L480 307" />
        </rect>
      </g>
      <g className={vis(b >= 2)}>
        <g transform="translate(398 382)">
          <Pill x={0} y={0} text={s.bless} color={C.sign} fill="#e3f6ee" size={13} />
        </g>
        <g transform="translate(320 470)">
          <rect x={-170} y={-30} width={340} height={58} rx={14} fill="#fde8e5" stroke={C.warn} />
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <rect key={k} x={-150 + k * 22} y={-6} width={14} height={10} fill={k % 2 ? "#fff" : C.warn} />
          ))}
          <rect x={-152} y={-6} width={134} height={10} fill="none" stroke={C.warn} />
          <T x={-4} y={4} size={14} weight={800} color={C.warn} anchor="start">
            {s.curse}
          </T>
        </g>
      </g>
      <g className={vis(b >= 3)}>
        <Pill x={170} y={540} text={s.moved} color={C.guard} size={13} />
        <Pill x={470} y={540} text={s.ccip2} color={C.guard} size={13} />
      </g>
    </g>
  );
}

/* 07 — the alarm */
function Alarm({ b, p, t }: SceneProps) {
  const s = t.scenes;
  const hours = b >= 2 ? 3 : b === 1 ? Math.max(0, Math.min(3, ((p - 0.25) / 0.2) * 3)) : 0;
  const ring = hours >= 3;
  const ang = (hours / 12) * 360;
  return (
    <g>
      {/* staking pool */}
      <rect x={24} y={300} width={200} height={170} rx={18} fill="#fff" stroke={C.line} filter="url(#soft)" />
      {[0, 1, 2, 3].map((k) => (
        <g key={k}>
          {[0, 1, 2].map((j) => (
            <polygon key={j} points={hexPts(64 + k * 40, 430 - j * 22, 15)} fill="url(#gHex)" opacity={1 - j * 0.1} />
          ))}
        </g>
      ))}
      <T x={124} y={330} size={12.5} weight={700} color={C.blueDeep}>
        {s.pool}
      </T>
      {/* the feed */}
      <Glass x={404} y={70} w={200} h={140} label="ETH/USD" accent={ring ? C.warn : C.blue}>
        <T x={504} y={150} size={b >= 1 ? 30 : 22} weight={800} color={b >= 1 ? "#a5b2c2" : C.ink}>
          {b >= 1 ? "· · ·" : "ETH/USD ✓"}
        </T>
      </Glass>
      <T x={504} y={258} size={12.5} color={b >= 1 ? C.warn : C.mute} weight={700} className={vis(b >= 1)}>
        {s.silent}
      </T>
      {/* clock */}
      <g transform="translate(250 150)">
        <circle r={78} fill="#fff" stroke={ring ? C.warn : C.ink} strokeWidth={5} filter="url(#soft)" />
        <path d={`M0 0 L0 -72 A72 72 0 ${ang > 180 ? 1 : 0} 1 ${72 * Math.sin((ang * Math.PI) / 180)} ${-72 * Math.cos((ang * Math.PI) / 180)} Z`} fill={C.warn} opacity={0.18} />
        {Array.from({ length: 12 }, (_, k) => (
          <line key={k} x1={0} y1={-66} x2={0} y2={-58} stroke={C.ink} strokeWidth={2.5} transform={`rotate(${k * 30})`} />
        ))}
        <line x1={0} y1={0} x2={0} y2={-58} stroke={C.ink} strokeWidth={4} strokeLinecap="round" transform={`rotate(${ang})`} />
        <circle r={6} fill={C.ink} />
        <T x={0} y={38} size={20} weight={800} color={ring ? C.warn : C.ink}>
          {hours.toFixed(1)} {s.hours}
        </T>
      </g>
      <g className={vis(ring)}>
        <g className="blink">
          <Pill x={250} y={262} text={`🔔 ${s.alert}`} color={C.warn} fill="#fde8e5" size={15} />
        </g>
      </g>
      {/* penalty and reward */}
      <g className={vis(b >= 2)}>
        {Array.from({ length: 5 }, (_, k) => (
          <g key={k}>
            <Node x={290 + k * 64} y={340} r={17} color="#f0a49b" ring={C.warn} />
            <T x={290 + k * 64} y={378} size={12} weight={800} color={C.warn}>
              −700
            </T>
          </g>
        ))}
        <T x={418} y={408} size={13} weight={700} color={C.warn}>
          {s.slash}
        </T>
        <g transform="translate(300 452)">
          <circle r={14} fill={C.sign} />
          <circle cy={-22} r={9} fill={C.sign} />
          <T x={26} y={6} size={15} anchor="start" weight={800} color={C.sign}>
            {s.reward}
          </T>
        </g>
        <T x={124} y={500} size={12} color={C.mute}>
          {s.community}
        </T>
      </g>
    </g>
  );
}

/* 08 — two flows of LINK */
function Flows({ b, t }: SceneProps) {
  const s = t.scenes;
  const col = (i: number) => (i < 35 ? C.sky : i < 70 ? C.teal : "#24305e");
  return (
    <g>
      <T x={128} y={52} size={11.5} color={C.mute} weight={700}>
        {s.grid}
      </T>
      {Array.from({ length: 100 }, (_, i) => (
        <rect key={i} x={24 + (i % 10) * 21} y={64 + Math.floor(i / 10) * 21} width={18} height={18} rx={3} fill={col(i)} opacity={b >= 3 && i < 70 ? 0.35 : 1} style={{ transition: "opacity .5s" }} />
      ))}
      {s.split.map((l, i) => (
        <g key={l}>
          <rect x={24} y={290 + i * 22} width={12} height={12} rx={2} fill={[C.sky, C.teal, "#24305e"][i]} />
          <T x={42} y={300 + i * 22} size={12.5} anchor="start">
            {l}
          </T>
        </g>
      ))}
      {/* fees in */}
      <g className={vis(b >= 1)}>
        <T x={290} y={52} size={12} color={C.mute} weight={700} anchor="start">
          {s.feesIn}
        </T>
        {["Ξ", "$", "₿", "◎"].map((c, k) => (
          <g key={c}>
            <circle cx={278 + k * 32} cy={84} r={13} fill="#fff" stroke={C.amber} strokeWidth={2} />
            <T x={278 + k * 32} y={89} size={13} weight={800} color={C.amber}>
              {c}
            </T>
          </g>
        ))}
        <path d="M326 100 L326 140" stroke={C.amber} strokeWidth={6} />
        <path d="M362 160 L468 160" stroke={C.blue} strokeWidth={6} />
        <Particle path="M326 100 L326 160 L470 160" dur={2} r={5} color={C.amber} />
        <Particle path="M326 100 L326 160 L470 160" dur={2} delay={1} r={5} color={C.blue} />
        <rect x={290} y={140} width={72} height={40} rx={10} fill="#fff7e6" stroke={C.amber} strokeWidth={2.5} />
        <T x={326} y={166} size={13} weight={800} color={C.amber}>
          {s.toLink}
        </T>
      </g>
      {/* the reserve */}
      <g className={vis(b >= 1)}>
        <rect x={470} y={62} width={146} height={170} rx={18} fill="#fff" stroke={C.blue} strokeWidth={3} filter="url(#soft)" />
        <rect x={482} y={226 - (b >= 2 ? 92 : 30)} width={122} height={b >= 2 ? 92 : 30} rx={8} fill={C.blueSoft} style={{ transition: "all .9s" }} />
        <Coin x={543} y={120} r={20} label="" />
        <T x={543} y={258} size={13} weight={800} color={C.blueDeep}>
          {s.reserve}
        </T>
      </g>
      {/* unlocks out */}
      <g className={vis(b >= 3)}>
        <path d="M234 255 C 340 255, 360 360, 468 360" stroke="#24305e" strokeWidth={16} fill="none" opacity={0.9} />
        <Particle path="M234 255 C 340 255, 360 360, 468 360" dur={1.4} r={6} color={C.amber} />
        <Particle path="M234 255 C 340 255, 360 360, 468 360" dur={1.4} delay={0.47} r={6} color={C.amber} />
        <Particle path="M234 255 C 340 255, 360 360, 468 360" dur={1.4} delay={0.94} r={6} color={C.amber} />
        <rect x={470} y={318} width={146} height={84} rx={14} fill="#fff8de" stroke={C.gold} strokeWidth={2.5} />
        <T x={543} y={355} size={15} weight={800} color="#8a6608">
          Binance
        </T>
        <T x={543} y={380} size={11.5} color={C.mute}>
          {s.binance}
        </T>
        <T x={543} y={304} size={12.5} weight={800} color="#24305e">
          {s.unlock}
        </T>
        <g transform="translate(24 430)">
          <T x={0} y={0} size={11.5} anchor="start" color={C.mute} weight={700}>
            {s.perMonth.toUpperCase()}
          </T>
          <rect x={0} y={14} width={420} height={24} rx={6} fill={C.warn} />
          <T x={430} y={32} size={14} anchor="start" weight={800} color={C.warn}>
            {s.outM}
          </T>
          <rect x={0} y={50} width={31} height={24} rx={6} fill={C.blue} />
          <T x={40} y={68} size={14} anchor="start" weight={800} color={C.blue}>
            {s.inM}
          </T>
          <T x={430} y={70} size={22} anchor="start" weight={800} color={C.warn}>
            {s.ratio}
          </T>
        </g>
      </g>
    </g>
  );
}

/* 09 — the journey (2017–2022) */
function Journey({ b, t }: SceneProps) {
  const s = t.scenes;
  const X0 = 2017.6,
    X1 = 2021.6;
  const sx = (x: number) => 64 + ((x - X0) / (X1 - X0)) * 540;
  const sy = (v: number) => 380 - ((Math.log10(v) + 1.3) / (Math.log10(70) + 1.3)) * 300;
  const pts: [number, number][] = [
    [2017.72, 0.12], [2017.85, 0.2], [2018.03, 1.1], [2018.25, 0.45], [2018.7, 0.4], [2018.95, 0.3], [2019.2, 0.45], [2019.38, 1.3],
    [2019.5, 4.0], [2019.65, 2.2], [2019.95, 1.8], [2020.2, 2.6], [2020.45, 4.6], [2020.62, 20.3], [2020.75, 10], [2020.95, 12.5],
    [2021.1, 26], [2021.25, 30], [2021.36, 52.88], [2021.48, 28],
  ];
  const d = pts.map(([x, v], i) => `${i ? "L" : "M"}${sx(x).toFixed(1)} ${sy(v).toFixed(1)}`).join(" ");
  const until = [2018.0, 2020.7, X1, X1][b] ?? X1;
  const ms = [
    { x: 2017.72, v: 0.12, l: s.ms[0] },
    { x: 2020.62, v: 20.3, l: s.ms[1] },
    { x: 2021.36, v: 52.88, l: s.ms[2] },
  ];
  return (
    <g>
      <T x={64} y={50} size={12} anchor="start" color={C.mute} weight={700}>
        {s.axis.toUpperCase()}
      </T>
      <clipPath id="jclip">
        <rect x={0} y={0} height={560} width={sx(until)} style={{ transition: "width 1.1s cubic-bezier(.3,.6,.2,1)" }} />
      </clipPath>
      {[0.1, 1, 10, 50].map((v) => (
        <g key={v}>
          <line x1={64} x2={610} y1={sy(v)} y2={sy(v)} stroke="#e6ebf0" />
          <T x={56} y={sy(v) + 4} size={11.5} anchor="end" color={C.mute} weight={500}>
            ${v}
          </T>
        </g>
      ))}
      {[2018, 2019, 2020, 2021].map((y) => (
        <T key={y} x={sx(y)} y={404} size={12} color={C.mute} weight={500}>
          {y}
        </T>
      ))}
      <path d={`${d} L${sx(2021.48)} 380 L${sx(2017.72)} 380Z`} fill={C.teal} opacity={0.14} clipPath="url(#jclip)" />
      <path d={d} stroke={C.teal} strokeWidth={3} fill="none" strokeLinejoin="round" clipPath="url(#jclip)" />
      {ms.map((m, i) => (
        <g key={i} className={vis(b >= i)}>
          <Node x={sx(m.x)} y={sy(m.v)} r={9} />
          <Pill x={sx(m.x) + (i === 0 ? 40 : -6)} y={sy(m.v) - 22} text={m.l} color={C.teal} size={12.5} />
        </g>
      ))}
      {/* LUNA: the stuck link */}
      <g className={vis(b >= 3)}>
        <rect x={250} y={426} width={366} height={122} rx={16} fill="#fff" stroke={C.warn} strokeWidth={2} filter="url(#soft)" />
        <path d="M272 446 L340 452 L380 470 L420 500 L460 520 L520 532 L596 536" stroke={C.ink} strokeWidth={2.6} fill="none" />
        <path d="M272 446 L340 452 L380 470 L410 490 L596 490" stroke={C.warn} strokeWidth={3} fill="none" />
        <path d="M410 490 L596 490 L596 536 L520 532 L460 520 L420 500Z" fill={C.warn} opacity={0.16} />
        <T x={592} y={482} size={12.5} anchor="end" weight={800} color={C.warn}>
          {s.ms[3]}
        </T>
        <T x={438} y={545} size={11.5} anchor="middle" weight={700}>
          {s.luna}
        </T>
      </g>
    </g>
  );
}

/* 10 — banks and CRE */
function Banks({ b, t }: SceneProps) {
  const s = t.scenes;
  const statusColor = [C.guard, C.sign, C.amber];
  const Bank = ({ y, i }: { y: number; i: number }) => (
    <g className={vis(b >= Math.min(i, 2))}>
      <polygon points={`24,${y + 18} 94,${y - 8} 164,${y + 18}`} fill="#fff" stroke={C.ink} strokeWidth={2} />
      <rect x={34} y={y + 18} width={120} height={64} fill="#fff" stroke={C.ink} strokeWidth={2} />
      {[0, 1, 2, 3].map((k) => (
        <rect key={k} x={46 + k * 27} y={y + 26} width={10} height={48} fill={C.line} />
      ))}
      <T x={94} y={y + 104} size={15} weight={800}>
        {s.banks[i].n}
      </T>
      <T x={94} y={y + 122} size={11.5} weight={700} color={statusColor[i]}>
        {s.banks[i].s}
      </T>
    </g>
  );
  const hub = { x: 340, y: 270 };
  return (
    <g>
      <Bank y={40} i={0} />
      <Bank y={210} i={1} />
      <Bank y={380} i={2} />
      <Glass x={500} y={110} w={110} h={100} label={s.chains[0]} />
      <Glass x={500} y={330} w={110} h={100} label={s.chains[2]} />
      {/* direct links before CRE */}
      <g style={{ opacity: b >= 2 ? 0 : 1, transition: "opacity .5s" }}>
        <Chain x1={164} y1={100} x2={500} y2={160} r={8} color={C.guard} on={b >= 0} />
        <Chain x1={164} y1={270} x2={500} y2={380} r={8} color={C.sign} on={b >= 1} />
      </g>
      {/* CRE: one control room */}
      <g className={vis(b >= 2)}>
        <Chain x1={164} y1={100} x2={hub.x - 40} y2={hub.y - 30} r={7} color={C.guard} on={b >= 2} />
        <Chain x1={164} y1={270} x2={hub.x - 50} y2={hub.y} r={7} color={C.sign} on={b >= 2} />
        <g opacity={0.7}>
          <Chain x1={164} y1={440} x2={hub.x - 40} y2={hub.y + 30} r={7} color={C.amber} on={b >= 2} />
        </g>
        <Chain x1={hub.x + 40} y1={hub.y - 30} x2={500} y2={160} r={7} on={b >= 2} />
        <Chain x1={hub.x + 40} y1={hub.y + 30} x2={500} y2={380} r={7} on={b >= 2} />
        <circle cx={hub.x} cy={hub.y} r={58} fill="#fff" stroke={C.blue} strokeWidth={3} filter="url(#soft)" />
        <Coin x={hub.x} y={hub.y - 6} r={20} label="" />
        <T x={hub.x} y={hub.y + 34} size={12} weight={800} color={C.blueDeep}>
          CRE
        </T>
        {s.creParts.map((c, k) => {
          const a = (-135 + k * 90) * (Math.PI / 180);
          return <Pill key={c} x={hub.x + 92 * Math.cos(a)} y={hub.y + 84 * Math.sin(a)} text={c} color={C.blue} size={11.5} />;
        })}
        <T x={hub.x} y={hub.y + 130} size={13} weight={700} color={C.blueDeep}>
          {s.cre}
        </T>
      </g>
    </g>
  );
}

/* 11 — today */
function Today({ b, t }: SceneProps) {
  const s = t.scenes;
  return (
    <g>
      {s.tiles.map((x, i) => (
        <g key={x.l} className={vis(i < 2 ? true : b >= 1)}>
          <rect x={24 + i * 202} y={40} width={188} height={96} rx={16} fill="#fff" stroke={C.line} filter="url(#soft)" />
          <T x={40 + i * 202} y={88} size={28} anchor="start" weight={800} color={i === 1 ? C.warn : C.ink}>
            {x.v}
          </T>
          <T x={40 + i * 202} y={116} size={12} anchor="start" color={C.mute} weight={500}>
            {x.l}
          </T>
        </g>
      ))}
      <rect x={24} y={160} width={592} height={250} rx={16} fill="#fff" stroke={C.line} />
      <path d="M44 380 C 180 360, 330 300, 596 190" stroke={C.sign} strokeWidth={4} fill="none" />
      <path d="M44 250 C 120 230, 170 330, 260 300 S 420 220, 470 230 S 560 370, 596 384" stroke={C.warn} strokeWidth={4} fill="none" />
      <T x={592} y={182} size={15} anchor="end" weight={800} color={C.sign}>
        {s.usage} ↑
      </T>
      <T x={592} y={402} size={15} anchor="end" weight={800} color={C.warn}>
        {s.price} ↓
      </T>
      <g className={vis(b >= 2)}>
        <T x={24} y={448} size={15} anchor="start" weight={800} color={C.blueDeep}>
          {s.share}
        </T>
        <rect x={24} y={462} width={592} height={20} rx={10} fill="#e8edf2" />
        <rect x={24} y={462} width={592 * 0.6} height={20} rx={10} fill={C.blue} opacity={0.35} />
        <rect x={24 + 592 * 0.6} y={462} width={592 * 0.24} height={20} rx={4} fill={C.blue} />
        <T x={24} y={510} size={13} anchor="start" color={C.mute} weight={600}>
          {s.rivals}
        </T>
      </g>
    </g>
  );
}

/* 12 — strong and weak links */
function Verdict({ b, t }: SceneProps) {
  const s = t.scenes;
  const Row = ({ y, items, color, cracked, on }: { y: number; items: string[]; color: string; cracked?: boolean; on: boolean }) => (
    <g className={vis(on)}>
      <Chain x1={60} y1={y} x2={580} y2={y} r={12} color={color} on={on} broken={cracked} />
      {items.map((l, i) => (
        <g key={l}>
          <polygon points={hexPts(60 + i * 130, y, 30)} fill="#fff" stroke={color} strokeWidth={8} />
          {cracked && <path d={`M${50 + i * 130} ${y - 26} l12 18 l-8 10 l10 20`} stroke="#fff" strokeWidth={4} fill="none" />}
          <foreignObject x={i * 130} y={y + 40} width={120} height={60}>
            <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2, textAlign: "center", color: cracked ? C.warn : C.ink }}>{l}</div>
          </foreignObject>
        </g>
      ))}
    </g>
  );
  return (
    <g>
      <Row y={130} items={s.strong} color={C.blue} on />
      <Row y={360} items={s.weak} color={C.warn} cracked on={b >= 1} />
    </g>
  );
}

/* 13 — the chain is not the token */
function Finale({ b, t }: SceneProps) {
  const s = t.scenes;
  const cx = 230,
    cy = 230,
    R = 150;
  const pos = s.chains.map((_, i) => {
    const a = (-90 + i * 72) * (Math.PI / 180);
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
  });
  return (
    <g>
      {pos.map((a, i) => {
        const z = pos[(i + 1) % pos.length];
        return <Chain key={i} x1={a.x} y1={a.y} x2={z.x} y2={z.y} r={8} />;
      })}
      {pos.map((a, i) => (
        <Glass key={i} x={a.x - 38} y={a.y - 28} w={76} h={56} label={s.chains[i]} />
      ))}
      <Node x={cx} y={cy} r={26} ring={C.sky} />
      <T x={cx} y={cy + 52} size={15} weight={800} color={C.blueDeep}>
        {s.chain}
      </T>
      <g className={vis(b >= 1)}>
        <T x={448} y={244} size={44} weight={800} color={C.warn}>
          {s.neq}
        </T>
        <Coin x={548} y={226} r={36} label="" />
        <T x={548} y={292} size={15} weight={800} color={C.blueDeep}>
          {s.token}
        </T>
        {s.watch.map((w, i) => (
          <Pill key={w} x={110 + i * 210} y={500} text={`${i + 1}. ${w}`} color={C.amber} size={14} />
        ))}
      </g>
    </g>
  );
}

export const SCENES = [Missing, NoChain, Ocr, PushPull, Proofs, Ccip, Alarm, Flows, Journey, Banks, Today, Verdict, Finale];
