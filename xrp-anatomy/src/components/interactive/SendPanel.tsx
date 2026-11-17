"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Pause, Play, RotateCcw, RefreshCw } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { fmt, useStore } from "@/lib/store";
import { sendStore } from "@/lib/simStores";
import { engine } from "@/animations/scrollController";
import {
  DROPS_PER_XRP, INITIAL_WALLETS, applyPayment, canPay, fakeHash, fetchLiveFee, spendable, toXrp,
} from "@/simulations/transactionSimulator";
import { Badge, IconButton, Panel, Slider, Stat } from "./ui";

export default function SendPanel() {
  const { t, locale } = useI18n();
  const P = t.panels.send;
  const s = useStore(sendStore, (x) => x);
  const tween = useRef<gsap.core.Tween | null>(null);
  const proxy = useRef({ t: 0 });

  useEffect(() => {
    let alive = true;
    fetchLiveFee().then((fee) => {
      if (alive && fee) sendStore.set({ fee });
    });
    return () => {
      alive = false;
      tween.current?.kill();
    };
  }, []);

  // the wallet that will pay next run
  const current = s.after;
  const maxXrp = Math.max(1, Math.floor(toXrp(spendable(current.a) - s.fee.drops)));
  const amount = Math.min(s.amountXrp, maxXrp);

  const run = () => {
    tween.current?.kill();
    const before = sendStore.get().after;
    const amountDrops = Math.round(amount * DROPS_PER_XRP);
    const ok = canPay(before, amountDrops, s.fee.drops);
    const after = ok ? applyPayment(before, amountDrops, s.fee.drops) : before;
    const runs = s.runs + 1;
    sendStore.set({ before, after, failed: !ok, hash: ok ? fakeHash(runs * 7919 + amountDrops) : "", runs, t: 0, playing: true });
    proxy.current.t = 0;
    const end = ok ? 6 : 1.4;
    tween.current = gsap.to(proxy.current, {
      t: end,
      duration: engine.reduced ? 0.01 : ok ? 7.5 : 2,
      ease: "none",
      onUpdate: () => sendStore.set({ t: proxy.current.t }),
      onComplete: () => sendStore.set({ playing: false }),
    });
  };

  const togglePause = () => {
    const tw = tween.current;
    if (!tw) return;
    if (tw.paused()) {
      tw.resume();
      sendStore.set({ playing: true });
    } else {
      tw.pause();
      sendStore.set({ playing: false });
    }
  };

  const reset = () => {
    tween.current?.kill();
    tween.current = null;
    proxy.current.t = 0;
    sendStore.set({ t: 0, playing: false, before: INITIAL_WALLETS, after: INITIAL_WALLETS, failed: false, hash: "", runs: 0 });
  };

  const running = !!tween.current && s.t > 0 && s.t < (s.failed ? 1.4 : 6);
  const paused = running && !s.playing;
  const step = Math.min(5, Math.floor(s.t));
  const status = s.failed ? P.unfunded : s.t >= 4 ? P.validated : s.t > 0 ? P.tentative : "—";
  const feeXrp = toXrp(s.fee.drops);

  return (
    <Panel
      title={P.title}
      badge={<Badge kind="sim">{t.ui.simulated}</Badge>}
    >
      <Slider
        id="send-amount"
        label={P.amount}
        value={amount}
        min={1}
        max={maxXrp}
        step={1}
        onChange={(v) => sendStore.set({ amountXrp: v })}
        format={(v) => `${fmt(v, 0, locale)} XRP`}
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <IconButton primary onClick={running ? togglePause : run} label={running ? (paused ? P.resume : P.pause) : P.play}>
          {running && !paused ? <Pause size={13} /> : <Play size={13} />} {running ? (paused ? P.resume : P.pause) : P.play}
        </IconButton>
        <IconButton onClick={run} label={P.replay} disabled={s.runs === 0}>
          <RefreshCw size={13} /> {P.replay}
        </IconButton>
        <IconButton onClick={reset} label={P.reset}>
          <RotateCcw size={13} /> {P.reset}
        </IconButton>
      </div>

      <div className="mt-3.5 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-line pt-3">
        <Stat label={`${t.scenes.send.walletA} · ${P.spendable}`} value={`${fmt(toXrp(spendable(s.t >= 4 ? s.after.a : s.before.a)), 6, locale)}`} />
        <Stat label={`${t.scenes.send.walletB}`} value={`${fmt(toXrp(s.t >= 4 ? s.after.b : s.before.b), 6, locale)}`} />
        <Stat label={P.fee} value={`${fmt(feeXrp, 5, locale)} XRP`} tone="warn" />
        <Stat label={P.result} value={status} tone={s.failed ? "warn" : s.t >= 4 ? "accent" : "ink"} />
      </div>

      <p className="mt-3 min-h-[2.6em] text-[13.5px] leading-snug text-ink" aria-live="polite">
        <span className="tag mr-2 text-mute">
          {P.stepLabel} {s.t > 0 ? step + 1 : 0}/6
        </span>
        {s.t > 0 ? P.stepsDetail[step] : "—"}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-line pt-2.5">
        {s.fee.source === "live" ? <Badge kind="live">{t.ui.live}</Badge> : <Badge kind="fact">{t.ui.verified}</Badge>}
        <span className="text-[12px] leading-snug text-mute">
          {s.fee.source === "live" ? `${P.feeLive} · ${new Date(s.fee.at!).toLocaleTimeString(locale)}` : P.feeIllustrative}
        </span>
      </div>
      <div className="mt-1 text-[11.5px] text-mute">{P.reserveNote}</div>
    </Panel>
  );
}
