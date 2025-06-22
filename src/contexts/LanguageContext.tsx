import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { translations } from "../data/translations";
import { LanguageContextType } from "../types";

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("he"); // Default to Hebrew

  const translate = useCallback(
    (key: string) => {
      const langTranslations =
        translations[language as keyof typeof translations];
      return (langTranslations as any)[key] || key;
    },
    [language]
  );

  // Update HTML lang attribute and body classes when language changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
      document.documentElement.dir = language === "he" ? "rtl" : "ltr";

      // Remove existing language classes
      document.body.classList.remove(
        "hebrew-text",
        "english-text",
        "rtl",
        "ltr"
      );

      // Add appropriate font class and direction
      if (language === "he") {
        document.body.classList.add("hebrew-text", "rtl");
      } else {
        document.body.classList.add("english-text", "ltr");
      }
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use LanguageContext
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
