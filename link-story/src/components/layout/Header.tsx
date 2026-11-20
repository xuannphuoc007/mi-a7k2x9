"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { List, X } from "lucide-react";
import { goToChapter, ui } from "@/animations/scrollController";
import { useI18n, type Lang } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { chapters } from "@/data/coins/link/chapters";
import { asset } from "@/lib/asset";

export default function Header() {
  const { t, lang, setLang } = useI18n();
  const chapter = useStore(ui, (s) => s.chapter);
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-3 top-3 z-50 h-[50px] rounded-full border border-white/80 bg-white/90 shadow-[0_10px_30px_-14px_rgba(29,43,58,0.35)] backdrop-blur-md md:inset-x-6">
      <div className="flex h-full items-center justify-between gap-4 pl-3 pr-2 md:pl-4">
        <button onClick={() => goToChapter(0)} className="flex items-baseline gap-2 text-left" aria-label={t.ui.backToTop}>
          <img src={asset("/img/link-mark.png")} alt="" width={24} height={27} className="self-center" />
          <span className="serif text-[17px] leading-none">{t.ui.brand}</span>
        </button>

        <div className="hidden min-w-0 flex-1 items-center justify-center md:flex">
          <AnimatePresence mode="wait">
            <motion.span
              key={chapter + lang}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="truncate text-[13px] font-semibold text-mute"
            >
              <span style={{ color: chapters[chapter].line }}>{t.acts[chapters[chapter].act]}</span> · {t.chapters[chapter].label}
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
            className="absolute inset-x-0 top-[calc(100%+8px)] rounded-3xl border border-line bg-white px-4 py-3 shadow-lg md:hidden"
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
                    <span className="tag flex w-8 items-center gap-1.5 text-mute"><span className="h-2 w-2 rounded-full" style={{ background: chapters[i].line }} />{String(i + 1).padStart(2, "0")}</span>
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
