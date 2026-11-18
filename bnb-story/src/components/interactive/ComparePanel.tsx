"use client";
import { Badge, Panel } from "./ui";
import { useI18n } from "@/lib/i18n";

const DOTS = ["bg-[#f0b90b]", "bg-ink", "bg-[#f0b90b]"];

/** Static side-by-side table (two or three columns). Nothing to click — just read. */
export default function ComparePanel({ which }: { which: "compare" | "versus" }) {
  const { t } = useI18n();
  const P = t.panels[which];
  const cols = "colC" in P ? [P.colA, P.colB, P.colC] : [P.colA, P.colB];
  const dots = which === "versus" ? ["bg-[#f7931a]", "bg-[#6b7bd6]", "bg-[#f0b90b]"] : DOTS;
  return (
    <Panel title={P.title} badge={<Badge kind="fact">{P.asOf}</Badge>}>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            <th className={`tag ${cols.length === 3 ? "w-[22%]" : "w-[30%]"} py-1.5 pr-2 font-normal text-mute`} scope="col" />
            {cols.map((c, i) => (
              <th key={c} className="py-1.5 pr-2" scope="col">
                <span className="tag inline-flex items-center gap-1.5 text-ink">
                  <span aria-hidden className={`inline-block h-2.5 w-2.5 rounded-full ${dots[i]}`} /> {c}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {P.rows.map((r) => {
            const vals = "c" in r ? [r.a, r.b, r.c] : [r.a, r.b];
            return (
              <tr key={r.label} className="border-b border-line/70 align-top">
                <th scope="row" className="tag py-2 pr-2 font-normal leading-snug text-mute">
                  {r.label}
                </th>
                {vals.map((v, i) => (
                  <td key={i} className={`py-2 pr-2 ${cols.length === 3 ? "text-[12px]" : "text-[13px]"} leading-snug text-ink/90`}>
                    {v}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-2 text-[12px] leading-snug text-mute">{P.note}</p>
    </Panel>
  );
}
