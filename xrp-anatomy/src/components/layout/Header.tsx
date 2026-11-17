"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { List, X } from "lucide-react";
import { goToChapter, ui } from "@/animations/scrollController";
import { useI18n, type Lang } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { chapters } from "@/data/coins/xrp/chapters";

export default function Header() {
  const { t, lang, setLang } = useI18n();
  const chapter = useStore(ui, (s) => s.chapter);
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[var(--header-h)] border-b border-line/70 bg-paper">
      <div className="flex h-full items-center justify-between gap-4 px-4 md:px-6">
        <button onClick={() => goToChapter(0)} className="flex items-baseline gap-2 text-left" aria-label={t.ui.backToTop}>
          <span className="serif text-[19px] leading-none tracking-tight">{t.ui.brand}</span>
          <span className="tag hidden text-mute sm:inline">/ XRPL</span>
        </button>

        <div className="hidden min-w-0 flex-1 items-center justify-center md:flex">
          <AnimatePresence mode="wait">
            <motion.span
              key={chapter + lang}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="tag truncate text-mute"
            >
              <span className="text-ink">{String(chapter + 1).padStart(2, "0")}</span> {t.ui.of} {t.chapters.length} — <span className="text-accent">{t.acts[chapters[chapter].act]}</span> · {t.chapters[chapter].label}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3">
          <div role="group" aria-label={t.ui.language} className="flex items-center rounded-full border border-line p-[2px]">
            {(["en", "vi"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`tag rounded-full px-2.5 py-1 transition-colors ${lang === l ? "bg-accent text-paper" : "text-ink hover:bg-paper-2"}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 md:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-contents">
            {open ? <X size={18} /> : <List size={18} />}
            <span className="tag">{String(chapter + 1).padStart(2, "0")}/{t.chapters.length}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-contents"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-full border-b border-line bg-paper px-4 py-3 md:hidden"
            aria-label={t.ui.contents}
          >
            <ol className="grid gap-1">
              {t.chapters.map((c, i) => (
                <li key={i}>
                  <button
                    onClick={() => {
                      setOpen(false);
                      goToChapter(i);
                    }}
                    className={`flex w-full items-baseline gap-3 py-1.5 text-left ${i === chapter ? "text-accent" : "text-ink"}`}
                  >
                    <span className="tag w-6 text-mute">{String(i + 1).padStart(2, "0")}</span>
                    <span className="serif text-[17px]">{c.label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
