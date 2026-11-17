"use client";
import { useEffect, useRef, useState } from "react";
import { Pickaxe, RotateCcw, Square } from "lucide-react";
import { Badge, IconButton, Panel, Segmented, Stat } from "./ui";
import { useI18n } from "@/lib/i18n";
import { sha256hex } from "@/lib/btc";

const NETWORK = 1.06e21; // ≈ hashes per second, May 2026 (Coin Metrics)
const PREV = "00000000000000000001f3a9c2…";

function sci(n: number) {
  if (n < 1e6) return Math.round(n).toLocaleString("en-US");
  const e = Math.floor(Math.log10(n));
  return (
    <>
      {(n / 10 ** e).toFixed(1)}×10<sup>{e}</sup>
    </>
  );
}

export default function MiningPanel() {
  const { t } = useI18n();
  const p = t.panels.mining;
  const [diff, setDiff] = useState<"2" | "3" | "4" | "5">("4");
  const [running, setRunning] = useState(false);
  const [state, setState] = useState({ tries: 0, hash: sha256hex(`${PREV}|Alice→Bob 0.5 BTC|0`), nonce: 0, rate: 0, found: false });
  const raf = useRef(0);
  const st = useRef({ nonce: 0, tries: 0, t0: 0 });
  const height = 945_678;

  useEffect(() => {
    if (!running) return;
    const target = "0".repeat(Number(diff));
    const s = st.current;
    if (!s.t0) s.t0 = performance.now();
    const loop = () => {
      const start = performance.now();
      let h = "";
      let found = false;
      while (performance.now() - start < 9) {
        for (let i = 0; i < 200; i++) {
          h = sha256hex(`block ${height}|prev ${PREV}|Alice→Bob 0.5 BTC|nonce ${s.nonce}`);
          s.tries++;
          if (h.startsWith(target)) {
            found = true;
            break;
          }
          s.nonce++;
        }
        if (found) break;
      }
      const el = (performance.now() - s.t0) / 1000;
      setState({ tries: s.tries, hash: h, nonce: s.nonce, rate: s.tries / Math.max(el, 0.001), found });
      if (found) {
        setRunning(false);
        return;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [running, diff]);

  const reset = () => {
    setRunning(false);
    st.current = { nonce: 0, tries: 0, t0: 0 };
    setState({ tries: 0, hash: sha256hex(`${PREV}|Alice→Bob 0.5 BTC|0`), nonce: 0, rate: 0, found: false });
  };

  const d = Number(diff);
  let lead = 0;
  while (lead < state.hash.length && state.hash[lead] === "0") lead++;

  return (
    <Panel title={p.title} badge={<Badge kind="live">SHA-256</Badge>}>
      <div className="tag mb-1.5 text-mute">{p.difficulty}</div>
      <Segmented
        label={p.difficulty}
        value={diff}
        onChange={(v) => {
          reset();
          setDiff(v);
        }}
        options={(["2", "3", "4", "5"] as const).map((v) => ({ value: v, label: `${v} ${p.zeros}` }))}
      />
      <div className="mt-3 border border-line bg-paper/60 p-2.5">
        <div className="tag text-mute">{p.header}</div>
        <div className="mono mt-1 break-all text-[11px] leading-snug text-ink/70">
          block {height} · prev {PREV} · Alice→Bob 0.5 BTC · nonce <span className="text-gold">{state.nonce}</span>
        </div>
        <div className="tag mt-2 text-mute">{p.hash}</div>
        <div className={`mono mt-0.5 break-all text-[12px] leading-snug ${state.found ? "text-up" : "text-mute"}`} aria-live="off">
          <span className={state.found ? "text-up" : "text-accent"}>{state.hash.slice(0, lead)}</span>
          {state.hash.slice(lead)}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {!running ? (
          <IconButton primary onClick={() => { if (state.found) reset(); setRunning(true); }} label={p.start}>
            <Pickaxe size={14} /> {p.start}
          </IconButton>
        ) : (
          <IconButton onClick={() => setRunning(false)} label={p.stop}>
            <Square size={13} /> {p.stop}
          </IconButton>
        )}
        <IconButton onClick={reset} label={p.reset}>
          <RotateCcw size={13} />
        </IconButton>
        {state.found && <span className="tag text-up" role="status">✓ {p.found}</span>}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 border-t border-line pt-3">
        <Stat label={p.tries} value={state.tries.toLocaleString("en-US")} tone="accent" />
        <Stat label={p.expected} value={(16 ** d).toLocaleString("en-US")} />
        <Stat label={p.speed} value={`${state.rate ? Math.round(state.rate).toLocaleString("en-US") : "—"}${p.perSec}`} />
      </div>
      <p className="mt-3 text-[12.5px] leading-snug text-mute">
        {p.network}{" "}
        {state.rate > 0 && <span className="text-ink">{p.compare.split("{x}")[0]}<span className="mono text-gold">{sci(NETWORK / state.rate)}</span>{p.compare.split("{x}")[1]}</span>}
      </p>
    </Panel>
  );
}
