"use client";
import { Badge, Panel } from "./ui";
import { chart, focusEvent } from "@/animations/chartController";
import { ui } from "@/animations/scrollController";
import { events, type BtcEvent } from "@/data/coins/btc/events";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { fmtDate } from "@/lib/btc";

export function KindDot({ e }: { e: BtcEvent }) {
  const red = e.kind === "crash" || (e.kind === "macro" && e.cat === "crisis");
  const c = red ? "bg-warn" : e.kind === "ath" ? "bg-gold" : "bg-accent";
  const shape = e.kind === "crash" ? "rotate-45" : e.kind === "ath" ? "[clip-path:polygon(50%_0,100%_100%,0_100%)]" : e.kind === "tech" || e.kind === "halving" ? "" : "rounded-full";
  return <span className={`inline-block h-2.5 w-2.5 shrink-0 ${c} ${shape}`} aria-hidden />;
}

export default function EventsPanel() {
  const { t, lang } = useI18n();
  const p = t.panels.events;
  const chapter = useStore(ui, (s) => s.chapter);
  const selected = useStore(chart, (s) => s.selected);
  const list = events.filter((e) => e.chapter === chapter && !e.future);
  return (
    <Panel title={p.title} badge={<Badge kind="fact">{list.length}</Badge>}>
      <ul className="grid gap-1">
        {list.map((e) => {
          const on = selected === e.id;
          return (
            <li key={e.id}>
              <button
                onClick={() => focusEvent(on ? null : e)}
                aria-pressed={on}
                className={`group grid w-full grid-cols-[auto_1fr] items-baseline gap-x-3 border-l-2 px-3 py-1.5 text-left transition-colors ${on ? "border-accent bg-accent/10" : "border-transparent hover:border-line hover:bg-paper/50"}`}
              >
                <KindDot e={e} />
                <span className="min-w-0">
                  <span className="tag block text-mute">{fmtDate(e.t, lang)} · {t.cats[e.cat]}</span>
                  <span className={`serif block text-[15.5px] leading-snug ${on ? "text-accent" : "text-ink group-hover:text-accent"}`}>{e[lang].title}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-[12.5px] leading-snug text-mute">{p.hint}</p>
    </Panel>
  );
}
