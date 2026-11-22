"use client";
/**
 * Beginner edition: eleven scenes on a 640 × 560 stage told with everyday objects —
 * a pawnshop in a glass room, gold shops, price messengers, slips with stamps,
 * a price board, a safe, a border with two checkpoints, a deposit box, a piggy bank.
 */
import { C } from "@/data/coins/link/chapters";
import type { Dict } from "@/data/coins/link/translations";
import { Chain, Check, Coin, Cross, GoldShop, hexPts, Person, Pill, Room, Slip, T, Token, vis } from "./kit";

export type SceneProps = { b: number; p: number; t: Dict };

const MSG = C.amber; // messenger shirt
const BADGE = C.blue; // Chainlink badge

/* 1 — a pawnshop behind glass */
function Pawn({ b, t }: SceneProps) {
  const s = t.scenes;
  return (
    <g>
      <Room x={30} y={110} w={380} h={330} label={s.shop} screen={b >= 1 ? s.priceQ : s.lend} screenColor={b >= 1 ? C.warn : C.ink} blink={b >= 1}>
        <Person x={120} y={250} s={1.25} color="#7a9cc6" />
        <T x={120} y={348} size={12.5} color={C.mute}>
          {s.customer}
        </T>
        <g className={vis(true)}>
          <Token x={178} y={318} r={17} label="Ξ" />
          <T x={178} y={300} size={12} weight={800} color="#4a5fc0">
            1 ETH
          </T>
        </g>
      </Room>
      <g className={vis(b >= 2)}>
        <GoldShop x={470} y={150} w={150} label={s.goldShop} price={s.slip} />
        <g transform="translate(436 120)">
          <line x1={0} y1={0} x2={0} y2={330} stroke="#a9bdd6" strokeWidth={3} strokeDasharray="8 7" />
        </g>
        <g transform="translate(470 340)">
          <circle cx={20} cy={20} r={18} fill="#fff" stroke={C.warn} strokeWidth={2.5} />
          <text x={20} y={27} textAnchor="middle" fontSize={18}>
            📞
          </text>
          <line x1={7} y1={7} x2={33} y2={33} stroke={C.warn} strokeWidth={3} />
          <circle cx={70} cy={20} r={18} fill="#fff" stroke={C.warn} strokeWidth={2.5} />
          <text x={70} y={27} textAnchor="middle" fontSize={18}>
            🌐
          </text>
          <line x1={57} y1={7} x2={83} y2={33} stroke={C.warn} strokeWidth={3} />
          <T x={45} y={64} size={11.5} color={C.warn} weight={700}>
            {s.noLine}
          </T>
        </g>
        <Pill x={220} y={516} text={s.glass} color={C.blue} size={14} />
      </g>
    </g>
  );
}

/* 2 — someone has to bring the price in */
function Messenger({ b, t }: SceneProps) {
  const s = t.scenes;
  const bad = b === 1;
  return (
    <g>
      <Room x={24} y={150} w={230} h={260} screen={bad ? "$$$ !" : s.slip} screenColor={bad ? C.warn : C.sign} blink={bad} />
      {bad && <Pill x={139} y={140} text={s.tooMuch} color={C.warn} fill="#fde8e5" size={14} />}
      <GoldShop x={466} y={160} w={150} label={s.goldShop} price={s.slip} />
      {/* the single messenger walking back and forth */}
      <g style={{ opacity: b >= 2 ? 0 : 1, transition: "opacity .5s" }}>
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0; -100 0; 0 0" dur="4s" repeatCount="indefinite" />
          <Person x={420} y={300} s={1.2} color={bad ? C.warn : MSG} badge={bad ? undefined : BADGE} mood={bad ? "bad" : undefined} />
          <Slip x={372} y={232} w={96} h={48} text={bad ? s.fake : s.slip} fake={bad} />
        </g>
        <Pill x={340} y={500} text={s.messenger} color={MSG} size={14} />
      </g>
      {bad && (
        <g>
          {[0, 1, 2, 3].map((k) => (
            <circle key={k} cx={140} cy={330} r={6} fill={C.gold}>
              <animate attributeName="cy" values="330;470" dur="1.2s" begin={`${k * 0.3}s`} repeatCount="indefinite" />
              <animate attributeName="cx" values={`140;${90 + k * 30}`} dur="1.2s" begin={`${k * 0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      )}
      {/* nine independent messengers */}
      <g className={vis(b >= 2)}>
        {Array.from({ length: 9 }, (_, k) => (
          <Person key={k} x={300 + (k % 3) * 52} y={190 + Math.floor(k / 3) * 92} s={0.82} color={[MSG, "#5aa5a0", "#9a7bd6"][k % 3]} badge={BADGE} />
        ))}
        <Pill x={352} y={500} text={s.nine} color={C.sign} size={14} />
      </g>
    </g>
  );
}

/* 3 — ask nine shops, keep the middle price */
function Nine({ b, t }: SceneProps) {
  const s = t.scenes;
  const vals = [100.1, 99.9, 100.2, 92.0, 100.0, 100.1, 100.3, 100.1, 100.0];
  const sorted = [...vals].sort((a, z) => a - z);
  return (
    <g>
      <T x={620} y={30} size={11} anchor="end" color={C.mute} weight={500}>
        {s.illustrative}
      </T>
      {vals.map((v, i) => {
        const x = 44 + i * 69;
        const out = v < 95;
        return (
          <g key={i}>
            <g transform={`translate(${x - 24} 50)`}>
              <rect width={48} height={28} rx={8} fill="#fff" stroke={out && b >= 1 ? C.warn : C.line} strokeWidth={out && b >= 1 ? 2 : 1} />
              <text x={24} y={19} textAnchor="middle" fontSize={12.5} fontWeight={800} fill={out && b >= 1 ? C.warn : C.ink}>
                {v.toFixed(1)}
              </text>
            </g>
            <Person x={x} y={104} s={0.72} color={[MSG, "#5aa5a0", "#9a7bd6"][i % 3]} badge={BADGE} />
            <T x={x} y={170} size={10.5} color={C.mute} weight={500}>
              {s.shopN} {String.fromCharCode(65 + i)}
            </T>
          </g>
        );
      })}
      {/* sorted bars */}
      <g className={vis(b >= 1)}>
        {sorted.map((v, i) => {
          const h = 14 + (v - 90) * 8;
          const x = 120 + i * 46;
          const mid = i === 4;
          const out = v < 95;
          return (
            <g key={i}>
              <rect x={x} y={300 - h} width={34} height={h} rx={6} fill={out ? "#f4b3ab" : mid ? C.sign : "#cfd9e5"} />
              <text x={x + 17} y={292 - h} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={out ? C.warn : C.ink}>
                {v.toFixed(1)}
              </text>
            </g>
          );
        })}
        <T x={120 + 4 * 46 + 17} y={322} size={13} weight={800} color={C.sign}>
          ↑ {s.middle}
        </T>
        <T x={137} y={322} size={12} weight={700} color={C.warn}>
          ↑ {s.ignored}
        </T>
      </g>
      {/* one slip, many stamps */}
      <g className={vis(b >= 2)}>
        <Slip x={196} y={350} w={160} h={82} text="ETH 100.1" stamps={7} />
        <T x={276} y={452} size={12.5} weight={700} color={C.sign}>
          {s.signed}
        </T>
      </g>
      {/* into the room */}
      <g className={vis(b >= 3)}>
        <Room x={430} y={360} w={170} h={140} screen="ETH 100.1" screenColor={C.sign} />
        <path d="M360 390 L428 410" stroke={C.sign} strokeWidth={3} strokeDasharray="6 6" className="flow" />
        <g transform="translate(110 500)">
          <T x={0} y={0} size={18} weight={800} color={C.mute}>
            {s.trips}
          </T>
          <line x1={-34} y1={-6} x2={34} y2={-6} stroke={C.warn} strokeWidth={3} />
          <T x={62} y={0} size={18} color={C.mute}>
            →
          </T>
          <T x={130} y={0} size={18} weight={800} color={C.sign}>
            {s.trip}
          </T>
          <T x={130} y={22} size={12.5} weight={700} color={C.sign}>
            {s.fees}
          </T>
        </g>
      </g>
    </g>
  );
}

/* 4 — a price board, or a phone call */
function Board({ b, t }: SceneProps) {
  const s = t.scenes;
  return (
    <g>
      <g style={{ opacity: b === 1 ? 0.35 : 1, transition: "opacity .5s" }}>
        <Pill x={156} y={40} text={`🪧 ${s.board}`} color={C.blue} size={14} />
        <rect x={36} y={70} width={240} height={150} rx={12} fill="#fff" stroke={C.blue} strokeWidth={3} filter="url(#soft)" />
        <T x={156} y={112} size={14} color={C.mute} weight={700}>
          ETH / USD
        </T>
        <g>
          <T x={156} y={160} size={36} weight={800}>
            3,012
          </T>
          <animate attributeName="opacity" values="1;0.2;1" dur="3s" repeatCount="indefinite" />
        </g>
        <T x={156} y={202} size={11.5} color={C.blue} weight={700}>
          {s.boardRule}
        </T>
        <path d="M156 224 L156 280" stroke={C.blue} strokeWidth={3} strokeDasharray="6 6" className="flow" />
        <Room x={56} y={288} w={200} h={170} screen="3,012" screenColor={C.blue} />
      </g>
      <g className={vis(b >= 1)}>
        <Pill x={480} y={40} text={`📞 ${s.call}`} color={C.sky} size={14} />
        <Person x={420} y={140} s={1.15} color="#7a9cc6" />
        <rect x={436} y={150} width={14} height={24} rx={3} fill={C.ink} />
        <g transform="translate(470 80)">
          <rect width={130} height={44} rx={14} fill="#fff" stroke={C.sky} strokeWidth={2} />
          <T x={65} y={28} size={14} weight={700}>
            {s.callQ}
          </T>
        </g>
        <Slip x={480} y={150} w={120} h={58} text="3,013" stamps={5} color={C.sign} />
        <T x={540} y={232} size={13} weight={800} color={C.sky}>
          ⚡ {s.fast}
        </T>
        <path d="M540 240 L540 280" stroke={C.sky} strokeWidth={3} strokeDasharray="6 6" className="flow" />
        <Room x={430} y={288} w={200} h={170} screen="3,013" screenColor={C.sky} />
      </g>
      <g className={vis(b >= 2)}>
        <Pill x={320} y={528} text={`✓ ${s.sameSig}`} color={C.sign} size={14} />
      </g>
    </g>
  );
}

/* 5 — Chainlink owns no shop */
function NoShop({ b, t }: SceneProps) {
  const s = t.scenes;
  const rooms = [
    { x: 30, y: 60 },
    { x: 250, y: 30 },
    { x: 470, y: 60 },
    { x: 470, y: 250 },
    { x: 30, y: 250 },
  ];
  const W = 130,
    H = 100;
  const team = { x: 320, y: 230 };
  return (
    <g>
      {rooms.map((r, i) => (
        <Path key={`p${i}`} x1={team.x} y1={team.y + 20} x2={r.x + W / 2} y2={r.y + H / 2} />
      ))}
      {rooms.map((r, i) => (
        <Room key={i} x={r.x} y={r.y} w={W} h={H} label={s.chains[i]} />
      ))}
      <g>
        {[-46, 0, 46].map((dx, k) => (
          <Person key={k} x={team.x + dx} y={team.y - 10 + (k === 1 ? -8 : 0)} s={0.85} color={[MSG, "#5aa5a0", "#9a7bd6"][k]} badge={BADGE} />
        ))}
        <T x={team.x} y={team.y + 70} size={14} weight={800} color={C.blueDeep}>
          {s.team}
        </T>
      </g>
      <g className={vis(b === 0)}>
        <rect x={team.x - 90} y={team.y + 84} width={180} height={34} rx={8} fill="none" stroke={C.warn} strokeWidth={2.2} strokeDasharray="6 5" />
        <T x={team.x} y={team.y + 106} size={13} weight={700} color={C.warn}>
          ✗ {s.noShop}
        </T>
      </g>
      <g className={vis(b >= 1)}>
        {rooms.map((r, i) => (
          <circle key={i} r={7} fill={C.blue} stroke="#fff" strokeWidth={2}>
            <animateMotion dur="2.4s" begin={`${i * 0.45}s`} repeatCount="indefinite" path={`M${r.x + W / 2} ${r.y + H / 2} L${team.x} ${team.y + 20}`} />
          </circle>
        ))}
        <g className={vis(b === 1)}>
          <Coin x={team.x} y={team.y + 110} r={18} label="" />
          <T x={team.x} y={team.y + 148} size={13.5} weight={800} color={C.blueDeep}>
            {s.pay}
          </T>
        </g>
      </g>
      <g className={vis(b >= 2)}>
        <rect x={24} y={420} width={290} height={110} rx={16} fill="#fff" stroke={C.line} />
        <rect x={326} y={420} width={290} height={110} rx={16} fill={C.blueSoft} stroke="#c8d6f6" />
        <T x={169} y={462} size={30}>
          🏬
        </T>
        <T x={169} y={500} size={13} weight={700}>
          {s.rent}
        </T>
        <T x={471} y={462} size={30}>
          📦
        </T>
        <T x={471} y={500} size={13} weight={700} color={C.blueDeep}>
          {s.delivery}
        </T>
      </g>
    </g>
  );
}

function Path({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c3d1e6" strokeWidth={6} strokeLinecap="round" strokeDasharray="2 12" />;
}

/* 6 — checking the safe, drawing lots */
function Safe({ b, t }: SceneProps) {
  const s = t.scenes;
  const low = b >= 1;
  return (
    <g>
      <g style={{ opacity: b >= 2 ? 0.35 : 1, transition: "opacity .5s" }}>
        {/* safe */}
        <rect x={30} y={90} width={170} height={190} rx={14} fill="#8b95a3" filter="url(#soft)" />
        <rect x={44} y={104} width={142} height={162} rx={8} fill="#5f6a78" />
        {[0, 1, 2].map((row) =>
          [0, 1].map((col) =>
            low && row === 0 ? null : <rect key={`${row}${col}`} x={60 + col * 58} y={226 - row * 34} width={52} height={26} rx={4} fill={C.gold} stroke="#b88a10" />,
          ),
        )}
        <T x={115} y={300} size={13} weight={800}>
          {s.safe}
        </T>
        <Person x={250} y={140} s={0.95} color="#5aa5a0" badge={BADGE} />
        <g transform="translate(274 150)">
          <rect width={86} height={34} rx={6} fill="#fff" stroke={C.gold} strokeWidth={2} />
          <T x={43} y={23} size={13} weight={800} color="#8a6608">
            {low ? s.count.replace("100", "60") : s.count}
          </T>
        </g>
        {/* coin printer */}
        <g transform="translate(70 340)">
          <rect width={220} height={110} rx={16} fill="#fff" stroke={low ? C.warn : C.sign} strokeWidth={3} filter="url(#soft)" />
          <rect x={20} y={20} width={110} height={18} rx={4} fill={C.line} />
          <T x={170} y={36} size={13} weight={800}>
            {s.printer}
          </T>
          {low ? (
            <g>
              <Cross x={40} y={78} r={14} />
              <T x={62} y={83} size={13} anchor="start" weight={800} color={C.warn}>
                {s.locked}
              </T>
            </g>
          ) : (
            <g>
              {[0, 1, 2].map((k) => (
                <circle key={k} cx={60} cy={60} r={9} fill={C.sky}>
                  <animate attributeName="cx" values="60;250" dur="1.5s" begin={`${k * 0.5}s`} repeatCount="indefinite" />
                </circle>
              ))}
              <Check x={40} y={84} r={12} />
              <T x={60} y={89} size={13} anchor="start" weight={800} color={C.sign}>
                {s.printOk}
              </T>
            </g>
          )}
        </g>
      </g>
      {/* lottery */}
      <g className={vis(b >= 2)}>
        <Pill x={500} y={60} text={`🎲 ${s.lottery}`} color={C.ink} size={14} />
        <circle cx={500} cy={170} r={70} fill="#fff" stroke={C.ink} strokeWidth={3} filter="url(#soft)" />
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0 500 170;360 500 170" dur="5s" repeatCount="indefinite" />
          {[0, 1, 2, 3, 4, 5, 6].map((k) => (
            <circle key={k} cx={500 + 40 * Math.cos(k)} cy={170 + 40 * Math.sin(k)} r={10} fill={[C.warn, C.sky, C.gold, C.sign][k % 4]} />
          ))}
        </g>
        <Token x={500} y={290} r={22} label="7" color={C.sign} />
        <g transform="translate(430 330)">
          <rect width={140} height={50} rx={8} fill="#fff" stroke={C.sign} strokeWidth={2.5} />
          <T x={70} y={32} size={14} weight={800} color={C.sign}>
            {s.cert}
          </T>
        </g>
        <g transform="translate(430 410)">
          <rect width={140} height={50} rx={8} fill="#fff" stroke={C.warn} strokeWidth={2.5} strokeDasharray="6 4" />
          <T x={70} y={32} size={14} weight={800} color={C.warn}>
            9 · {s.changed}
          </T>
        </g>
      </g>
    </g>
  );
}

/* 7 — a border with two checkpoints */
function Border({ b, t }: SceneProps) {
  const s = t.scenes;
  return (
    <g>
      <g style={{ opacity: b >= 1 ? 0.25 : 1, transition: "opacity .5s" }}>
        {s.robbed.map((h, i) => (
          <g key={h.n}>
            <Chain x1={160} y1={70 + i * 50} x2={480} y2={70 + i * 50} r={8} color={C.warn} broken />
            <Pill x={320} y={56 + i * 50} text={`🦹 ${h.n} ${h.v}`} color={C.warn} size={12.5} />
          </g>
        ))}
      </g>
      <Room x={20} y={250} w={130} h={150} label={s.chains[0]} accent={C.guard} />
      <Room x={490} y={250} w={130} h={150} label={s.chains[3]} accent={C.guard} />
      <g className={vis(b >= 1)}>
        <rect x={150} y={352} width={340} height={30} fill="#e7ebf1" />
        <line x1={150} y1={367} x2={490} y2={367} stroke="#fff" strokeWidth={3} strokeDasharray="12 10" />
        {[
          { x: 250, c: C.blue, l: s.post1 },
          { x: 390, c: C.guard, l: s.post2 },
        ].map((p) => (
          <g key={p.l}>
            <polygon points={`${p.x - 34},${276} ${p.x},${254} ${p.x + 34},${276}`} fill={p.c} />
            <rect x={p.x - 30} y={276} width={60} height={70} fill="#fff" stroke={p.c} strokeWidth={2.5} />
            <rect x={p.x - 18} y={288} width={36} height={22} fill={C.blueSoft} />
            <Person x={p.x} y={296} s={0.55} color={p.c} />
            <T x={p.x} y={244} size={12.5} weight={800} color={p.c}>
              {p.l}
            </T>
          </g>
        ))}
        <T x={320} y={420} size={12.5} weight={700} color={C.guard}>
          {s.different}
        </T>
        {b === 1 && (
          <g>
            <Token x={0} y={0} r={12} label="$" color={C.sign} />
            <animateTransform attributeName="transform" type="translate" values="150 367; 490 367" dur="3s" repeatCount="indefinite" />
          </g>
        )}
        <g className={vis(b === 1)}>
          <Pill x={320} y={456} text={`✓ ${s.pass}`} color={C.sign} fill="#e3f6ee" size={14} />
        </g>
      </g>
      <g className={vis(b >= 2)}>
        <rect x={420} y={330} width={14} height={58} fill={C.ink} />
        <g>
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <rect key={k} x={300 + k * 20} y={340} width={20} height={12} fill={k % 2 ? "#fff" : C.warn} stroke={C.warn} />
          ))}
        </g>
        <Pill x={320} y={456} text={`⛔ ${s.closed}`} color={C.warn} fill="#fde8e5" size={14} />
        <Pill x={320} y={520} text={s.moved} color={C.guard} size={13} />
      </g>
    </g>
  );
}

/* 8 — deposit and alarm bell */
function Deposit({ b, p, t }: SceneProps) {
  const s = t.scenes;
  const hours = b >= 2 ? 3 : b === 1 ? Math.max(0, Math.min(3, ((p - 0.25) / 0.2) * 3)) : 0;
  const ring = hours >= 3;
  const ang = (hours / 12) * 360;
  return (
    <g>
      {/* messengers and their deposit */}
      {Array.from({ length: 5 }, (_, k) => (
        <g key={k}>
          <Person x={60 + k * 62} y={70} s={0.8} color={b >= 2 ? "#f0a49b" : [MSG, "#5aa5a0", "#9a7bd6"][k % 3]} badge={BADGE} mood={b >= 2 ? "bad" : undefined} />
          <g className={vis(b >= 2)}>
            <T x={60 + k * 62} y={146} size={12} weight={800} color={C.warn}>
              −700
            </T>
          </g>
          <g className={vis(b === 0)}>
            <circle r={6} fill={C.blue}>
              <animateMotion dur="1.6s" begin={`${k * 0.3}s`} repeatCount="indefinite" path={`M${60 + k * 62} 120 L${185} 220`} />
            </circle>
          </g>
        </g>
      ))}
      <rect x={60} y={200} width={250} height={130} rx={16} fill="#eef4ff" stroke={C.blue} strokeWidth={3} strokeDasharray="0" filter="url(#soft)" />
      {Array.from({ length: 12 }, (_, k) => (
        <polygon key={k} points={hexPts(90 + (k % 6) * 38, 296 - Math.floor(k / 6) * 34, 14)} fill="url(#gHex)" />
      ))}
      <T x={185} y={350} size={13} weight={800} color={C.blueDeep}>
        {s.depositBox}
      </T>
      {/* frozen price board + clock */}
      <g className={vis(b >= 1)}>
        <rect x={400} y={50} width={200} height={110} rx={12} fill="#fff" stroke={ring ? C.warn : C.blue} strokeWidth={3} />
        <T x={500} y={84} size={12.5} color={C.mute} weight={700}>
          ETH / USD
        </T>
        <T x={500} y={124} size={30} weight={800} color="#9aa6b5">
          3,012
        </T>
        <T x={500} y={182} size={12.5} weight={700} color={C.warn}>
          ❄ {s.frozen}
        </T>
        <g transform="translate(500 270)">
          <circle r={62} fill="#fff" stroke={ring ? C.warn : C.ink} strokeWidth={4} filter="url(#soft)" />
          <path d={`M0 0 L0 -56 A56 56 0 ${ang > 180 ? 1 : 0} 1 ${56 * Math.sin((ang * Math.PI) / 180)} ${-56 * Math.cos((ang * Math.PI) / 180)} Z`} fill={C.warn} opacity={0.2} />
          <line x1={0} y1={0} x2={0} y2={-46} stroke={C.ink} strokeWidth={4} strokeLinecap="round" transform={`rotate(${ang})`} />
          <circle r={5} fill={C.ink} />
          <T x={0} y={32} size={17} weight={800} color={ring ? C.warn : C.ink}>
            {hours.toFixed(1)} {s.hours}
          </T>
        </g>
      </g>
      <g className={vis(ring)}>
        <g className="blink">
          <Pill x={500} y={368} text={`🔔 ${s.bell}`} color={C.warn} fill="#fde8e5" size={15} />
        </g>
      </g>
      <g className={vis(b >= 2)}>
        <T x={185} y={178} size={13} weight={800} color={C.warn}>
          {s.fine}
        </T>
        <Person x={420} y={420} s={0.95} color={C.sign} />
        <T x={460} y={448} size={17} anchor="start" weight={800} color={C.sign}>
          {s.reward}
        </T>
        <T x={185} y={400} size={12} color={C.mute}>
          {s.holders}
        </T>
      </g>
    </g>
  );
}

/* 9 — LINK in, LINK out */
function Wages({ b, t }: SceneProps) {
  const s = t.scenes;
  const col = (i: number) => (i < 35 ? C.sky : i < 70 ? C.teal : "#24305e");
  return (
    <g>
      <T x={124} y={40} size={11.5} color={C.mute} weight={700}>
        {s.total}
      </T>
      {Array.from({ length: 100 }, (_, i) => (
        <rect key={i} x={24 + (i % 10) * 20} y={52 + Math.floor(i / 10) * 20} width={17} height={17} rx={3} fill={col(i)} />
      ))}
      {s.split.map((l, i) => (
        <g key={l}>
          <rect x={24} y={262 + i * 22} width={12} height={12} rx={2} fill={[C.sky, C.teal, "#24305e"][i]} />
          <T x={42} y={272 + i * 22} size={12.5} anchor="start">
            {l}
          </T>
        </g>
      ))}
      {/* piggy bank */}
      <g className={vis(b >= 1)}>
        <T x={450} y={40} size={12} weight={700} color={C.mute}>
          {s.feesIn}
        </T>
        {["Ξ", "$", "₿", "₫"].map((c, k) => (
          <Token key={c} x={396 + k * 36} y={70} r={13} label={c} color={C.amber} />
        ))}
        <path d="M450 90 L450 120" stroke={C.amber} strokeWidth={5} />
        <g transform="translate(450 190)">
          <ellipse rx={88} ry={62} fill="#f7b6c8" stroke="#e48aa6" strokeWidth={3} />
          <circle cx={70} cy={-18} r={22} fill="#f7b6c8" stroke="#e48aa6" strokeWidth={3} />
          <ellipse cx={86} cy={-14} rx={8} ry={6} fill="#e48aa6" />
          <rect x={-20} y={-66} width={40} height={8} rx={3} fill="#c56c88" />
          {[-50, -10, 30].map((x) => (
            <rect key={x} x={x} y={52} width={16} height={22} rx={4} fill="#e48aa6" />
          ))}
          <polygon points={hexPts(-14, 4, 22)} fill="url(#gHex)" />
        </g>
        {[0, 1].map((k) => (
          <circle key={k} cx={450} cy={100} r={6} fill={C.blue}>
            <animate attributeName="cy" values="96;126" dur="1.2s" begin={`${k * 0.6}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <T x={450} y={290} size={14} weight={800} color={C.blueDeep}>
          {s.piggy}
        </T>
      </g>
      {/* the big tap */}
      <g className={vis(b >= 2)}>
        <path d="M224 230 C 300 230, 300 350, 380 350" stroke="#24305e" strokeWidth={18} fill="none" />
        <rect x={376} y={336} width={30} height={28} rx={4} fill="#24305e" />
        {[0, 1, 2, 3].map((k) => (
          <circle key={k} cx={420} cy={360} r={7} fill={C.blue}>
            <animate attributeName="cy" values="360;420" dur="0.9s" begin={`${k * 0.22}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <path d="M400 420 L410 480 L560 480 L570 420Z" fill="#fff8de" stroke={C.gold} strokeWidth={3} />
        <T x={485} y={460} size={15} weight={800} color="#8a6608">
          Binance
        </T>
        <T x={300} y={330} size={12} weight={800} color="#24305e" anchor="end">
          {s.tap}
        </T>
        <g transform="translate(24 360)">
          <T x={0} y={0} size={11.5} anchor="start" color={C.mute} weight={700}>
            {s.month.toUpperCase()}
          </T>
          <rect x={0} y={14} width={300} height={22} rx={6} fill={C.warn} />
          <T x={0} y={58} size={13.5} anchor="start" weight={800} color={C.warn}>
            {s.outM}
          </T>
          <rect x={0} y={72} width={22} height={22} rx={6} fill={C.blue} />
          <T x={30} y={89} size={13.5} anchor="start" weight={800} color={C.blue}>
            {s.inM}
          </T>
          <T x={240} y={89} size={24} anchor="start" weight={800} color={C.warn}>
            {s.ratio}
          </T>
        </g>
      </g>
    </g>
  );
}

/* 10 — from 2017 to today */
function Story({ b, t }: SceneProps) {
  const s = t.scenes;
  const X0 = 2017.6,
    X1 = 2026.95;
  const sx = (x: number) => 60 + ((x - X0) / (X1 - X0)) * 550;
  const sy = (v: number) => 360 - ((Math.log10(v) + 1.2) / (Math.log10(70) + 1.2)) * 290;
  const pts: [number, number][] = [
    [2017.72, 0.12], [2018.03, 1.1], [2018.9, 0.3], [2019.4, 1.3], [2019.55, 3.6], [2020.2, 2.6], [2020.62, 20], [2020.95, 12],
    [2021.36, 52.88], [2021.6, 22], [2021.85, 30], [2022.35, 7], [2022.9, 6], [2023.5, 6.5], [2024.2, 18], [2024.6, 10],
    [2024.95, 25], [2025.3, 13], [2025.65, 22], [2026.0, 13], [2026.4, 10], [2026.74, 15.4], [2026.88, 8.85],
  ];
  const d = pts.map(([x, v], i) => `${i ? "L" : "M"}${sx(x).toFixed(1)} ${sy(v).toFixed(1)}`).join(" ");
  const until = [2018.2, 2021.5, 2022.5, X1][b] ?? X1;
  const marks = [
    { x: 2017.72, v: 0.12 },
    { x: 2021.36, v: 52.88 },
    { x: 2022.37, v: 7 },
    { x: 2026.88, v: 8.85 },
  ];
  return (
    <g>
      <T x={60} y={44} size={12} anchor="start" color={C.mute} weight={700}>
        {s.axis.toUpperCase()}
      </T>
      <clipPath id="sclip">
        <rect x={0} y={0} height={560} width={sx(until)} style={{ transition: "width 1.1s cubic-bezier(.3,.6,.2,1)" }} />
      </clipPath>
      {[0.1, 1, 10, 50].map((v) => (
        <g key={v}>
          <line x1={60} x2={612} y1={sy(v)} y2={sy(v)} stroke="#e6ebf0" />
          <T x={52} y={sy(v) + 4} size={11.5} anchor="end" color={C.mute} weight={500}>
            ${v}
          </T>
        </g>
      ))}
      {[2018, 2020, 2022, 2024, 2026].map((y) => (
        <T key={y} x={sx(y)} y={384} size={12} color={C.mute} weight={500}>
          {y}
        </T>
      ))}
      <path d={`${d} L${sx(2026.88)} 360 L${sx(2017.72)} 360Z`} fill={C.teal} opacity={0.13} clipPath="url(#sclip)" />
      <path d={d} stroke={C.teal} strokeWidth={3} fill="none" strokeLinejoin="round" clipPath="url(#sclip)" />
      {marks.map((m, i) => (
        <g key={i} className={vis(b >= i)}>
          <circle cx={sx(m.x)} cy={sy(m.v)} r={7} fill="#fff" stroke={i === 2 ? C.warn : C.ink} strokeWidth={3} />
          <Pill x={Math.min(560, Math.max(80, sx(m.x)))} y={sy(m.v) - 22} text={s.ms[i]} color={i === 2 ? C.warn : C.teal} size={12.5} />
        </g>
      ))}
      {/* the stuck board */}
      <g className={vis(b >= 2)}>
        <rect x={60} y={410} width={260} height={120} rx={14} fill="#fff" stroke={C.warn} strokeWidth={2.5} filter="url(#soft)" />
        <T x={190} y={446} size={13} color={C.mute} weight={700}>
          🪧 {s.board}
        </T>
        <T x={190} y={486} size={26} weight={800} color={C.warn}>
          {s.lunaBoard}
        </T>
        <T x={190} y={516} size={13} weight={700}>
          {s.lunaReal}
        </T>
      </g>
      <g className={vis(b >= 3)}>
        <rect x={350} y={410} width={262} height={120} rx={14} fill="#fff" stroke={C.line} filter="url(#soft)" />
        <T x={481} y={460} size={30} weight={800}>
          {s.ms[3].split("· ")[1]}
        </T>
        <T x={481} y={492} size={14} weight={800} color={C.warn}>
          −84%
        </T>
        <T x={481} y={516} size={11.5} color={C.mute} weight={500}>
          15/11/2026
        </T>
      </g>
    </g>
  );
}

/* 11 — in short */
function Verdict({ b, t }: SceneProps) {
  const s = t.scenes;
  const Row = ({ y, items, color, cracked, on }: { y: number; items: string[]; color: string; cracked?: boolean; on: boolean }) => (
    <g className={vis(on)}>
      <Chain x1={60} y1={y} x2={580} y2={y} r={11} color={color} on={on} broken={cracked} />
      {items.map((l, i) => (
        <g key={l}>
          <polygon points={hexPts(60 + i * 130, y, 28)} fill="#fff" stroke={color} strokeWidth={8} />
          <T x={60 + i * 130} y={y + 6} size={16} weight={800} color={color}>
            {cracked ? "!" : "✓"}
          </T>
          <foreignObject x={i * 130} y={y + 38} width={120} height={50}>
            <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2, textAlign: "center", color: cracked ? C.warn : C.ink }}>{l}</div>
          </foreignObject>
        </g>
      ))}
    </g>
  );
  return (
    <g>
      <Row y={70} items={s.strong} color={C.blue} on />
      <Row y={240} items={s.weak} color={C.warn} cracked on={b >= 1} />
      <g className={vis(b >= 2)}>
        {[-40, 0, 40].map((dx, k) => (
          <Person key={k} x={170 + dx} y={400 - (k === 1 ? 8 : 0)} s={0.8} color={[MSG, "#5aa5a0", "#9a7bd6"][k]} badge={BADGE} />
        ))}
        <T x={170} y={488} size={15} weight={800} color={C.blueDeep}>
          {s.service}
        </T>
        <T x={320} y={440} size={48} weight={800} color={C.warn}>
          ≠
        </T>
        <Coin x={470} y={420} r={34} label="" />
        <T x={470} y={488} size={15} weight={800} color={C.blueDeep}>
          {s.token}
        </T>
      </g>
    </g>
  );
}

export const SCENES = [Pawn, Messenger, Nine, Board, NoShop, Safe, Border, Deposit, Wages, Story, Verdict];
