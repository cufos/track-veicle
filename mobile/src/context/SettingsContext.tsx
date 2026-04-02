import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageService } from '../services/storageService';

interface SettingsContextProps {
  globalReminderDays: number;
  setGlobalReminderDays: (days: number) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  resetAppData: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
);

const SETTINGS_KEY = 'APP_SETTINGS';

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [globalReminderDays, setGlobalReminderDays] = useState(7);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const loadSettings = async () => {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.globalReminderDays) {
          setGlobalReminderDays(parsed.globalReminderDays);
        }
        if (parsed.theme) {
          setTheme(parsed.theme);
        }
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const saveSettings = async () => {
      await AsyncStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ globalReminderDays, theme })
      );
    };
    saveSettings();
  }, [globalReminderDays]);

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
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
