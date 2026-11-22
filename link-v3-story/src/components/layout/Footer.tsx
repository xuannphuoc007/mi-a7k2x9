"use client";
import { ArrowUp, ExternalLink } from "lucide-react";
import { goToChapter } from "@/animations/scrollController";
import { references } from "@/data/coins/link/references";
import { useI18n } from "@/lib/i18n";
import { useReducedMotion } from "@/hooks/useMedia";

export default function Footer() {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const kindLabel = { protocol: t.ui.kinds.protocol, market: t.ui.kinds.market, data: t.ui.data, public: t.ui.kinds.public } as const;
  return (
    <footer className="relative z-[45] border-t border-line bg-paper">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.1fr_1fr] md:px-10">
        <div>
          <div className="tag text-mute">{t.ui.sources}</div>
          <h2 className="serif mt-3 text-[38px] leading-none">{t.references.heading}</h2>
          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-ink/80">{t.references.note}</p>
          <ol className="mt-6 divide-y divide-line border-y border-line">
            {references.map((r, i) => (
              <li key={r.id} className="grid grid-cols-[2rem_1fr] gap-2 py-2.5">
                <span className="mono text-[11px] text-mute">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <a href={r.url} target="_blank" rel="noreferrer" className="group inline-flex items-baseline gap-1.5 text-[14.5px] hover:text-accent">
                    <span className="underline decoration-line underline-offset-4 group-hover:decoration-accent">{r.title}</span>
                    <ExternalLink size={11} className="shrink-0 translate-y-[1px] text-mute" />
                  </a>
                  <div className="tag mt-0.5 text-mute">
                    {r.publisher} · {kindLabel[r.kind]}
                    {r.date ? ` · ${r.date}` : ""} · {t.ui.accessed} {r.accessed}
                  </div>
                  <div className="mt-0.5 text-[12.5px] leading-snug text-mute">{r.supports}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="md:pt-14">
          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="tag text-warn">{t.ui.disclaimerTitle}</div>
            <p className="mt-3 text-[14px] leading-relaxed">{t.ui.disclaimer}</p>
          </div>
          {reduced && <p className="tag mt-4 text-mute">{t.ui.reducedMotion}</p>}
          <p className="mt-6 text-[13px] text-mute">{t.ui.credits}</p>
          <button onClick={() => goToChapter(0)} className="tag mt-8 inline-flex items-center gap-2 rounded-full border border-accent px-4 py-2 text-accent hover:bg-accent hover:text-paper">
            <ArrowUp size={13} /> {t.ui.backToTop}
          </button>
          <div className="serif mt-16 text-[64px] leading-none text-line md:text-[88px]">The Missing Link</div>
        </div>
      </div>
    </footer>
  );
}
