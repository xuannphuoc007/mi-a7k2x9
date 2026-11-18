"use client";
import { Badge, Panel } from "./ui";
import { useI18n } from "@/lib/i18n";

/** Static side-by-side table. Nothing to click — just read. */
export default function ComparePanel() {
  const { t } = useI18n();
  const P = t.panels.compare;
  return (
    <Panel title={P.title} badge={<Badge kind="fact">{P.asOf}</Badge>}>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            <th className="tag w-[30%] py-1.5 pr-2 font-normal text-mute" scope="col" />
            <th className="py-1.5 pr-2" scope="col">
              <span className="tag inline-flex items-center gap-1.5 text-accent">
                <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full bg-[#f0b90b]" /> {P.colA}
              </span>
            </th>
            <th className="py-1.5" scope="col">
              <span className="tag inline-flex items-center gap-1.5 text-ink">
                <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full bg-ink" /> {P.colB}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {P.rows.map((r) => (
            <tr key={r.label} className="border-b border-line/70 align-top">
              <th scope="row" className="tag py-2 pr-2 font-normal leading-snug text-mute">
                {r.label}
              </th>
              <td className="py-2 pr-2 text-[13px] leading-snug text-ink/90">{r.a}</td>
              <td className="py-2 text-[13px] leading-snug text-ink/90">{r.b}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-[12px] leading-snug text-mute">{P.note}</p>
    </Panel>
  );
}
