"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ui } from "@/animations/scrollController";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export default function ScrollHint() {
  const { t } = useI18n();
  const interacted = useStore(ui, (s) => s.interacted);
  const ready = useStore(ui, (s) => s.ready);
  return (
    <AnimatePresence>
      {ready && !interacted && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="pointer-events-none fixed top-[calc(50svh-110px)] left-1/2 z-40 md:top-auto md:bottom-6 flex -translate-x-1/2 flex-col items-center gap-3 md:left-[calc(var(--stage-left)/2)]"
          aria-hidden
        >
          <span className="tag text-ink">{t.ui.scroll}</span>
          <span className="relative block h-10 w-px overflow-hidden bg-line">
            <motion.span
              className="absolute left-0 top-0 block h-4 w-px bg-ink"
              animate={{ y: [-16, 40] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
