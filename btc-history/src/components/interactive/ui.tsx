"use client";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function Badge({ kind, children }: { kind: "sim" | "ill" | "live" | "fact"; children: ReactNode }) {
  const cls =
    kind === "live"
      ? "border-accent text-accent"
      : kind === "fact"
        ? "border-ink text-ink"
        : kind === "ill"
          ? "border-warn text-warn"
          : "border-mute text-mute";
  return (
    <span className={`tag inline-flex items-center gap-1.5 rounded-full border px-2 py-[3px] ${cls}`}>
      {kind === "live" && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />}
      {children}
    </span>
  );
}

export function Panel({ title, badge, children, id }: { title: string; badge?: ReactNode; children: ReactNode; id?: string }) {
  return (
    <section
      id={id}
      aria-label={title}
      className="relative border border-line bg-paper-2/95 shadow-[0_0_0_1px_rgba(247,147,26,0.06),0_18px_50px_-20px_rgba(247,147,26,0.25)] backdrop-blur-sm"
    >
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <span aria-hidden className="absolute left-0 top-0 h-[2px] w-16 bg-accent" />
        <h3 className="serif text-[19px] leading-tight">{title}</h3>
        {badge}
      </header>
      <div className="px-4 py-3.5">{children}</div>
    </section>
  );
}

export function Slider({
  label, value, min, max, step = 1, onChange, format, id,
}: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; format: (v: number) => string; id: string;
}) {
  return (
    <div className="py-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="tag text-mute">
          {label}
        </label>
        <output htmlFor={id} className="mono text-[13px] text-ink">
          {format(value)}
        </output>
      </div>
      <input id={id} type="range" className="hair-range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

export function Segmented<T extends string>({ options, value, onChange, label }: { options: { value: T; label: string }[]; value: T | null; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex w-full border border-line">
      {options.map((o, i) => {
        const on = value === o.value;
        return (
          <button
            key={o.value}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`tag relative flex-1 px-2 py-2 text-center transition-colors ${i > 0 ? "border-l border-line" : ""} ${on ? "text-paper" : "text-ink hover:text-accent"}`}
          >
            {on && <motion.span layoutId={`seg-${label}`} className="absolute inset-0 bg-accent" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Stat({ label, value, tone = "ink" }: { label: string; value: ReactNode; tone?: "ink" | "accent" | "warn" }) {
  const c = tone === "accent" ? "text-accent" : tone === "warn" ? "text-warn" : "text-ink";
  return (
    <div className="min-w-0">
      <div className="tag truncate text-mute">{label}</div>
      <div className={`mono truncate text-[14px] ${c}`}>{value}</div>
    </div>
  );
}

export function IconButton({ onClick, label, children, disabled, primary }: { onClick: () => void; label: string; children: ReactNode; disabled?: boolean; primary?: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`tag inline-flex items-center gap-1.5 border px-2.5 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
        primary ? "border-accent bg-accent text-paper hover:bg-gold hover:border-gold" : "border-line text-ink hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </motion.button>
  );
}
