"use client";
import { useState } from "react";
import { useSceneTimeline } from "@/hooks/useSceneTimeline";
import { useI18n } from "@/lib/i18n";
import { clamp, fmt, lerp, smooth } from "@/lib/store";
import { CENTER, accountServer, ledgerAccounts, ledgerServers, serverLinks, SENDER, validatorPos } from "@/data/coins/xrp/layouts";
import { C, Callout, DrawPath, Label, TxCard, mix } from "../svg";

const IDX = 1;
/** servers glide onto these validator slots when the scene hands over to consensus */
const SERVER_TO_VALIDATOR = [10, 1, 4, 6, 8];

export default function LedgerScene() {
  const { t, locale } = useI18n();
  const L = t.scenes.ledger;
  const [hover, setHover] = useState(-1);
  const v = useSceneTimeline(
    IDX,
    { vis: 0, nodes: 0, links: 0, labels: 0, sign: 0, travel: 0, relay: 0, pending: 0, exit: 0 },
    (tl, v, at) => {
      tl.to(v, { vis: 1, duration: 0.08, ease: "none" }, at(-0.04))
        .to(v, { nodes: 1, duration: 0.24, ease: "none" }, at(0.0))
        .to(v, { links: 1, duration: 0.22 }, at(0.06))
        .to(v, { labels: 1, duration: 0.14 }, at(0.12))
        .to(v, { sign: 1, duration: 0.16 }, at(0.3))
        .to(v, { travel: 1, duration: 0.1 }, at(0.47))
        .to(v, { relay: 1, duration: 0.24, ease: "none" }, at(0.59))
        .to(v, { pending: 1, duration: 0.12 }, at(0.84))
        .to(v, { exit: 1, duration: 0.22 }, at(0.96))
        .to(v, { vis: 0, duration: 0.06, ease: "none" }, at(1.14));
    },
  );
  if (v.vis <= 0.001) return null;

  const ex = smooth(v.exit);
  const sender = ledgerAccounts[SENDER];
  const s0 = ledgerServers[accountServer[SENDER]];
  const serverPos = ledgerServers.map((s, j) => mix(s, validatorPos(SERVER_TO_VALIDATOR[j], 230), ex));
  const packetStart = { x: sender.x + 34, y: sender.y + 40 };
  const atServer = { x: s0.x, y: s0.y };
  let packet = mix(packetStart, atServer, smooth(v.travel));
  packet = mix(packet, { x: CENTER.x, y: CENTER.y }, smooth(v.pending));
  const relayOrder = [0, 1, 4, 2, 3]; // BFS-ish from server 0

  return (
    <g opacity={v.vis} role="presentation">
      {/* links account→server */}
      {ledgerAccounts.map((a, i) => {
        const s = serverPos[accountServer[i]];
        const p = clamp(v.links * 1.6 - i * 0.08);
        return <DrawPath key={`l${i}`} d={`M${a.x},${a.y} L${s.x},${s.y}`} p={p} width={0.8} color={C.line} opacity={1 - ex} />;
      })}
      {/* server mesh */}
      {serverLinks.map(([a, b], i) => {
        const A = serverPos[a], B = serverPos[b];
        const p = clamp(v.links * 1.4 - 0.25 - i * 0.05);
        return <DrawPath key={`s${i}`} d={`M${A.x},${A.y} L${B.x},${B.y}`} p={p} width={1} color={C.ink} opacity={0.55 * (1 - ex)} />;
      })}
      {/* relay pulses */}
      {v.relay > 0 &&
        v.relay < 1 &&
        serverLinks.map(([a, b], i) => {
          const order = Math.max(relayOrder.indexOf(a), 0);
          const local = clamp(v.relay * 2.2 - order * 0.32 - (i % 2) * 0.1);
          if (local <= 0 || local >= 1) return null;
          const P = mix(serverPos[a], serverPos[b], smooth(local));
          return <circle key={`p${i}`} cx={P.x} cy={P.y} r={4} fill={C.accent} />;
        })}
      {/* servers */}
      {serverPos.map((s, j) => {
        const appear = clamp(v.nodes * 1.8 - 0.6 - j * 0.07);
        const order = relayOrder.indexOf(j);
        const lit = clamp(v.relay * 2.4 - order * 0.36);
        return (
          <g key={`srv${j}`} transform={`translate(${s.x},${s.y}) scale(${appear})`}>
            <rect x={-14} y={-14} width={28} height={28} fill={lit > 0.5 ? C.accentSoft : C.paper} stroke={C.ink} strokeWidth={1.3} transform="rotate(45)" />
            <line x1={-6} y1={-2} x2={6} y2={-2} stroke={C.ink} strokeWidth={0.8} />
            <line x1={-6} y1={2} x2={6} y2={2} stroke={C.ink} strokeWidth={0.8} />
          </g>
        );
      })}
      {/* accounts */}
      {ledgerAccounts.map((a, i) => {
        const appear = clamp(v.nodes * 8 - i * 0.85);
        const isSender = i === SENDER;
        const scale = lerp(1, 0.3, ex);
        return (
          <g
            key={`a${i}`}
            transform={`translate(${a.x},${a.y}) scale(${scale})`}
            opacity={appear * (1 - ex)}
            style={{ cursor: "pointer", pointerEvents: v.exit > 0.5 ? "none" : "auto" }}
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(-1)}
            onClick={() => setHover((h) => (h === i ? -1 : i))}
            tabIndex={0}
            role="button"
            aria-label={`${L.simulated} ${a.addr}`}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(-1)}
          >
            <circle r={30} fill="transparent" />
            <circle r={21} fill={C.paper} stroke={hover === i ? C.accent : C.ink} strokeWidth={hover === i ? 2 : 1.3} />
            <circle r={13 * clamp(appear)} fill={isSender && v.sign > 0 ? C.accent : C.ink} opacity={0.12 + (isSender ? 0.6 * v.sign : 0)} />
            <circle r={3} fill={C.ink} />
            <Label x={0} y={38} anchor="middle" opacity={v.labels} size={10}>
              {a.addr.slice(0, 6)}…
            </Label>
          </g>
        );
      })}
      {/* hover card */}
      {hover >= 0 && v.exit < 0.5 && <AccountCard i={hover} locale={locale} />}

      {/* account state callout */}
      <Callout from={{ x: ledgerAccounts[2].x + 22, y: ledgerAccounts[2].y }} to={{ x: 760, y: 78 }} text={L.accountState} sub="addr · balance · seq · flags" p={v.labels * (1 - ex)} />
      <Callout from={{ x: ledgerServers[2].x + 18, y: ledgerServers[2].y }} to={{ x: 820, y: 640 }} text={L.server} sub="rippled / xrpld" p={v.labels * (1 - ex) * (1 - v.sign)} />

      {/* signing */}
      <TxCard x={sender.x + 34} y={sender.y + 52} signed={v.sign} label={L.payment} opacity={clamp(v.sign * 3) * (1 - v.travel)} />
      <Label x={sender.x + 76} y={sender.y + 58} color={C.accent} opacity={clamp(v.sign * 2 - 1) * (1 - v.travel)}>
        {L.signed} · seq {ledgerAccounts[SENDER].seq + 1}
      </Label>

      {/* packet */}
      {v.travel > 0 && (
        <g transform={`translate(${packet.x},${packet.y})`}>
          <circle r={lerp(9, 40, smooth(v.pending))} fill="url(#glow)" />
          <rect x={-7} y={-5} width={14} height={10} rx={1.5} fill={C.accent} stroke={C.ink} strokeWidth={0.8} />
        </g>
      )}
      <Label x={540} y={60} opacity={clamp(v.relay * 3) * (1 - v.pending)} color={C.ink}>
        {L.relay}
      </Label>
      <Label x={CENTER.x} y={CENTER.y + 56} anchor="middle" color={C.warn} opacity={smooth(v.pending) * (1 - ex)}>
        {L.pending}
      </Label>
    </g>
  );

  function AccountCard({ i, locale }: { i: number; locale: string }) {
    const a = ledgerAccounts[i];
    const left = a.x > 600;
    const x = left ? a.x - 250 : a.x + 30;
    const y = Math.min(Math.max(a.y - 70, 20), 840);
    const reserve = 1 + 0.2 * a.objects;
    const rows: [string, string][] = [
      [L.address, a.addr.slice(0, 14) + "…"],
      [L.balance, `${fmt(a.balance, 6, locale)} XRP`],
      [L.sequence, String(a.seq)],
      [L.reserve, `${fmt(reserve, 1, locale)} XRP`],
      [L.state, L.active],
    ];
    return (
      <g transform={`translate(${x},${y})`} style={{ pointerEvents: "none" }}>
        <rect width={222} height={128} fill={C.paper} stroke={C.ink} strokeWidth={1} />
        <rect width={222} height={20} fill={C.ink} />
        <Label x={8} y={14} color={C.paper} size={9.5}>
          {L.simulated}
        </Label>
        {rows.map(([k, val], r) => (
          <g key={k}>
            <Label x={8} y={40 + r * 20} size={9.5}>
              {k}
            </Label>
            <Label x={214} y={40 + r * 20} anchor="end" color={C.ink} size={10} upper={false} spacing="0">
              {val}
            </Label>
          </g>
        ))}
      </g>
    );
  }
}

