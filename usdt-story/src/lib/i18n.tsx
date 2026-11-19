"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { en, vi, type Dict } from "@/data/coins/usdt/translations";

export type Lang = "en" | "vi";
const dicts: Record<Lang, Dict> = { en, vi };

type Ctx = { lang: Lang; t: Dict; setLang: (l: Lang) => void; locale: string };
const I18nContext = createContext<Ctx>({ lang: "en", t: en, setLang: () => {}, locale: "en-US" });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get("lang");
      const saved = (fromUrl || window.localStorage.getItem("usdt-lang")) as Lang | null;
      if (saved === "vi" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = dicts[lang].meta.title;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem("usdt-lang", l);
    } catch {}
  };

  return (
    <I18nContext.Provider value={{ lang, t: dicts[lang], setLang, locale: lang === "vi" ? "vi-VN" : "en-US" }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
