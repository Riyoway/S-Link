"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { FontSize, FontFamily, Language } from "@/types/index";

interface AppearanceContextType {
  fontSize: FontSize;
  fontFamily: FontFamily;
  language: Language;
  setFontSize: (size: FontSize) => void;
  setFontFamily: (family: FontFamily) => void;
  setLanguage: (lang: Language) => void;
  dictionaries: Record<string, any>;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export function AppearanceProvider({ children, initialLang }: { children: React.ReactNode, initialLang?: Language }) {
  const [fontSize, setFontSizeState] = useState<FontSize>("medium");
  const [fontFamily, setFontFamilyState] = useState<FontFamily>("default");
  const [language, setLanguageState] = useState<Language>(initialLang || "ja_JP");
  const [dictionaries, setDictionaries] = useState<Record<string, any>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load saved settings
    const savedFontSize = localStorage.getItem("appearance-font-size") as FontSize;
    const savedFontFamily = localStorage.getItem("appearance-font-family") as FontFamily;

    // Only load language from local storage if no initial language is provided (e.g. not logged in or first visit)
    // If initialLang is provided (from session/DB), we prioritize that.
    if (!initialLang) {
      const savedLanguage = localStorage.getItem("appearance-language") as Language;
      if (savedLanguage) setLanguageState(savedLanguage);
    }

    if (savedFontSize) setFontSizeState(savedFontSize);
    if (savedFontFamily) setFontFamilyState(savedFontFamily);

    setMounted(true);
  }, [initialLang]);

  // Fetch dictionaries when language changes
  useEffect(() => {
    if (!mounted) return;

    const loadDictionaries = async () => {
      try {
        const fetchWithFallback = async (filename: string) => {
          try {
            let res = await fetch(`/locales/${language}/${filename}`);
            if (!res.ok && language !== "ja_JP") {
              res = await fetch(`/locales/ja_JP/${filename}`);
            }
            return res.ok ? await res.json() : {};
          } catch (e) {
            console.error(`Failed to fetch ${filename}`, e);
            return {};
          }
        };

        // Load common dictionaries
        const [sidebar, beta, memo, settings, common, todo, bus, guide, tools, events] = await Promise.all([
          fetchWithFallback("sidebar.json"),
          fetchWithFallback("beta.json"),
          fetchWithFallback("memo.json"),
          fetchWithFallback("settings.json"),
          fetchWithFallback("common.json"),
          fetchWithFallback("todo.json"),
          fetchWithFallback("bus.json"),
          fetchWithFallback("guide.json"),
          fetchWithFallback("tools.json"),
          fetchWithFallback("events.json")
        ]);

        setDictionaries(prev => ({
          ...prev,
          sidebar,
          beta,
          memo,
          settings,
          common,
          todo,
          bus,
          guide,
          tools,
          events
        }));
      } catch (error) {
        console.error("Failed to load dictionaries", error);
      }
    };

    loadDictionaries();
  }, [language, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.remove("text-scale-small", "text-scale-medium", "text-scale-large", "text-scale-extra-large");
    root.classList.add(`text-scale-${fontSize}`);
    localStorage.setItem("appearance-font-size", fontSize);
    return () => {
      root.classList.remove("text-scale-small", "text-scale-medium", "text-scale-large", "text-scale-extra-large");
    };
  }, [fontSize, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.remove("font-style-default", "font-style-gothic", "font-style-mincho", "font-style-rounded");
    root.classList.add(`font-style-${fontFamily}`);
    localStorage.setItem("appearance-font-family", fontFamily);
    return () => {
      root.classList.remove("font-style-default", "font-style-gothic", "font-style-mincho", "font-style-rounded");
    };
  }, [fontFamily, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("appearance-language", language);
    // Here we could also update the HTML lang attribute if needed
    // document.documentElement.lang = language;
  }, [language, mounted]);

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
  };

  const setFontFamily = (family: FontFamily) => {
    setFontFamilyState(family);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <AppearanceContext.Provider value={{ fontSize, fontFamily, language, dictionaries, setFontSize, setFontFamily, setLanguage }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (context === undefined) {
    throw new Error("useAppearance must be used within an AppearanceProvider");
  }
  return context;
}
