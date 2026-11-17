"use client";
import { useEffect, useRef, useState } from "react";
import { Binary, EyeOff } from "lucide-react";
import { Badge, IconButton, Panel, Stat } from "./ui";
import { useI18n } from "@/lib/i18n";

const HEX = "04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73";
const BYTES = HEX.match(/../g)!;
const PREFIX = 8;
const MSG = BYTES.slice(PREFIX).map((b) => String.fromCharCode(parseInt(b, 16))).join("");

export default function GenesisPanel() {
  const { t } = useI18n();
  const p = t.panels.genesis;
  const [n, setN] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef(0);

  useEffect(() => {
    if (!running) return;
    timer.current = window.setInterval(() => {
      setN((v) => {
        if (v >= MSG.length) {
          setRunning(false);
          return v;
        }
        return v + 1;
      });
    }, 28);
    return () => window.clearInterval(timer.current);
  }, [running]);

  const done = n >= MSG.length;
  return (
    <Panel title={p.title} badge={<Badge kind="fact">2009</Badge>}>
      <div className="tag text-mute">{p.raw}</div>
      <div className="mono mt-2 flex flex-wrap gap-x-[5px] gap-y-[3px] text-[11.5px] leading-none" aria-hidden>
        {BYTES.map((b, i) => {
          const k = i - PREFIX;
          const decoded = k >= 0 && k < n;
          const ch = k >= 0 ? MSG[k] : "";
          return (
            <span
              key={i}
              className={`inline-block w-[1.6em] py-[3px] text-center transition-colors duration-150 ${
                k < 0 ? "text-mute/50" : decoded ? "bg-accent/15 text-accent" : k === n && running ? "bg-gold/30 text-gold" : "text-ink/70"
              }`}
            >
              {decoded ? (ch === " " ? "·" : ch) : b}
            </span>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-2">
        {!done ? (
          <IconButton primary onClick={() => setRunning(true)} label={p.decode} disabled={running}>
            <Binary size={14} /> {p.decode}
          </IconButton>
        ) : (
          <IconButton onClick={() => { setN(0); setRunning(false); }} label={p.reset}>
            <EyeOff size={14} /> {p.reset}
          </IconButton>
        )}
      </div>
      <div className="mt-3 min-h-[4.5rem] border-l-2 border-accent pl-3" aria-live="polite">
        <div className="tag text-mute">{p.message}</div>
        <p className="serif mt-1 text-[18px] leading-snug text-ink">
          {MSG.slice(0, n)}
          {!done && n > 0 && <span className="blink text-accent">▌</span>}
        </p>
        {done && <p className="mt-1.5 text-[13px] leading-snug text-mute">{p.note}</p>}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-line pt-3">
        <Stat label={p.reward} value={p.rewardVal} tone="accent" />
        <Stat label={p.hashL} value="000000000019d6…8ce26f" />
      </div>
    </Panel>
  );
}
