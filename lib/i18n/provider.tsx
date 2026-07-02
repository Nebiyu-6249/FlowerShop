"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { dictionaries, type DictKey, type Lang } from "@/lib/i18n/dictionaries";

interface I18nCtx {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: (key: DictKey) => string;
  setLang: (l: Lang) => void;
}

const Ctx = createContext<I18nCtx>({ lang: "en", dir: "ltr", t: (k) => dictionaries.en[k], setLang: () => {} });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // restore choice + flip <html dir lang> so the whole layout mirrors correctly
  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem("fleuraya-lang") as Lang)) || "en";
    setLangState(saved === "ar" ? "ar" : "en");
  }, []);

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    document.body.classList.toggle("font-arabic", lang === "ar");
    localStorage.setItem("fleuraya-lang", lang);
  }, [lang]);

  const value: I18nCtx = {
    lang,
    dir: lang === "ar" ? "rtl" : "ltr",
    t: (key) => dictionaries[lang][key] ?? dictionaries.en[key],
    setLang: setLangState,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
