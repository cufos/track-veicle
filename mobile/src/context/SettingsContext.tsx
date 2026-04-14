import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storageService } from "../services/storageService";
import i18n, { loadLocale } from "../i18n";

interface SettingsContextProps {
  globalReminderDays: number;
  setGlobalReminderDays: (days: number) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;

  language: "es" | "en" | "it";
  setLanguage: (lang: "es" | "en" | "it") => void;

  kmWarningThreshold: number;
  setKmWarningThreshold: (km: number) => void;
  kmCriticalThreshold: number;
  setKmCriticalThreshold: (km: number) => void;

  resetAppData: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined,
);

const SETTINGS_KEY = "APP_SETTINGS";

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [globalReminderDays, setGlobalReminderDays] = useState(7);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [kmWarningThreshold, setKmWarningThreshold] = useState(100000);
  const [kmCriticalThreshold, setKmCriticalThreshold] = useState(200000);
  const [language, setLanguageState] = useState<"es" | "en" | "it">("es");

  const setLanguage = (lang: "es" | "en" | "it") => {
    setLanguageState(lang);
    loadLocale(lang);
  };

  useEffect(() => {
    const loadSettings = async () => {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);

      let initialLanguage: "es" | "en" | "it" = "es";

      if (data) {
        const parsed = JSON.parse(data);

        if (parsed.globalReminderDays) {
          setGlobalReminderDays(parsed.globalReminderDays);
        }
        if (parsed.theme) {
          setTheme(parsed.theme);
        }
        if (parsed.kmWarningThreshold) {
          setKmWarningThreshold(parsed.kmWarningThreshold);
        }
        if (parsed.kmCriticalThreshold) {
          setKmCriticalThreshold(parsed.kmCriticalThreshold);
        }
        if (parsed.language) {
          initialLanguage = parsed.language;
        }
      }

      setLanguage(initialLanguage);
      loadLocale(initialLanguage);
    };

    loadSettings();
  }, []);

  useEffect(() => {
    const saveSettings = async () => {
      await AsyncStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({
          globalReminderDays,
          theme,
          language,
          kmWarningThreshold,
          kmCriticalThreshold,
        }),
      );
    };
    saveSettings();
  }, [globalReminderDays, theme, language]);


  const resetAppData = async () => {
    await storageService.clearAll();
    await AsyncStorage.removeItem(SETTINGS_KEY);
  };

  return (
    <SettingsContext.Provider
      value={{
        globalReminderDays,
        setGlobalReminderDays,
        theme,
        setTheme,
        language,
        setLanguage,
        kmWarningThreshold,
        setKmWarningThreshold,
        kmCriticalThreshold,
        setKmCriticalThreshold,
        resetAppData,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
};
