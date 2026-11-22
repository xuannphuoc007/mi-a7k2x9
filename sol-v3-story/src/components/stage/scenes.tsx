"use client";
/**
 * Nine scenes for "The Ship of Light", beginner edition. Each scene is drawn in a
 * 640 × 560 box and reveals its parts as the beat number grows (b = 0, 1, 2).
 * Loops run by themselves (SVG animate), so the stage plays without any input.
 */
import type { Dict } from "@/data/coins/sol/translations";
import { C } from "@/data/coins/sol/chapters";
import { asset } from "@/lib/asset";
import { Beam, Book, Card, Check, Computer, Cross, MiniBook, MiniShip, Phone, Pill, Ship, Stars, Streaks, T, Tile, vis } from "./kit";

type P = { b: number; p: number; t: Dict };

const VCOL = [C.purple, C.cyan, C.mint, C.amber];

/* 1 — a shared record book */
function What({ b, t }: P) {
  const s = t.scenes;
  const ring = Array.from({ length: 10 }, (_, i) => {
    const a = (-90 + i * 36) * (Math.PI / 180);
    return { x: 320 + 250 * Math.cos(a), y: 250 + 170 * Math.sin(a) };
  });
  const badIdx = 6;
  return (
    <g>
      <Stars />
      <g opacity={b >= 2 ? 0.28 : 1} style={{ transition: "opacity .5s" }}>
        <Book x={320} y={186} w={330} h={140} title={s.book} rows={s.rows} newRow={b === 0} />
        {ring.map((r, i) => {
          const bad = b === 1 && i === badIdx;
          return (
            <g key={i}>
              <line x1={r.x} y1={r.y} x2={320 + (r.x - 320) * 0.62} y2={250 + (r.y - 250) * 0.62} stroke={bad ? C.warn : C.line} strokeWidth={1.6} strokeDasharray="3 5" />
              <Computer x={r.x} y={r.y} s={0.62} color={VCOL[i % 4]} bad={bad}>
                <MiniBook x={0} y={-5} s={0.9} color={bad ? C.warn : VCOL[i % 4]} />
              </Computer>
              {b === 1 && (i === badIdx ? <Cross x={r.x + 20} y={r.y - 20} r={9} /> : <Check x={r.x + 20} y={r.y - 20} r={8} />)}
            </g>
          );
        })}
        <g className={vis(b === 0)}>
          <Pill x={320} y={524} text={s.copies} color={C.violet} size={14} />
        </g>
      </g>
      <g className={vis(b === 1)}>
        <Card x={ring[badIdx].x - 140} y={ring[badIdx].y + 30} w={200} h={64} stroke={C.warn}>
          <T x={ring[badIdx].x - 40} y={ring[badIdx].y + 56} size={13} weight={800} color={C.warn}>
            {s.fakeRow}
          </T>
          <T x={ring[badIdx].x - 40} y={ring[badIdx].y + 78} size={11.5} weight={600} color={C.mute}>
            {s.fake}
          </T>
        </Card>
        <Pill x={320} y={524} text={s.reject} color={C.warn} size={13.5} />
      </g>
      <g className={vis(b >= 2)}>
        <image href={asset("/img/sol-coin.png")} x={260} y={150} width={120} height={120} />
        {s.uses.map((u, i) => {
          const pos = [
            [160, 330],
            [480, 330],
            [160, 400],
            [480, 400],
          ][i];
          return <Pill key={u} x={pos[0]} y={pos[1]} text={u} color={VCOL[i]} size={14} />;
        })}
        <Ship x={330} y={480} s={0.55} trail={0.9} />
      </g>
    </g>
  );
}

/* 2 — Nhi gets paid */
function Pay({ b, t }: P) {
  const s = t.scenes;
  return (
    <g>
      <Stars seed={4} />
      <Streaks y0={70} y1={330} n={7} />
      <g transform={b >= 2 ? "translate(0 -40)" : "translate(0 70)"} style={{ transition: "transform .6s" }}>
        <Phone x={86} y={190} label={s.customer} screen={s.pay} sub={s.sent} color={C.purple} />
        <Phone x={554} y={190} label={s.nhi} screen={b >= 1 ? s.got : "QR"} sub={b >= 1 ? s.received : s.waiting} color={C.mint} ok={b >= 1} />
        <g className={vis(b >= 1)}>
          <Beam x1={124} y1={182} x2={262} y2={182} dur={0.9} />
          <Beam x1={378} y1={182} x2={516} y2={182} dur={0.9} delay={0.45} />
        </g>
        <Ship x={318} y={182} s={1.05} trail={0.6} />
        <g className={vis(b >= 1)}>
          <Pill x={320} y={92} text={s.timer} color={C.mint} size={16} />
          <Pill x={320} y={290} text={s.fee} color={C.violet} size={14} />
        </g>
      </g>
      <g className={vis(b >= 2)}>
        {s.race.map((r, i) => {
          const y = 368 + i * 58;
          const col = i === 2 ? C.purple : C.mute;
          const dur = [26, 7, 1.1][i];
          const tiles = [1, 3, 14][i];
          return (
            <g key={r.n}>
              <T x={40} y={y + 5} anchor="start" size={15} weight={800} color={i === 2 ? C.violet : C.ink}>
                {r.n}
              </T>
              <T x={40} y={y + 23} anchor="start" size={11.5} weight={600} color={C.mute}>
                {r.v}
              </T>
              <line x1={190} y1={y} x2={604} y2={y} stroke={C.line} strokeWidth={10} strokeLinecap="round" />
              {Array.from({ length: tiles }, (_, k) => (
                <rect key={k} x={196 + (k * 400) / Math.max(1, tiles)} y={y - 7} width={i === 2 ? 20 : 30} height={14} rx={4} fill={col} opacity={i === 2 ? 0.7 : 0.45} />
              ))}
              <circle r={8} cy={y} fill={i === 2 ? C.green : "#fff"} stroke={col} strokeWidth={2.5}>
                <animate attributeName="cx" values="196;600" dur={`${dur}s`} repeatCount="indefinite" />
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

/* 3 — taking turns */
function Turns({ b, t }: P) {
  const s = t.scenes;
  const xs = [110, 250, 390, 530];
  const LOOP = 8;
  return (
    <g>
      <Stars seed={11} />
      <T x={320} y={40} size={13} weight={700} color={C.violet}>
        {s.writingNow}
      </T>
      {xs.map((x, i) => (
        <g key={i}>
          <rect x={x - 42} y={66} width={84} height={96} rx={16} fill="none" stroke={VCOL[i]} strokeWidth={3.5} opacity={0} filter="url(#glow)">
            <animate attributeName="opacity" calcMode="discrete" dur={`${LOOP}s`} repeatCount="indefinite" values={i === 0 ? "1;0" : i === 3 ? "0;1" : "0;1;0"} keyTimes={i === 0 ? "0;0.25" : i === 3 ? "0;0.75" : `0;${i / 4};${(i + 1) / 4}`} />
          </rect>
          <Computer x={x} y={104} color={VCOL[i]} label={s.vals[i]}>
            <MiniBook x={0} y={-5} s={0.9} color={VCOL[i]} />
          </Computer>
        </g>
      ))}
      <g className={vis(b === 0)}>
        <Card x={90} y={230} w={460} h={150} stroke={C.violet}>
          <T x={320} y={262} size={14} weight={800} color={C.violet}>
            {s.pen}
          </T>
          <rect x={250} y={286} width={140} height={74} rx={8} fill="#fff" stroke={C.purple} strokeWidth={2} />
          {[0, 1, 2, 3].map((k) => (
            <rect key={k} x={262} y={298 + k * 14} width={116} height={7} rx={3} fill={VCOL[k]} opacity={0.75}>
              <animate attributeName="width" values="0;116;116" dur="2s" begin={`${k * 0.4}s`} repeatCount="indefinite" />
            </rect>
          ))}
        </Card>
      </g>
      <g className={vis(b === 1)}>
        {Array.from({ length: 16 }, (_, k) => {
          const v = Math.floor(k / 4);
          return <Tile key={k} x={40 + k * 35.5} y={300} w={30} h={38} color={VCOL[v]} label={String(k + 1)} />;
        })}
        {[0, 1, 2, 3].map((v) => (
          <g key={v}>
            <path d={`M${42 + v * 142} 352 v8 h${138} v-8`} fill="none" stroke={VCOL[v]} strokeWidth={2} />
            <T x={111 + v * 142} y={378} size={12.5} weight={700} color={VCOL[v]}>
              {s.vals[v]}
            </T>
          </g>
        ))}
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0; 568 0" dur={`${LOOP}s`} repeatCount="indefinite" />
          <MiniShip x={56} y={278} />
        </g>
        <Pill x={320} y={234} text={s.rota} color={C.violet} size={14} />
        <Pill x={320} y={430} text={s.four} color={C.violet} size={14} />
      </g>
      <g className={vis(b >= 2)}>
        <T x={150} y={240} size={14} weight={800}>
          {s.queueTitle}
        </T>
        <rect x={40} y={256} width={220} height={60} rx={14} fill="#fff" stroke={C.mute} strokeWidth={2} strokeDasharray="6 5" />
        {Array.from({ length: 9 }, (_, k) => (
          <circle key={k} cx={62 + k * 22} cy={286} r={8} fill="#cfc6e6">
            <animate attributeName="cy" values="286;282;286" dur={`${1.3 + (k % 3) * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <T x={150} y={340} size={12.5} weight={600} color={C.mute}>
          {s.queue}
        </T>
        <Phone x={470} y={420} label={s.wallet} screen="20 USDC" color={C.purple} />
        <Beam x1={462} y1={362} x2={400} y2={160} dur={0.8} />
        <Beam x1={480} y1={362} x2={528} y2={160} dur={1} delay={0.3} width={2.5} />
        <Pill x={470} y={238} text={s.direct} color={C.mint} size={13} />
      </g>
    </g>
  );
}

/* 4 — many payments at the same time */
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
          <T x={96} y={y + 5} anchor="end" size={12.5} weight={700} color={C.mute}>
            {s.core} {i + 1}
          </T>
        </g>
      ))}
      <T x={360} y={100} size={14} weight={700} color={C.violet}>
        {b === 0 ? s.touches : s.parallel}
      </T>
      {ys.map((y, i) => {
        const queued = memeQueued && i === 3;
        const label = queued ? s.meme : s.txs[i];
        const col = queued ? C.warn : VCOL[i];
        if (b === 0) {
          return (
            <g key={i}>
              <rect x={130} y={y - 16} width={150} height={32} rx={16} fill={col} />
              <T x={205} y={y + 5} size={13} weight={700} color="#fff">
                {label}
              </T>
            </g>
          );
        }
        return (
          <g key={i + (queued ? "q" : "")}>
            {(queued ? [0, 1] : [0]).map((k) => (
              <g key={k}>
                <animateTransform attributeName="transform" type="translate" values={`0 0; ${queued ? 280 : 320} 0`} dur={queued ? "5s" : "2.2s"} begin={`${queued ? k * 2.5 : i * 0.15}s`} repeatCount="indefinite" />
                <rect x={130} y={y - 16} width={150} height={32} rx={16} fill={col} opacity={queued && k ? 0.75 : 1} />
                <T x={205} y={y + 5} size={13} weight={700} color="#fff">
                  {label}
                </T>
              </g>
            ))}
          </g>
        );
      })}
      <g className={vis(b >= 2)}>
        <Pill x={360} y={406} text={s.same} color={C.warn} size={13} />
      </g>
      <g className={vis(b >= 1)}>
        <T x={110} y={456} anchor="start" size={13.5} weight={800}>
          {s.eth}
        </T>
        <rect x={110} y={470} width={500} height={44} rx={22} fill="#fff" stroke={C.line} strokeWidth={1.6} />
        {[0, 1, 2, 3].map((k) => (
          <g key={k}>
            <animateTransform attributeName="transform" type="translate" values="0 0; 360 0" dur="8.8s" begin={`${k * 2.2}s`} repeatCount="indefinite" />
            <rect x={122} y={477} width={110} height={30} rx={15} fill={C.mute} opacity={0.55} />
          </g>
        ))}
      </g>
    </g>
  );
}

/* 5 — fees */
function Fees({ b, t }: P) {
  const s = t.scenes;
  return (
    <g>
      <Stars seed={17} />
      <g opacity={b >= 2 ? 0.25 : 1} style={{ transition: "opacity .5s" }}>
        <circle cx={220} cy={120} r={36} fill="#fff" stroke={C.amber} strokeWidth={3} filter="url(#soft)" />
        <T x={220} y={126} size={16} weight={800} color={C.amber}>
          SOL
        </T>
        <T x={220} y={184} size={13.5} weight={800}>
          {s.base}
        </T>
        <path d="M200 200 C 170 230, 130 240, 120 270" fill="none" stroke={C.fire} strokeWidth={3} strokeDasharray="5 5" className="flow" />
        <path d="M240 200 C 270 230, 310 240, 320 268" fill="none" stroke={C.violet} strokeWidth={3} strokeDasharray="5 5" className="flow" />
        <T x={120} y={306} size={34}>
          🔥
        </T>
        <T x={120} y={334} size={13.5} weight={800} color={C.fire}>
          {s.burn}
        </T>
        <Computer x={330} y={300} s={0.8} color={C.violet} />
        <T x={330} y={356} size={12.5} weight={800} color={C.violet}>
          {s.toWriter}
        </T>
        <g className={vis(b >= 1)}>
          <circle cx={500} cy={120} r={36} fill={C.amber} stroke="#fff" strokeWidth={3} filter="url(#soft)" />
          <T x={500} y={128} size={22} weight={800} color="#fff">
            ⚡
          </T>
          <T x={500} y={184} size={13.5} weight={800}>
            {s.prio}
          </T>
          <path d="M470 200 C 440 250, 400 270, 366 290" fill="none" stroke={C.amber} strokeWidth={3.5} strokeDasharray="5 5" className="flow" />
          <Pill x={500} y={232} text={s.prioNote} color={C.amber} size={12.5} />
        </g>
      </g>
      <g className={vis(b >= 2)}>
        <T x={60} y={330} anchor="start" size={14} weight={800}>
          {s.pageBar}
        </T>
        <rect x={60} y={344} width={520} height={60} rx={12} fill="#fff" stroke={C.line} strokeWidth={1.6} />
        <rect x={60} y={344} width={520 * 0.12} height={60} rx={12} fill="url(#hatch)" stroke={C.warn} strokeWidth={2} />
        {Array.from({ length: 22 }, (_, k) => (
          <rect key={k} x={128 + k * 20.5} y={354} width={16} height={40} rx={4} fill={VCOL[k % 4]} opacity={0.75} />
        ))}
        <rect x={128 + 5 * 20.5 - 2} y={350} width={20} height={48} rx={5} fill="none" stroke={C.mint} strokeWidth={3} />
        <path d="M91 344 v-20" stroke={C.warn} strokeWidth={2} />
        <Pill x={170} y={300} text={s.hot} color={C.warn} size={13} />
        <T x={370} y={432} size={13} weight={600} color={C.mute}>
          {s.otherTx}
        </T>
        <path d="M240 400 v56" stroke={C.mint} strokeWidth={2} />
        <Pill x={240} y={470} text={s.nhiTx} color={C.mint} size={14} />
      </g>
    </g>
  );
}

/* 6 — when it stopped */
function Stops({ b, t }: P) {
  const s = t.scenes;
  const X0 = 50;
  const W = 540;
  const tx = (yr: number) => X0 + ((yr - 2021) / (2026.95 - 2021)) * W;
  const at = [2021.7, 2022.33, 2023.15, 2024.1];
  const show = (i: number) => (i < 2 ? true : b >= 1);
  return (
    <g>
      <Stars seed={21} />
      <line x1={X0} y1={300} x2={X0 + W} y2={300} stroke={C.line} strokeWidth={6} strokeLinecap="round" />
      {[2021, 2022, 2023, 2024, 2025, 2026].map((yr) => (
        <g key={yr}>
          <line x1={tx(yr)} y1={292} x2={tx(yr)} y2={308} stroke={C.mute} strokeWidth={1.5} />
          <T x={tx(yr)} y={332} size={12.5} color={C.mute}>
            {yr}
          </T>
        </g>
      ))}
      {s.events.map((e, i) => {
        const r = 8 + e.h * 1.3;
        const up = i % 2 === 0;
        return (
          <g key={i} className={vis(show(i))}>
            <circle cx={tx(at[i])} cy={300} r={r} fill={C.warn} opacity={0.18} />
            <circle cx={tx(at[i])} cy={300} r={7} fill={C.warn} />
            <line x1={tx(at[i])} y1={up ? 300 - r : 300 + r} x2={tx(at[i])} y2={up ? 196 : 404} stroke={C.warn} strokeWidth={1.4} strokeDasharray="3 3" />
            <T x={tx(at[i])} y={up ? 150 : 432} size={22} weight={800} color={C.warn}>
              {e.h} {s.hours}
            </T>
            <T x={tx(at[i])} y={up ? 172 : 454} size={12.5} weight={700}>
              {e.d}
            </T>
            <T x={tx(at[i])} y={up ? 190 : 472} size={12} color={C.mute}>
              {e.why}
            </T>
          </g>
        );
      })}
      <g className={vis(b >= 2)}>
        <rect x={tx(2024.1)} y={293} width={tx(2026.88) - tx(2024.1)} height={14} rx={7} fill="url(#gSol)" />
        <Pill x={(tx(2024.4) + tx(2026.88)) / 2 + 20} y={250} text={s.streak} color={C.mint} size={15} />
        <T x={(tx(2024.4) + tx(2026.88)) / 2 + 20} y={224} size={12} color={C.mute}>
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

/* 7 — expensive machines */
function Machines({ b, t }: P) {
  const s = t.scenes;
  const dots = (n: number, x0: number, y0: number, cols: number, col: string) =>
    Array.from({ length: n }, (_, k) => <circle key={k} cx={x0 + (k % cols) * 13} cy={y0 + Math.floor(k / cols) * 13} r={4.6} fill={col} />);
  return (
    <g>
      <Stars seed={23} />
      <g className={vis(b === 0)}>
        {/* server rack */}
        <g transform="translate(170 120)" filter="url(#soft)">
          <rect x={-70} y={0} width={140} height={210} rx={12} fill="#fff" stroke={C.violet} strokeWidth={2.6} />
          {Array.from({ length: 6 }, (_, k) => (
            <g key={k}>
              <rect x={-56} y={14 + k * 32} width={112} height={22} rx={5} fill={C.lilac} />
              <circle cx={44} cy={25 + k * 32} r={3.5} fill={k % 2 ? C.green : C.purple} />
            </g>
          ))}
        </g>
        <T x={170} y={356} size={13.5} weight={800}>
          {s.server}
        </T>
        <g transform="translate(470 230)">
          <rect x={-60} y={-36} width={120} height={74} rx={8} fill="#fff" stroke={C.mute} strokeWidth={2} />
          <rect x={-74} y={38} width={148} height={9} rx={4.5} fill={C.mute} opacity={0.5} />
        </g>
        <T x={470} y={300} size={13.5} weight={800}>
          {s.laptop}
        </T>
        {/* memory bars */}
        <rect x={60} y={392} width={520} height={30} rx={10} fill="url(#gSol)" />
        <T x={72} y={412} anchor="start" size={13} weight={800} color="#fff">
          {s.ramServer}
        </T>
        <rect x={60} y={432} width={Math.max(30, 520 * (16 / 512))} height={30} rx={10} fill={C.mute} opacity={0.6} />
        <T x={104} y={452} anchor="start" size={13} weight={700} color={C.mute}>
          {s.ramLaptop}
        </T>
        <T x={320} y={500} size={12.5} weight={600} color={C.violet}>
          {s.net}
        </T>
      </g>
      <g className={vis(b === 1)}>
        <T x={180} y={96} size={14} weight={800} color={C.mute}>
          {s.then}
        </T>
        {dots(128, 66, 120, 10, "#c9bdea")}
        <T x={470} y={96} size={14} weight={800} color={C.violet}>
          {s.now2}
        </T>
        {dots(33, 410, 120, 10, C.purple)}
        <path d="M216 300 C 300 330, 360 330, 420 190" fill="none" stroke={C.warn} strokeWidth={2.5} strokeDasharray="5 5" />
        <polygon points="414,198 426,186 428,202" fill={C.warn} />
        <T x={320} y={470} size={12} color={C.mute}>
          {s.dotNote}
        </T>
      </g>
      <g className={vis(b >= 2)}>
        <T x={60} y={150} anchor="start" size={14} weight={800}>
          {s.weight}
        </T>
        <rect x={60} y={166} width={520} height={60} rx={12} fill="#eee9f7" />
        <rect x={60} y={166} width={520 * 0.34} height={60} rx={12} fill={C.warn} opacity={0.85} />
        {Array.from({ length: 18 }, (_, k) => (
          <rect key={k} x={66 + k * 9.6} y={176} width={7} height={40} rx={2} fill="#fff" opacity={0.55} />
        ))}
        <T x={60 + 260 * 0.34} y={250} size={13} weight={800} color={C.warn}>
          {s.big18}
        </T>
        <T x={60 + 260 * 0.34} y={270} size={12.5} weight={700} color={C.warn}>
          {s.third}
        </T>
        <T x={60 + 520 * 0.34 + (520 * 0.66) / 2} y={202} size={13} weight={700} color={C.mute}>
          {s.rest}
        </T>
        <Card x={130} y={330} w={380} h={110} stroke={C.violet}>
          {[0, 1, 2, 3, 4].map((k) => (
            <Computer key={k} x={190 + k * 65} y={372} s={0.5} color={C.violet} />
          ))}
          <T x={320} y={422} size={13} weight={800} color={C.violet}>
            {s.oneSoft}
          </T>
        </Card>
      </g>
    </g>
  );
}

/* 8 — the SOL coin */
function Token({ b, t }: P) {
  const s = t.scenes;
  const staked = 0.68;
  const R = 74;
  const circ = 2 * Math.PI * R;
  return (
    <g>
      <Stars seed={31} />
      <g className={vis(b <= 1)}>
        <circle cx={320} cy={210} r={R} fill="none" stroke="#eee9f7" strokeWidth={16} />
        <circle cx={320} cy={210} r={R} fill="none" stroke="url(#gSolD)" strokeWidth={16} strokeDasharray={`${circ * staked} ${circ}`} transform="rotate(-90 320 210)" strokeLinecap="round" />
        <image href={asset("/img/sol-coin.png")} x={274} y={164} width={92} height={92} />
        <Pill x={130} y={130} text={s.fees} color={C.amber} size={14} />
        <path d="M170 140 C 220 150, 240 170, 252 186" fill="none" stroke={C.amber} strokeWidth={2.5} strokeDasharray="5 5" className="flow" />
        <Pill x={320} y={322} text={s.staked} color={C.violet} size={13.5} />
      </g>
      <g className={vis(b === 1)}>
        <path d="M392 210 C 450 210, 470 170, 520 160" fill="none" stroke={C.mint} strokeWidth={3} strokeDasharray="5 5" className="flow" />
        <Computer x={548} y={150} s={0.7} color={C.mint} />
        <Card x={140} y={370} w={360} h={124} stroke={C.mint}>
          <T x={320} y={408} size={21} weight={800} color={C.mint}>
            {s.newSol}
          </T>
          <T x={320} y={434} size={13} weight={700}>
            {s.toStakers}
          </T>
          <T x={320} y={462} size={12.5} color={C.mute}>
            {s.rate}
          </T>
        </Card>
      </g>
      <g className={vis(b >= 2)}>
        <rect x={140} y={170} width={110} height={290} rx={12} fill={C.mute} opacity={0.25} />
        <T x={195} y={160} size={20} weight={800} color={C.mute}>
          {s.top}
        </T>
        <T x={195} y={486} size={12.5} weight={600} color={C.mute}>
          {s.topDate}
        </T>
        <rect x={300} y={460 - 290 * (72.83 / 293.31)} width={110} height={290 * (72.83 / 293.31)} rx={12} fill="url(#gSolD)" />
        <T x={355} y={450 - 290 * (72.83 / 293.31)} size={21} weight={800} color={C.violet}>
          {s.price}
        </T>
        <T x={355} y={486} size={12.5} weight={600} color={C.mute}>
          {s.priceDate}
        </T>
        <Pill x={510} y={270} text={s.down} color={C.warn} size={24} />
      </g>
    </g>
  );
}

/* 9 — in short */
function Verdict({ b, t }: P) {
  const s = t.scenes;
  return (
    <g>
      <Stars seed={37} />
      <Streaks y0={60} y1={120} n={4} />
      <Ship x={330} y={86} s={0.62} trail={0.9} />
      <g>
        <T x={164} y={176} size={16} weight={800} color={C.mint}>
          {s.strong}
        </T>
        {s.strengths.map((x, i) => (
          <g key={i}>
            <rect x={30} y={194 + i * 46} width={268} height={36} rx={18} fill="#e5fbf1" />
            <Check x={52} y={212 + i * 46} r={10} />
            <T x={70} y={217 + i * 46} anchor="start" size={13.5} weight={700}>
              {x}
            </T>
          </g>
        ))}
      </g>
      <g className={vis(b >= 1)}>
        <T x={476} y={176} size={16} weight={800} color={C.warn}>
          {s.weak}
        </T>
        {s.weaknesses.map((x, i) => (
          <g key={i}>
            <rect x={342} y={194 + i * 46} width={268} height={36} rx={18} fill="#fde8eb" />
            <Cross x={364} y={212 + i * 46} r={10} />
            <T x={382} y={217 + i * 46} anchor="start" size={13.5} weight={700}>
              {x}
            </T>
          </g>
        ))}
      </g>
      <g className={vis(b >= 2)}>
        <Card x={150} y={440} w={340} h={104} stroke={C.mint}>
          <T x={320} y={476} size={21} weight={800} color={C.mint}>
            {s.got}
          </T>
          <T x={320} y={500} size={12.5} weight={600} color={C.mute}>
            {s.nhiSub}
          </T>
          <T x={320} y={526} size={13} weight={700} color={C.violet}>
            {s.bet}
          </T>
        </Card>
      </g>
    </g>
  );
}

export const SCENES = [What, Pay, Turns, Lanes, Fees, Stops, Machines, Token, Verdict];
