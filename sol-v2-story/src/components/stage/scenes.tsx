"use client";
/**
 * Twelve scenes for "The Ship of Light". Each scene is drawn in a 640 × 560 box and
 * reveals its parts as the beat number grows (b = 0, 1, 2…). Motion loops run by
 * themselves (SVG animate), so the stage plays without any input.
 */
import type { Dict } from "@/data/coins/sol/translations";
import { C } from "@/data/coins/sol/chapters";
import { asset } from "@/lib/asset";
import { Beam, Card, Check, Cross, MiniShip, Particle, Phone, Pill, Ship, Stars, Streaks, T, Tile, Validator, vis } from "./kit";

type P = { b: number; p: number; t: Dict };

const VCOL = [C.purple, C.cyan, C.mint, C.amber];

/* 1 — one beam of light */
function Launch({ b, t }: P) {
  const s = t.scenes;
  const race = s.race;
  return (
    <g>
      <Stars />
      <Streaks y0={70} y1={330} n={7} />
      <g transform={b >= 2 ? "translate(0 -40)" : "translate(0 70)"} style={{ transition: "transform .6s" }}>
        <Phone x={86} y={190} label={s.customer} screen={s.pay} sub={s.sent} color={C.purple} />
        <Phone x={554} y={190} label={s.nhi} screen={b >= 1 ? s.got : "…"} sub={b >= 1 ? s.received : s.waiting} color={C.mint} ok={b >= 1} />
        <Beam x1={124} y1={182} x2={262} y2={182} dur={0.9} />
        <Beam x1={378} y1={182} x2={516} y2={182} dur={0.9} delay={0.45} />
        <Ship x={318} y={182} s={1.05} trail={0.6} />
        <g className={vis(b >= 1)}>
          <Pill x={320} y={92} text={s.timer} color={C.mint} size={15} />
          <Pill x={320} y={290} text={s.fee} color={C.violet} size={13} />
        </g>
      </g>
      <g className={vis(b >= 2)}>
        {race.map((r, i) => {
          const y = 368 + i * 58;
          const col = i === 2 ? C.purple : C.mute;
          const dur = [26, 7, 1.1][i];
          const tiles = [1, 3, 14][i];
          return (
            <g key={r.n}>
              <T x={40} y={y + 5} anchor="start" size={14} weight={800} color={i === 2 ? C.violet : C.ink}>
                {r.n}
              </T>
              <T x={40} y={y + 23} anchor="start" size={11.5} weight={600} color={C.mute}>
                {r.v}
              </T>
              <line x1={170} y1={y} x2={604} y2={y} stroke={C.line} strokeWidth={10} strokeLinecap="round" />
              {Array.from({ length: tiles }, (_, k) => (
                <rect key={k} x={176 + (k * 420) / Math.max(1, tiles)} y={y - 7} width={i === 2 ? 22 : 30} height={14} rx={4} fill={col} opacity={0.18 + (i === 2 ? 0.5 : 0.3)} />
              ))}
              <circle r={8} cy={y} fill={i === 2 ? C.green : "#fff"} stroke={col} strokeWidth={2.5}>
                <animate attributeName="cx" values="176;600" dur={`${dur}s`} repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}
        <T x={604} y={540} anchor="end" size={11} weight={500} color={C.mute}>
          {s.raceNote}
        </T>
      </g>
    </g>
  );
}

/* 2 — the rota */
function Rota({ b, t }: P) {
  const s = t.scenes;
  const xs = [110, 250, 390, 530];
  const stake = [0.95, 0.55, 0.75, 0.35];
  const LOOP = 8;
  return (
    <g>
      <Stars seed={11} />
      {xs.map((x, i) => (
        <g key={i}>
          <rect x={x - 33} y={67} width={66} height={66} rx={18} fill="none" stroke={VCOL[i]} strokeWidth={3.5} opacity={0}>
            <animate attributeName="opacity" calcMode="discrete" dur={`${LOOP}s`} repeatCount="indefinite" values={i === 0 ? "1;0" : i === 3 ? "0;1" : "0;1;0"} keyTimes={i === 0 ? "0;0.25" : i === 3 ? "0;0.75" : `0;${i / 4};${(i + 1) / 4}`} />
          </rect>
          <Validator x={x} y={100} color={VCOL[i]} label={s.vals[i]} />
        </g>
      ))}
      <T x={320} y={38} size={13} weight={700} color={C.violet}>
        {s.leaderNow}
      </T>
      <g className={vis(b === 0)}>
        <Card x={150} y={200} w={340} h={74} stroke={C.violet}>
          <T x={320} y={230} size={16} weight={800} color={C.violet}>
            {s.leader}
          </T>
          <T x={320} y={254} size={13} color={C.mute}>
            {s.leadDo}
          </T>
        </Card>
      </g>
      <g className={vis(b >= 1)}>
        {xs.map((x, i) => (
          <g key={i}>
            <rect x={x - 14} y={250 - 80 * stake[i]} width={28} height={80 * stake[i]} rx={6} fill={VCOL[i]} opacity={0.8} />
          </g>
        ))}
        <line x1={60} y1={252} x2={580} y2={252} stroke={C.line} strokeWidth={2} />
        <T x={60} y={272} anchor="start" size={12} color={C.mute}>
          {s.stake}
        </T>
        <T x={580} y={272} anchor="end" size={12} weight={700} color={C.violet}>
          {s.moreTurns}
        </T>
      </g>
      <g className={vis(b === 1)}>
        <Card x={120} y={330} w={400} h={110} stroke={C.violet}>
          <T x={320} y={372} size={20} weight={800} color={C.violet}>
            {s.epoch}
          </T>
          <T x={320} y={402} size={13} color={C.mute}>
            {s.fixed}
          </T>
        </Card>
      </g>
      <g className={vis(b >= 2)}>
        {Array.from({ length: 16 }, (_, k) => {
          const v = Math.floor(k / 4);
          return <Tile key={k} x={40 + k * 35.5} y={360} w={30} h={34} color={VCOL[v]} label={String(k + 1)} />;
        })}
        {[0, 1, 2, 3].map((v) => (
          <g key={v}>
            <path d={`M${42 + v * 142} 410 v8 h${138} v-8`} fill="none" stroke={VCOL[v]} strokeWidth={2} />
            <T x={111 + v * 142} y={436} size={12} weight={700} color={VCOL[v]}>
              {s.vals[v]}
            </T>
          </g>
        ))}
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0; 568 0" dur={`${LOOP}s`} repeatCount="indefinite" />
          <MiniShip x={56} y={340} />
        </g>
        <Pill x={320} y={490} text={s.four} color={C.violet} size={15} />
      </g>
    </g>
  );
}

/* 3 — no waiting room */
function Direct({ b, t }: P) {
  const s = t.scenes;
  const dots = Array.from({ length: 26 }, (_, i) => ({ x: 52 + ((i * 47) % 200), y: 190 + ((i * 31) % 150) }));
  return (
    <g>
      <Stars seed={5} />
      {/* left: waiting room */}
      <g opacity={b >= 1 ? 0.55 : 1} style={{ transition: "opacity .5s" }}>
        <T x={150} y={120} size={15} weight={800}>
          {s.others}
        </T>
        <rect x={36} y={160} width={232} height={200} rx={20} fill="#fff" stroke={C.mute} strokeWidth={2} strokeDasharray="7 6" />
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={7} fill={i % 3 ? "#cfc6e6" : "#b9aee0"}>
            <animate attributeName="cy" values={`${d.y};${d.y - 4};${d.y}`} dur={`${1.4 + (i % 5) * 0.2}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <T x={150} y={390} size={13} weight={700} color={C.mute}>
          {s.mempool}
        </T>
        <T x={150} y={410} size={12} color={C.mute}>
          {s.wait}
        </T>
      </g>
      <line x1={320} y1={110} x2={320} y2={500} stroke={C.line} strokeWidth={2} strokeDasharray="4 6" />
      {/* right: straight to the leaders */}
      <g className={vis(b >= 1)}>
        <T x={480} y={70} size={15} weight={800} color={C.violet}>
          {s.solana}
        </T>
        <Validator x={400} y={150} s={1.1} color={C.purple} label={s.now} lead />
        <Validator x={490} y={150} s={0.85} color={C.cyan} label={s.next1} />
        <Validator x={572} y={150} s={0.75} color={C.mint} label={s.next2} />
        <Phone x={486} y={380} label={s.wallet} screen="20 USDC" color={C.purple} />
        <Beam x1={474} y1={322} x2={404} y2={186} dur={0.8} />
        <Beam x1={486} y1={322} x2={490} y2={186} dur={0.9} delay={0.2} width={3} />
        <Beam x1={498} y1={322} x2={570} y2={186} dur={1} delay={0.4} width={2.5} />
      </g>
      <g className={vis(b >= 2)}>
        <Pill x={480} y={498} text={s.expiry} color={C.amber} size={13} />
        <Pill x={480} y={532} text={s.expired} color={C.mute} size={11.5} bold={false} />
      </g>
    </g>
  );
}

/* 4 — the counter */
function Clock({ b, t }: P) {
  const s = t.scenes;
  const cells = Array.from({ length: 12 }, (_, i) => 1199 + i);
  const fmt = (n: number) => n.toLocaleString(t.ui.locale);
  const CW = 54;
  const tape = (
    <g>
      {cells.map((n, i) => {
        const mark = n === 1204 || n === 1207;
        return (
          <g key={n}>
            <rect x={i * CW} y={0} width={CW - 6} height={44} rx={8} fill={mark && b >= 1 ? (n === 1204 ? C.purple : C.cyan) : "#fff"} stroke={C.violet} strokeWidth={1.6} />
            <text x={i * CW + (CW - 6) / 2} y={27} textAnchor="middle" fontSize={12.5} fontWeight={800} fill={mark && b >= 1 ? "#fff" : C.ink}>
              {fmt(n)}
            </text>
            {i < cells.length - 1 && <path d={`M${i * CW + CW - 6} 22 h6`} stroke={C.violet} strokeWidth={2} />}
          </g>
        );
      })}
    </g>
  );
  return (
    <g>
      <Stars seed={3} />
      <g opacity={b >= 2 ? 0.35 : 1} style={{ transition: "opacity .5s" }}>
        <T x={320} y={96} size={13} weight={700} color={C.violet}>
          {s.hashChain}
        </T>
        <g transform="translate(-6 150)">
          {b === 0 ? (
            <g>
              <animateTransform attributeName="transform" type="translate" values="0 0; -108 0" dur="2.4s" repeatCount="indefinite" />
              {tape}
            </g>
          ) : (
            tape
          )}
        </g>
        <T x={320} y={232} size={13} color={C.mute}>
          {s.waits}
        </T>
        <g className={vis(b >= 1)}>
          <path d={`M${5 * CW + 18} 150 v-22`} stroke={C.purple} strokeWidth={2} />
          <Pill x={5 * CW + 18} y={118} text={s.txA} color={C.purple} size={12} />
          <path d={`M${8 * CW + 18} 150 v-22`} stroke={C.cyan} strokeWidth={2} />
          <Pill x={8 * CW + 26} y={118} text={s.txB} color={C.cyan} size={12} />
          <Pill x={320} y={274} text={s.first} color={C.violet} size={13.5} />
          {[0, 1, 2].map((k) => (
            <g key={k}>
              <path d={`M${110 + k * 200} 300 v-40`} stroke={C.line} strokeWidth={2} strokeDasharray="3 4" />
              <Validator x={110 + k * 200} y={332} s={0.72} color={VCOL[k]} />
              <Check x={136 + k * 200} y={312} r={9} />
            </g>
          ))}
          <T x={320} y={384} size={12.5} weight={700} color={C.mint}>
            {s.check}
          </T>
        </g>
      </g>
      <g className={vis(b >= 2)}>
        <Card x={86} y={300} w={468} h={196} stroke={C.purple}>
          <T x={320} y={336} size={17} weight={800} color={C.violet}>
            {s.alpen}
          </T>
          <T x={320} y={360} size={12.5} color={C.mute}>
            {s.noCounter}
          </T>
          <T x={118} y={394} anchor="start" size={12.5} weight={700}>
            {s.finality}
          </T>
          <rect x={118} y={406} width={404} height={20} rx={10} fill="#eee9f7" />
          <rect x={118} y={406} width={404} height={20} rx={10} fill={C.mute} opacity={0.45} />
          <T x={514} y={421} anchor="end" size={11.5} weight={700} color="#fff">
            {s.before}
          </T>
          <rect x={118} y={440} width={404} height={20} rx={10} fill="#eee9f7" />
          <rect x={118} y={440} width={Math.max(14, 404 * (0.15 / 12.8))} height={20} rx={10} fill="url(#gSol)" />
          <T x={142} y={455} anchor="start" size={11.5} weight={800} color={C.mint}>
            {s.after}
          </T>
        </Card>
      </g>
    </g>
  );
}

/* 5 — blocks in pieces */
function Shreds({ b, t }: P) {
  const s = t.scenes;
  const L1 = [150, 280, 410];
  const L2 = [110, 160, 210, 255, 300, 345, 390, 440, 490];
  return (
    <g>
      <Stars seed={9} />
      <g className={vis(b === 0)}>
        <rect x={80} y={170} width={150} height={150} rx={14} fill={C.lilac} stroke={C.purple} strokeWidth={2.4} />
        <T x={155} y={350} size={14} weight={800} color={C.violet}>
          {s.block}
        </T>
        <path d="M250 245 h50" stroke={C.purple} strokeWidth={3} markerEnd="" />
        <polygon points="300,236 316,245 300,254" fill={C.purple} />
        {Array.from({ length: 12 }, (_, k) => {
          const x = 336 + (k % 4) * 52;
          const y = 160 + Math.floor(k / 4) * 52;
          const lost = k === 6;
          return (
            <g key={k}>
              <rect x={x} y={y} width={42} height={42} rx={8} fill={lost ? "#fff" : C.purple} stroke={lost ? C.warn : C.purple} strokeWidth={2} strokeDasharray={lost ? "5 4" : undefined} opacity={lost ? 1 : 0.85} />
              {lost && <Cross x={x + 21} y={y + 21} r={9} />}
            </g>
          );
        })}
        {[0, 1, 2].map((k) => (
          <rect key={k} x={336 + k * 52} y={330} width={42} height={42} rx={8} fill={C.green} opacity={0.75} stroke={C.mint} strokeWidth={2} />
        ))}
        <T x={344} y={398} anchor="start" size={12.5} weight={700} color={C.mint}>
          {s.spare}
        </T>
        <Pill x={320} y={460} text={s.rebuilt} color={C.mint} size={13} />
      </g>
      <g className={vis(b >= 1)} opacity={b >= 2 ? 0.3 : 1} style={{ transition: "opacity .5s" }}>
        <Validator x={70} y={280} s={1} color={C.purple} label={s.leader1} lead />
        {L1.map((y, i) => (
          <g key={i}>
            <path d={`M96 280 L270 ${y}`} stroke={C.line} strokeWidth={2.5} />
            <Particle path={`M96 280 L270 ${y}`} dur={1.1} delay={i * 0.2} r={5} color={C.purple} />
          </g>
        ))}
        {L2.map((y, j) => {
          const from = L1[Math.floor(j / 3)];
          return (
            <g key={j}>
              <path d={`M300 ${from} L470 ${y}`} stroke={C.line} strokeWidth={1.6} />
              <Particle path={`M300 ${from} L470 ${y}`} dur={1.1} delay={0.6 + j * 0.08} r={3.5} color={C.cyan} />
              <Validator x={486} y={y} s={0.42} color={C.mint} />
            </g>
          );
        })}
        {L1.map((y, i) => (
          <Validator key={i} x={285} y={y} s={0.66} color={C.cyan} />
        ))}
        <T x={285} y={474} size={12} weight={700} color={C.cyan}>
          {s.layer1}
        </T>
        <T x={486} y={518} size={12} weight={700} color={C.mint}>
          {s.layer2}
        </T>
        <T x={586} y={290} size={22} weight={800} color={C.mute}>
          …
        </T>
        <Pill x={320} y={60} text={s.fan} color={C.violet} size={13} />
      </g>
      <g className={vis(b >= 2)}>
        <Card x={120} y={170} w={400} h={210} stroke={C.warn}>
          <g className="wobble">
            <rect x={176} y={206} width={120} height={120} rx={12} fill="url(#hatch)" stroke={C.warn} strokeWidth={2.5} />
          </g>
          <T x={236} y={350} size={13} weight={800} color={C.warn}>
            {s.huge}
          </T>
          <rect x={376} y={290} width={24} height={24} rx={5} fill={C.purple} opacity={0.85} />
          <T x={388} y={350} size={12} weight={600} color={C.mute}>
            {s.normal}
          </T>
        </Card>
        <Pill x={320} y={420} text={s.halt} color={C.warn} size={14} />
      </g>
    </g>
  );
}

/* 6 — many lanes */
function Lanes({ b, t }: P) {
  const s = t.scenes;
  const ys = [150, 220, 290, 360];
  const memeQueued = b >= 2;
  return (
    <g>
      <Stars seed={13} />
      {ys.map((y, i) => (
        <g key={i}>
          <rect x={110} y={y - 22} width={500} height={44} rx={22} fill="#fff" stroke={C.line} strokeWidth={1.6} />
          <T x={96} y={y + 5} anchor="end" size={12} weight={700} color={C.mute}>
            {s.core} {i + 1}
          </T>
        </g>
      ))}
      <T x={360} y={100} size={13} weight={700} color={C.violet}>
        {b === 0 ? s.touches : s.parallel}
      </T>
      {ys.map((y, i) => {
        const queued = memeQueued && i === 3;
        const label = queued ? s.meme : s.txs[i];
        const col = queued ? C.warn : VCOL[i];
        if (b === 0) {
          return (
            <g key={i}>
              <rect x={130} y={y - 15} width={128} height={30} rx={15} fill={col} />
              <T x={194} y={y + 5} size={12} weight={700} color="#fff">
                {label}
              </T>
            </g>
          );
        }
        return (
          <g key={i + (queued ? "q" : "")}>
            {(queued ? [0, 1] : [0]).map((k) => (
              <g key={k}>
                <animateTransform attributeName="transform" type="translate" values={`0 0; ${queued ? 300 : 340} 0`} dur={queued ? "5s" : "2.2s"} begin={`${queued ? k * 2.5 : i * 0.15}s`} repeatCount="indefinite" />
                <rect x={130} y={y - 15} width={128} height={30} rx={15} fill={col} opacity={queued && k ? 0.75 : 1} />
                <T x={194} y={y + 5} size={12} weight={700} color="#fff">
                  {label}
                </T>
              </g>
            ))}
          </g>
        );
      })}
      <g className={vis(b >= 2)}>
        <Pill x={360} y={404} text={s.same} color={C.warn} size={12.5} />
      </g>
      <g className={vis(b >= 1)}>
        <T x={110} y={452} anchor="start" size={13} weight={800}>
          {s.eth}
        </T>
        <rect x={110} y={466} width={500} height={44} rx={22} fill="#fff" stroke={C.line} strokeWidth={1.6} />
        {[0, 1, 2, 3].map((k) => (
          <g key={k}>
            <animateTransform attributeName="transform" type="translate" values="0 0; 360 0" dur="8.8s" begin={`${k * 2.2}s`} repeatCount="indefinite" />
            <rect x={122} y={473} width={110} height={30} rx={15} fill={C.mute} opacity={0.55} />
          </g>
        ))}
      </g>
    </g>
  );
}

/* 7 — fees */
function Fees({ b, t }: P) {
  const s = t.scenes;
  return (
    <g>
      <Stars seed={17} />
      <g opacity={b >= 2 ? 0.3 : 1} style={{ transition: "opacity .5s" }}>
        <g className={vis(true)}>
          <circle cx={200} cy={120} r={34} fill="#fff" stroke={C.amber} strokeWidth={3} filter="url(#soft)" />
          <T x={200} y={126} size={16} weight={800} color={C.amber}>
            SOL
          </T>
          <T x={200} y={180} size={12.5} weight={700}>
            {s.base}
          </T>
          <path d="M180 196 C 150 230, 110 240, 100 268" fill="none" stroke={C.fire} strokeWidth={3} strokeDasharray="5 5" className="flow" />
          <path d="M220 196 C 250 230, 290 240, 300 268" fill="none" stroke={C.violet} strokeWidth={3} strokeDasharray="5 5" className="flow" />
          <T x={100} y={300} size={34}>
            🔥
          </T>
          <T x={100} y={328} size={13} weight={800} color={C.fire}>
            {s.burn}
          </T>
          <Validator x={300} y={296} s={0.8} color={C.violet} />
          <T x={300} y={340} size={13} weight={800} color={C.violet}>
            {s.toLeader}
          </T>
        </g>
        <g className={vis(b >= 1)}>
          <circle cx={490} cy={120} r={34} fill={C.amber} stroke="#fff" strokeWidth={3} filter="url(#soft)" />
          <T x={490} y={127} size={20} weight={800} color="#fff">
            ⚡
          </T>
          <T x={490} y={180} size={12.5} weight={700}>
            {s.prio}
          </T>
          <path d="M490 196 C 490 230, 380 250, 330 280" fill="none" stroke={C.amber} strokeWidth={3.5} strokeDasharray="5 5" className="flow" />
          <Pill x={490} y={236} text={s.prioAll} color={C.amber} size={12} />
        </g>
      </g>
      <g className={vis(b >= 2)}>
        <T x={60} y={392} anchor="start" size={13} weight={800}>
          {s.blockCap}
        </T>
        <rect x={60} y={404} width={520} height={56} rx={12} fill="#fff" stroke={C.line} strokeWidth={1.6} />
        <rect x={60} y={404} width={520 * 0.12} height={56} rx={12} fill="url(#hatch)" stroke={C.warn} strokeWidth={2} />
        {Array.from({ length: 22 }, (_, k) => (
          <rect key={k} x={128 + k * 20.5} y={414} width={16} height={36} rx={4} fill={VCOL[k % 4]} opacity={0.75} />
        ))}
        <rect x={128 + 5 * 20.5 - 2} y={410} width={20} height={44} rx={5} fill="none" stroke={C.mint} strokeWidth={3} />
        <path d="M91 404 v-24" stroke={C.warn} strokeWidth={2} />
        <Pill x={140} y={364} text={s.hot} color={C.warn} size={12} />
        <T x={370} y={490} size={12.5} weight={600} color={C.mute}>
          {s.otherTx}
        </T>
        <Pill x={240} y={520} text={s.nhiTx} color={C.mint} size={12.5} />
      </g>
    </g>
  );
}

/* 8 — when it stopped */
function Stops({ b, t }: P) {
  const s = t.scenes;
  const X0 = 50;
  const W = 540;
  const tx = (yr: number) => X0 + ((yr - 2021) / (2026.95 - 2021)) * W;
  const ev = s.events;
  const at = [2021.7, 2022.33, 2023.15, 2024.1];
  const show = (i: number) => (i < 2 ? true : b >= 1);
  return (
    <g>
      <Stars seed={21} />
      <line x1={X0} y1={300} x2={X0 + W} y2={300} stroke={C.line} strokeWidth={6} strokeLinecap="round" />
      {[2021, 2022, 2023, 2024, 2025, 2026].map((yr) => (
        <g key={yr}>
          <line x1={tx(yr)} y1={292} x2={tx(yr)} y2={308} stroke={C.mute} strokeWidth={1.5} />
          <T x={tx(yr)} y={330} size={12} color={C.mute}>
            {yr}
          </T>
        </g>
      ))}
      {ev.map((e, i) => {
        const r = 8 + e.h * 1.3;
        const up = i % 2 === 0;
        return (
          <g key={i} className={vis(show(i))}>
            <circle cx={at[i] && tx(at[i])} cy={300} r={r} fill={C.warn} opacity={0.18} />
            <circle cx={tx(at[i])} cy={300} r={7} fill={C.warn} />
            <line x1={tx(at[i])} y1={up ? 300 - r : 300 + r} x2={tx(at[i])} y2={up ? 196 : 404} stroke={C.warn} strokeWidth={1.4} strokeDasharray="3 3" />
            <T x={tx(at[i])} y={up ? 150 : 430} size={20} weight={800} color={C.warn}>
              {e.h} {s.hours}
            </T>
            <T x={tx(at[i])} y={up ? 172 : 452} size={12} weight={700}>
              {e.d}
            </T>
            <T x={tx(at[i])} y={up ? 190 : 470} size={11.5} color={C.mute}>
              {e.why}
            </T>
          </g>
        );
      })}
      <g className={vis(b >= 2)}>
        <rect x={tx(2024.1)} y={293} width={tx(2026.88) - tx(2024.1)} height={14} rx={7} fill="url(#gSol)" />
        <Pill x={(tx(2024.4) + tx(2026.88)) / 2 + 20} y={250} text={s.streak} color={C.mint} size={14} />
        <T x={(tx(2024.4) + tx(2026.88)) / 2 + 20} y={226} size={11.5} color={C.mute}>
          {s.since}
        </T>
        <g>
          <animateTransform attributeName="transform" type="translate" values={`${tx(2024.2)} 300; ${tx(2026.8)} 300`} dur="4s" repeatCount="indefinite" />
          <MiniShip x={0} y={0} s={0.28} />
        </g>
      </g>
    </g>
  );
}

/* 9 — an expensive engine */
function Engine({ b, t }: P) {
  const s = t.scenes;
  const bars = s.bars;
  const max = 2560;
  return (
    <g>
      <Stars seed={23} />
      <g className={vis(b === 0)}>
        <Card x={60} y={110} w={300} h={260} stroke={C.violet}>
          <T x={210} y={146} size={15} weight={800} color={C.violet}>
            {s.specTitle}
          </T>
          {s.spec.map((row, i) => (
            <g key={i}>
              <rect x={84} y={166 + i * 46} width={252} height={36} rx={10} fill={C.lilac} />
              <T x={210} y={189 + i * 46} size={13.5} weight={700}>
                {row}
              </T>
            </g>
          ))}
        </Card>
        <g transform="translate(470 220)">
          <rect x={-70} y={-40} width={140} height={86} rx={8} fill="#fff" stroke={C.mute} strokeWidth={2} />
          <rect x={-86} y={46} width={172} height={10} rx={5} fill={C.mute} opacity={0.5} />
        </g>
        <T x={470} y={312} size={12.5} weight={600} color={C.mute}>
          {s.laptop}
        </T>
      </g>
      <g className={vis(b === 1)}>
        <T x={320} y={96} size={14} weight={800}>
          {s.count}
        </T>
        {bars.map((d, i) => {
          const h = (d.v / max) * 260;
          const x = 130 + i * 150;
          return (
            <g key={i}>
              <rect x={x} y={400 - h} width={90} height={h} rx={10} fill={i === 2 ? C.purple : C.violet} opacity={i === 2 ? 1 : 0.55} />
              <T x={x + 45} y={392 - h} size={17} weight={800} color={C.violet}>
                {d.v.toLocaleString(t.ui.locale)}
              </T>
              <T x={x + 45} y={424} size={12.5} weight={600} color={C.mute}>
                {d.d}
              </T>
            </g>
          );
        })}
        <Pill x={320} y={480} text={s.halt18} color={C.warn} size={13} />
      </g>
      <g className={vis(b >= 2)}>
        <T x={320} y={150} size={14} weight={800}>
          {s.switch}
        </T>
        <rect x={70} y={180} width={500} height={56} rx={14} fill={C.violet} opacity={0.9} />
        <T x={320} y={214} size={14} weight={800} color="#fff">
          {s.agave}
        </T>
        <rect x={190} y={290} width={260} height={56} rx={14} fill="#fff" stroke={C.amber} strokeWidth={2.4} strokeDasharray="7 5" />
        <T x={320} y={324} size={14} weight={800} color={C.amber}>
          {s.fire}
        </T>
        <T x={320} y={372} size={12.5} weight={600} color={C.mute}>
          {s.fireNote}
        </T>
        <Pill x={320} y={440} text={s.oneBug} color={C.warn} size={12.5} />
      </g>
    </g>
  );
}

/* 10 — faster in 2026 */
function Faster({ b, t }: P) {
  const s = t.scenes;
  const g = s.gauges;
  const frac = [
    [0.6, 1],
    [1, 0.5],
    [1, 0.15 / 12.8],
  ];
  return (
    <g>
      <Stars seed={29} />
      <Streaks y0={40} y1={90} n={4} dur={1} />
      <Ship x={430} y={64} s={0.5} trail={1.2} />
      {g.map((row, i) => {
        const y = 150 + i * 130;
        const [a, z] = frac[i];
        return (
          <g key={i} className={vis(b >= i)}>
            <T x={60} y={y} anchor="start" size={15} weight={800}>
              {row.t}
            </T>
            <T x={580} y={y} anchor="end" size={12} weight={600} color={C.mute}>
              {row.d}
            </T>
            <rect x={60} y={y + 14} width={520} height={22} rx={11} fill="#eee9f7" />
            <rect x={60} y={y + 14} width={520 * a} height={22} rx={11} fill={C.mute} opacity={0.5} />
            <T x={68} y={y + 30} anchor="start" size={11.5} weight={700} color="#fff">
              {s.beforeL}: {row.a}
            </T>
            <rect x={60} y={y + 46} width={520} height={22} rx={11} fill="#eee9f7" />
            <rect x={60} y={y + 46} width={Math.max(16, 520 * z)} height={22} rx={11} fill="url(#gSol)" />
            <T x={i === 2 ? 84 : 68} y={y + 62} anchor="start" size={11.5} weight={800} color={i === 2 ? C.mint : "#fff"}>
              {s.afterL}: {row.b}
            </T>
          </g>
        );
      })}
      <g className={vis(b >= 2)}>
        <T x={580} y={530} anchor="end" size={11.5} color={C.mute}>
          {s.sample}
        </T>
      </g>
    </g>
  );
}

/* 11 — the SOL token */
function Token({ b, t }: P) {
  const s = t.scenes;
  // illustrative issuance paths from 3.60% (2026)
  const yrs = [2026, 2027, 2028, 2029, 2030, 2031, 2032];
  const path = (k: number) => yrs.map((_, i) => Math.max(1.5, 3.6 * Math.pow(k, i)));
  const X = (i: number) => 90 + i * 80;
  const Y = (v: number) => 470 - ((v - 1) / 3) * 200;
  const line = (vals: number[]) => vals.map((v, i) => `${i ? "L" : "M"}${X(i)} ${Y(v)}`).join(" ");
  const staked = 0.68;
  const R = 70;
  const circ = 2 * Math.PI * R;
  return (
    <g>
      <Stars seed={31} />
      <g className={vis(b <= 1)}>
        <circle cx={320} cy={200} r={R} fill="none" stroke="#eee9f7" strokeWidth={16} />
        <circle cx={320} cy={200} r={R} fill="none" stroke="url(#gSolD)" strokeWidth={16} strokeDasharray={`${circ * staked} ${circ}`} transform="rotate(-90 320 200)" strokeLinecap="round" />
        <image href={asset("/img/sol-coin.png")} x={276} y={156} width={88} height={88} />
        <Pill x={320} y={308} text={s.staked} color={C.violet} size={13.5} />
      </g>
      <g className={vis(b === 1)}>
        <path d="M384 200 C 450 200, 470 150, 520 140" fill="none" stroke={C.mint} strokeWidth={3} strokeDasharray="5 5" className="flow" />
        <Validator x={540} y={130} s={0.8} color={C.mint} label={s.stakers} />
        <Card x={150} y={360} w={340} h={124} stroke={C.mint}>
          <T x={320} y={398} size={22} weight={800} color={C.mint}>
            {s.newSol}
          </T>
          <T x={320} y={424} size={13} weight={700}>
            {s.perDay}
          </T>
          <T x={320} y={452} size={12.5} color={C.mute}>
            {s.rate}
          </T>
        </Card>
      </g>
      <g className={vis(b === 2)}>
        <T x={60} y={140} anchor="start" size={14} weight={800}>
          {s.chartTitle}
        </T>
        {[1.5, 2, 3, 4].map((v) => (
          <g key={v}>
            <line x1={80} y1={Y(v)} x2={590} y2={Y(v)} stroke={C.line} strokeWidth={1} strokeDasharray={v === 1.5 ? "6 4" : undefined} />
            <T x={72} y={Y(v) + 4} anchor="end" size={11} color={C.mute}>
              {String(v).replace(".", t.ui.dec)}%
            </T>
          </g>
        ))}
        {yrs.map((y, i) => (
          <T key={y} x={X(i)} y={494} size={11} color={C.mute}>
            {y}
          </T>
        ))}
        <path d={line(path(0.85))} fill="none" stroke={C.mute} strokeWidth={2.5} strokeDasharray="6 5" />
        <path d={line(path(0.7))} fill="none" stroke={C.purple} strokeWidth={3.5} />
        <Pill x={470} y={Y(2.55)} text={s.oldPlan} color={C.mute} size={11.5} bold={false} />
        <Pill x={300} y={Y(1.5) + 26} text={s.newPlan} color={C.violet} size={11.5} />
        <T x={590} y={Y(1.5) - 8} anchor="end" size={11} weight={700} color={C.mute}>
          {s.floor}
        </T>
        <Pill x={320} y={190} text={s.pending} color={C.amber} size={12} />
      </g>
      <g className={vis(b >= 3)}>
        <rect x={140} y={170} width={110} height={290} rx={12} fill={C.mute} opacity={0.25} />
        <T x={195} y={160} size={18} weight={800} color={C.mute}>
          {s.top}
        </T>
        <T x={195} y={484} size={12} weight={600} color={C.mute}>
          {s.topDate}
        </T>
        <rect x={300} y={460 - 290 * (72.83 / 293.31)} width={110} height={290 * (72.83 / 293.31)} rx={12} fill="url(#gSolD)" />
        <T x={355} y={450 - 290 * (72.83 / 293.31)} size={20} weight={800} color={C.violet}>
          {s.price}
        </T>
        <T x={355} y={484} size={12} weight={600} color={C.mute}>
          {s.priceDate}
        </T>
        <Pill x={500} y={260} text={s.down} color={C.warn} size={22} />
        <T x={500} y={300} size={12.5} weight={600} color={C.mute}>
          {s.year}
        </T>
      </g>
    </g>
  );
}

/* 12 — verdict */
function Verdict({ b, t }: P) {
  const s = t.scenes;
  return (
    <g>
      <Stars seed={37} />
      <Streaks y0={60} y1={120} n={4} />
      <Ship x={330} y={86} s={0.62} trail={0.9} />
      <g className={vis(b >= 0)}>
        <T x={164} y={170} size={15} weight={800} color={C.mint}>
          {s.strong}
        </T>
        {s.strengths.map((x, i) => (
          <g key={i}>
            <rect x={30} y={186 + i * 42} width={268} height={34} rx={17} fill="#e5fbf1" />
            <Check x={50} y={203 + i * 42} r={9} />
            <T x={66} y={208 + i * 42} anchor="start" size={12.5} weight={700}>
              {x}
            </T>
          </g>
        ))}
      </g>
      <g className={vis(b >= 1)}>
        <T x={476} y={170} size={15} weight={800} color={C.warn}>
          {s.weak}
        </T>
        {s.weaknesses.map((x, i) => (
          <g key={i}>
            <rect x={342} y={186 + i * 42} width={268} height={34} rx={17} fill="#fde8eb" />
            <Cross x={362} y={203 + i * 42} r={9} />
            <T x={378} y={208 + i * 42} anchor="start" size={12.5} weight={700}>
              {x}
            </T>
          </g>
        ))}
      </g>
      <g className={vis(b >= 2)}>
        <Card x={342} y={410} w={268} h={110} stroke={C.mint}>
          <T x={476} y={448} size={20} weight={800} color={C.mint}>
            {s.got}
          </T>
          <T x={476} y={472} size={12} weight={600} color={C.mute}>
            {s.nhiSub}
          </T>
          <T x={476} y={500} size={12.5} weight={700} color={C.violet}>
            {s.bet}
          </T>
        </Card>
      </g>
    </g>
  );
}

export const SCENES = [Launch, Rota, Direct, Clock, Shreds, Lanes, Fees, Stops, Engine, Faster, Token, Verdict];
