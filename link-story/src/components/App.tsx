"use client";
import { I18nProvider, useI18n } from "@/lib/i18n";
import Header from "@/components/layout/Header";
import ChapterNav from "@/components/layout/ChapterNav";
import ScrollHint from "@/components/layout/ScrollHint";
import Footer from "@/components/layout/Footer";
import Story from "@/components/storytelling/Story";

function Shell() {
  const { t } = useI18n();
  return (
    <>
      <a href="#content" className="tag sr-only z-[100] bg-ink px-3 py-2 text-paper focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        {t.ui.skip}
      </a>
      <Header />
      <ChapterNav />
      <ScrollHint />
      <Story />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <Shell />
    </I18nProvider>
  );
}
